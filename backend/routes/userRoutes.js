import express from "express";
import { getAllUsers, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserProfile);
router.put("/:id", authMiddleware, updateUserProfile);
export default router;