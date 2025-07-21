import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  addToCart,
  getCarts,
  updateCartItem,
  removeFromCart
} from '../controllers/cartController.js';

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.post('/add', addToCart);
router.get('/', getCarts);
router.put('/:cartId/items/:productId', updateCartItem);
router.delete('/:cartId/items/:productId', removeFromCart);

export default router;
