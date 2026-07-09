import express from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  googleAuth,
  getUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/verify/:token', verifyEmail);
router.route('/profile').get(protect, getUserProfile);

export default router;
