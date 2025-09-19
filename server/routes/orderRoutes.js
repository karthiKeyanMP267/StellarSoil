import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getBuyerOrders,
  getFarmOrders,
  getFarmerOrders,
  updateOrderStatus,
  cancelOrder,
  verifyOrderDelivery,
  regenerateVerificationCode,
  updateDeliveryAddress
} from '../controllers/orderController.js';
import validateRequest from '../middleware/validationMiddleware.js';
import {
  createOrderValidator,
  updateOrderStatusValidator,
  orderIdValidator,
  farmIdValidator,
  verifyOrderDeliveryValidator,
  regenerateCodeValidator,
  updateAddressValidator
} from '../validators/orderValidators.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createOrderValidator, validateRequest, createOrder);
router.get('/my-orders', protect, getBuyerOrders);
router.get('/farm/:farmId', protect, farmIdValidator, validateRequest, getFarmOrders);
router.get('/farmer-orders', protect, getFarmerOrders);
router.put('/:id/status', protect, updateOrderStatusValidator, validateRequest, updateOrderStatus);
router.put('/:id/cancel', protect, orderIdValidator, validateRequest, cancelOrder);
router.post('/verify-delivery', protect, verifyOrderDeliveryValidator, validateRequest, verifyOrderDelivery);
router.post('/:orderId/regenerate-code', protect, regenerateCodeValidator, validateRequest, regenerateVerificationCode);
router.put('/:orderId/update-address', protect, updateAddressValidator, validateRequest, updateDeliveryAddress);

export default router;
