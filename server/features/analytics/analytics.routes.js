import express from 'express';
import {
  getDashboardStats,
  getSalesAnalytics,
  getUserAnalytics,
  getFarmAnalytics,
  getProductAnalytics
} from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All analytics routes require admin access
router.use(protect);
router.use(admin);

// Dashboard overview
router.get('/dashboard', getDashboardStats);

// Sales analytics
router.get('/sales', getSalesAnalytics);

// User analytics
router.get('/users', getUserAnalytics);

// Farm analytics
router.get('/farms', getFarmAnalytics);

// Product analytics
router.get('/products', getProductAnalytics);

export default router;
