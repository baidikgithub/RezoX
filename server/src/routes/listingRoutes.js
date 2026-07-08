import express from "express";
import {
  createBooking,
  createListing,
  createReview,
  deleteListing,
  getBookings,
  getFavorites,
  getListingById,
  getListings,
  getReviews,
  toggleFavorite,
  updateBookingStatus,
  updateListing
} from "../controllers/listingController.js";
import upload from "../middleware/upload.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getListings);
router.get("/favorites/me", authenticate, getFavorites);
router.get("/bookings/me", authenticate, getBookings);
router.get("/:id", getListingById);
router.post("/", authenticate, authorize("admin", "agent"), upload.array("images", 10), createListing);
router.put("/:id", authenticate, authorize("admin", "agent"), upload.array("images", 10), updateListing);
router.delete("/:id", authenticate, authorize("admin"), deleteListing);
router.post("/:id/favorite", authenticate, toggleFavorite);
router.post("/:id/bookings", authenticate, createBooking);
router.patch("/bookings/:id", authenticate, authorize("admin", "agent"), updateBookingStatus);
router.get("/:id/reviews", getReviews);
router.post("/:id/reviews", authenticate, createReview);

export default router;
