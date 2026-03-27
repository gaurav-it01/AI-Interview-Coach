import express from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  getUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);
router.route('/profile').get(protect, getUserProfile);

export default router;
