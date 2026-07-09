import express from 'express';
import { uploadResume, getResumes, downloadResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, upload.single('document'), uploadResume)
  .get(protect, getResumes);

router.route('/download/:id')
  .get(protect, downloadResume);

export default router;
