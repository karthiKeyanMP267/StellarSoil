import { body, param, query } from 'express-validator';

// Product creation validation
export const createProductValidator = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .notEmpty().withMessage('Product description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value > 0).withMessage('Price must be greater than 0'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isNumeric().withMessage('Quantity must be a number')
    .custom(value => value > 0).withMessage('Quantity must be greater than 0'),
  body('unit')
    .notEmpty().withMessage('Unit is required')
    .isIn(['kg', 'g', 'lb', 'piece', 'bunch', 'dozen', 'liter', 'liters']).withMessage('Invalid unit'),
  body('category')
    .notEmpty().withMessage('Category is required'),
  body('isOrganic')
    .isBoolean().withMessage('isOrganic must be a boolean'),
  body('harvestDate')
    .optional()
    .isDate().withMessage('Invalid harvest date format'),
];

// Product update validation
export const updateProductValidator = [
  param('id').isMongoId().withMessage('Invalid product ID format'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value > 0).withMessage('Price must be greater than 0'),
  body('quantity')
    .optional()
    .isNumeric().withMessage('Quantity must be a number')
    .custom(value => value > 0).withMessage('Quantity must be greater than 0'),
  body('unit')
    .optional()
    .isIn(['kg', 'g', 'lb', 'piece', 'bunch', 'dozen', 'liter', 'liters']).withMessage('Invalid unit'),
  body('isOrganic')
    .optional()
    .isBoolean().withMessage('isOrganic must be a boolean'),
];

// Product search validation
export const searchProductsValidator = [
  query('minPrice')
    .optional()
    .isNumeric().withMessage('Minimum price must be a number'),
  query('maxPrice')
    .optional()
    .isNumeric().withMessage('Maximum price must be a number'),
  query('isOrganic')
    .optional()
    .isIn(['true', 'false']).withMessage('isOrganic must be a boolean string'),
];

// Nearby products validation
export const nearbyProductsValidator = [
  query('longitude')
    .notEmpty().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude value'),
  query('latitude')
    .notEmpty().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude value'),
  query('radius')
    .optional()
    .isNumeric().withMessage('Radius must be a number')
    .custom(value => value > 0).withMessage('Radius must be greater than 0'),
];

// Product ID validation
export const productIdValidator = [
  param('id').isMongoId().withMessage('Invalid product ID format'),
];