import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createProduct,
  getNearbyProducts,
  searchProducts,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getPriceRecommendation,
  getGovernmentPrice,
  getPriceTrend
} from '../controllers/productController.js';
import validateRequest from '../middleware/validationMiddleware.js';
import { 
  createProductValidator, 
  updateProductValidator, 
  searchProductsValidator, 
  nearbyProductsValidator,
  productIdValidator
} from '../validators/productValidators.js';

const router = express.Router();

// Public routes
router.get('/nearby', nearbyProductsValidator, validateRequest, getNearbyProducts);
router.get('/search', searchProductsValidator, validateRequest, searchProducts);
router.get('/price/recommendation', getPriceRecommendation);
router.get('/price/government', getGovernmentPrice);
router.get('/price/trend', getPriceTrend);

// Protected routes for farmers
router.get('/mine', protect, getMyProducts);
router.post('/', protect, createProductValidator, validateRequest, createProduct);
router.put('/:id', protect, updateProductValidator, validateRequest, updateProduct);
router.delete('/:id', protect, productIdValidator, validateRequest, deleteProduct);

export default router;
