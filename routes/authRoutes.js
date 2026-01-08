// backend/routes/authRoutes.js
import express from 'express';
import { signup, login, verify } from '../controllers/authController.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.post('/signup', uploadSingle, signup); 
router.post('/login', login);
router.get('/verify', verify);

export default router;