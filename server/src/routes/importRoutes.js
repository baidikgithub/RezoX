import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { importListingsFromCsv, ensureImportSchema } from "../services/csvImportService.js";
import { verifyDriveAccess } from "../services/googleDriveService.js";

const router = express.Router();

/**
 * POST /api/import/csv
 * Import listings from a CSV file. The source is determined automatically:
 * - If GOOGLE_DRIVE_FILE_ID is set, uses the Google Drive API (service account)
 * - Otherwise falls back to CSV_URL (public HTTP download)
 */
router.post("/csv", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    await ensureImportSchema();
    const sourceUrl = req.body.sourceUrl || process.env.CSV_URL || process.env.GOOGLE_DRIVE_FILE_ID;
    const result = await importListingsFromCsv({ sourceUrl });
    res.json({
      message: "CSV import completed successfully.",
      ...result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/import/drive/verify
 * Verify that the Google Drive service account can access the configured file.
 */
router.get("/drive/verify", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const fileId = process.env.GOOGLE_DRIVE_FILE_ID;
    if (!fileId) {
      return res.status(400).json({ ok: false, error: "GOOGLE_DRIVE_FILE_ID is not set in .env" });
    }
    const result = await verifyDriveAccess(fileId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
