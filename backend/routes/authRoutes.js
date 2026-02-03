import express from "express";
import { signup, login, getMe, updateProfilePicture, removeProfilePicture } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import { uploadProfileImage } from "../middleware/upload.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", signup);
router.post("/login", login);

// Protected routes (authentication required)
router.get("/me", authMiddleware, getMe);
router.put("/profile-picture", authMiddleware, uploadProfileImage.single('profileImage'), updateProfilePicture);
router.delete("/profile-picture", authMiddleware, removeProfilePicture);

export default router;
