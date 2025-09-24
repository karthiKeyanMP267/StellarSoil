import express from 'express';
import { protect, farmer } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';
import {
  getFarmProfile,
  updateFarmProfile,
  getNearbyFarms,
  getFarmById,
  addFarmReview,
  uploadFarmImages,
  deleteFarmImage,
  getAllFarms,
  getFarmStats,
  getMyFarmStats,
  getMyTodaySummary
} from '../controllers/farmController.js';

const router = express.Router();

// Public routes
router.get('/nearby', getNearbyFarms);
router.get('/stats', getFarmStats);

// Protected routes (specific before dynamic)
router.get('/profile/me', protect, farmer, getFarmProfile);
router.put('/profile/me', protect, farmer, updateFarmProfile);
router.post('/:id/reviews', protect, addFarmReview);

// Public listing routes
router.get('/', getAllFarms);
// Farmer-specific stats endpoints (must be before dynamic ':id')
router.get('/me/stats', protect, farmer, getMyFarmStats);
router.get('/me/summary', protect, farmer, getMyTodaySummary);
router.get('/:id', getFarmById);

// Image upload routes
router.post('/images', protect, farmer, upload.array('images', 5), uploadFarmImages);
router.delete('/images', protect, farmer, deleteFarmImage);

export default router;
