import { body, param } from 'express-validator';

// Order creation validation
export const createOrderValidator = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId')
    .isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isNumeric().withMessage('Quantity must be a number')
    .custom(value => value > 0).withMessage('Quantity must be greater than 0'),
  body('deliveryType')
    .isIn(['pickup', 'delivery']).withMessage('Invalid delivery type'),
  body('deliveryAddress')
    .custom((value, { req }) => {
      if (req.body.deliveryType === 'delivery' && !value) {
        throw new Error('Delivery address is required for delivery orders');
      }
      return true;
    }),
  body('deliveryAddress.street')
    .custom((value, { req }) => {
      if (req.body.deliveryType === 'delivery' && !value) {
        throw new Error('Street address is required');
      }
      return true;
    }),
  body('deliveryAddress.city')
    .custom((value, { req }) => {
      if (req.body.deliveryType === 'delivery' && !value) {
        throw new Error('City is required');
      }
      return true;
    }),
  body('deliveryAddress.state')
    .custom((value, { req }) => {
      if (req.body.deliveryType === 'delivery' && !value) {
        throw new Error('State is required');
      }
      return true;
    }),
  body('deliveryAddress.zipCode')
    .custom((value, { req }) => {
      if (req.body.deliveryType === 'delivery' && !value) {
        throw new Error('Zip code is required');
      }
      if (req.body.deliveryType === 'delivery' && !/^\d{6}$/.test(value)) {
        throw new Error('Invalid zip code format');
      }
      return true;
    }),
  body('deliverySlot')
    .notEmpty().withMessage('Delivery slot is required'),
  body('paymentMethod')
    .isIn(['cod', 'online', 'upi']).withMessage('Invalid payment method'),
];

// Order status update validation
export const updateOrderStatusValidator = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

// Order ID validation
export const orderIdValidator = [
  param('id').isMongoId().withMessage('Invalid order ID'),
];

// Farm ID validation
export const farmIdValidator = [
  param('farmId').isMongoId().withMessage('Invalid farm ID'),
];

// Order verification validation
export const verifyOrderDeliveryValidator = [
  body('orderId').isMongoId().withMessage('Invalid order ID'),
  body('verificationCode')
    .notEmpty().withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 characters'),
];

// Regenerate code validation
export const regenerateCodeValidator = [
  param('orderId').isMongoId().withMessage('Invalid order ID'),
];

// Update delivery address validation
export const updateAddressValidator = [
  param('orderId').isMongoId().withMessage('Invalid order ID'),
  body('deliveryAddress')
    .notEmpty().withMessage('Delivery address is required'),
  body('deliveryAddress.street')
    .notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city')
    .notEmpty().withMessage('City is required'),
  body('deliveryAddress.state')
    .notEmpty().withMessage('State is required'),
  body('deliveryAddress.zipCode')
    .notEmpty().withMessage('Zip code is required')
    .matches(/^\d{6}$/).withMessage('Invalid zip code format'),
];