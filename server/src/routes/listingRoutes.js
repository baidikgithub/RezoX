import express from "express";
import { getListings, getListingById, createListing, updateListing } from "../controllers/listingController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListingById);
router.post("/", upload.array("images", 10), createListing);
router.put("/:id", upload.array("images", 10), updateListing);

export default router;
