import express from 'express';
import * as resumeController from '../controllers/resumeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/latest', requireAuth, resumeController.getLatestResume);
router.post('/parse', requireAuth, resumeController.parseResume);

export default router;
