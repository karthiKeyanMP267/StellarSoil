import express from 'express';
import { protect, user } from '../middleware/authMiddleware.js';
import {
  initializePayment,
  verifyPayment,
  handleUPIStatus
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/initialize', protect, user, initializePayment);
router.post('/verify', protect, user, verifyPayment);
router.post('/upi-status', protect, user, handleUPIStatus);

export default router;
