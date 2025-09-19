import { body, param } from 'express-validator';

// Registration validation
export const registerValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name should be at least 2 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
  body('role')
    .isIn(['customer', 'farmer', 'doctor', 'admin']).withMessage('Invalid role'),
];

// Login validation
export const loginValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// Profile update validation
export const profileUpdateValidator = [
  body('name')
    .optional()
    .isLength({ min: 2 }).withMessage('Name should be at least 2 characters'),
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
  body('address')
    .optional()
    .isLength({ min: 5 }).withMessage('Address should be at least 5 characters'),
  body('pincode')
    .optional()
    .matches(/^[0-9]{6}$/).withMessage('Please enter a valid 6-digit pincode'),
];

// Param validation
export const userIdValidator = [
  param('id').isMongoId().withMessage('Invalid user ID format'),
];