import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { uploadPostImage } from "../middleware/upload.js";
import {
  createPost,
  getPosts,
  likePost,
  commentPost,
  editComment,
  deleteComment,
  likeComment,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", authMiddleware, uploadPostImage.single('image'), createPost);
router.get("/", getPosts);
router.post("/:postId/like", authMiddleware, likePost);
router.post("/:postId/comment", authMiddleware, commentPost);
router.put("/:postId/comment/:commentId", authMiddleware, editComment);
router.delete("/:postId/comment/:commentId", authMiddleware, deleteComment);
router.post("/:postId/comment/:commentId/like", authMiddleware, likeComment);

export default router;
