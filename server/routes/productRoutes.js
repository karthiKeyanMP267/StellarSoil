import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createProduct,
  getNearbyProducts,
  searchProducts,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Public routes
router.get('/nearby', getNearbyProducts);
router.get('/search', searchProducts);

// Protected routes for farmers
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
