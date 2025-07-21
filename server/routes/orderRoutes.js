import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getBuyerOrders,
  getFarmOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getBuyerOrders);
router.get('/farm/:farmId', protect, getFarmOrders);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;
