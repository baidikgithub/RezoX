import express from "express";
import { getNotifications, markNotificationRead } from "../controllers/notificationController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getNotifications);
router.patch("/:id/read", authenticate, markNotificationRead);

export default router;
