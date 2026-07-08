import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, authorize("admin", "agent"), getAnalytics);

export default router;
