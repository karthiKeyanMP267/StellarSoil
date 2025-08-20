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
  getFarmStats
} from '../controllers/farmController.js';

const router = express.Router();

// Public routes
router.get('/nearby', getNearbyFarms);
router.get('/stats', getFarmStats);
router.get('/', getAllFarms);
router.get('/:id', getFarmById);

// Protected routes
router.post('/:id/reviews', protect, addFarmReview);
router.get('/profile/me', protect, farmer, getFarmProfile);
router.put('/profile/me', protect, farmer, updateFarmProfile);

// Image upload routes
router.post('/images', protect, farmer, upload.array('images', 5), uploadFarmImages);
router.delete('/images', protect, farmer, deleteFarmImage);

export default router;
