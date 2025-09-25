import express from 'express';
import { register, login, getAllUsers, deleteUser, approveFarmer, refreshToken, updateProfile, getMe } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import validateRequest from '../middleware/validationMiddleware.js';
import { registerValidator, loginValidator, profileUpdateValidator, userIdValidator } from '../validators/authValidators.js';

const router = express.Router();

// Auth routes
router.post('/register', upload.single('kisanId'), registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.post('/refresh-token', refreshToken);
router.put('/profile', protect, profileUpdateValidator, validateRequest, updateProfile);
router.get('/me', protect, getMe);

// Admin: manage users
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, userIdValidator, validateRequest, deleteUser);
router.put('/approve-farmer/:id', protect, admin, userIdValidator, validateRequest, approveFarmer);

export default router;