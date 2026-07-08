import express from "express";
import { changePassword, getProfile, listUsers, updateProfile, updateUserRole } from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, updateProfile);
router.put("/me/password", authenticate, changePassword);
router.get("/", authenticate, authorize("admin"), listUsers);
router.patch("/:id/role", authenticate, authorize("admin"), updateUserRole);

export default router;
