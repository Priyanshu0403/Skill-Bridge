import express from "express";
const router = express.Router();
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;