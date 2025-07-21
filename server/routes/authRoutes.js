import express from 'express';
import { register, login, getAllUsers, deleteUser, approveFarmer } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', upload.single('kisanId'), register);
router.post('/login', login);

// Admin: manage users
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/approve-farmer/:id', protect, admin, approveFarmer);

export default router;