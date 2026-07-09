import express from 'express';
import { generateQuestions, evaluateInterview, getResults, getResultById, deleteResult } from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate/:resumeId', protect, generateQuestions);
router.post('/evaluate', protect, evaluateInterview);
router.get('/results', protect, getResults);
router.get('/results/:id', protect, getResultById);
router.delete('/results/:id', protect, deleteResult);

export default router;
