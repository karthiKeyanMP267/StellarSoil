/**
 * Utility functions for OTP (One-Time Password) generation and management
 */

/**
 * Generates a random numeric OTP of specified length
 * @param {number} length - Length of the OTP to generate (default 6)
 * @returns {string} Generated OTP
 */
export const generateNumericOTP = (length = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

/**
 * Generates an alphanumeric OTP of specified length
 * @param {number} length - Length of the OTP to generate (default 6)
 * @returns {string} Generated OTP
 */
export const generateAlphanumericOTP = (length = 6) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
};

/**
 * Check if an OTP is expired
 * @param {Date} generatedAt - When the OTP was generated
 * @param {number} expiryMinutes - Expiration time in minutes (default 30)
 * @returns {boolean} True if expired, false if still valid
 */
export const isOTPExpired = (generatedAt, expiryMinutes = 30) => {
  if (!generatedAt) return true;
  
  const now = new Date();
  const expirationTime = new Date(generatedAt.getTime() + expiryMinutes * 60000);
  
  return now > expirationTime;
};