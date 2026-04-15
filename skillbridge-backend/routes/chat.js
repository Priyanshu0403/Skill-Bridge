import express from 'express';
import * as chatController from '../controllers/chatController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/message', requireAuth, chatController.sendChatMessage);

export default router;
