import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authentication middleware
export const protect = async (req, res, next) => {
  try {
    // Check for token in various places
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      // Get token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      // Get token from cookie
      token = req.cookies.token;
    } else if (req.headers['x-access-token']) {
      // Get token from x-access-token header
      token = req.headers['x-access-token'];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        msg: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if token is about to expire (within 5 minutes)
      const tokenExp = new Date(decoded.exp * 1000);
      const now = new Date();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (tokenExp - now < fiveMinutes) {
        res.set('X-Token-Expiring', 'true');
      }

      // Get user from token
      const user = await User.findById(decoded.id)
        .select('-password')
        .lean(); // Use lean() for better performance

      if (!user) {
        return res.status(401).json({
          success: false,
          msg: 'Token is valid but user no longer exists.'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          msg: 'Your account has been deactivated.'
        });
      }

      // Add user info to request
      req.user = user;
      console.log('Auth Middleware - User authenticated:', { 
        userId: user._id, 
        userIdAsString: user._id.toString(),
        role: user.role,
        hasId: !!user.id
      });
      next();
    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          msg: 'Token has expired. Please log in again.',
          isExpired: true
        });
      }
      if (tokenError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          msg: 'Invalid token. Please log in again.',
          isInvalid: true
        });
      }
      throw tokenError;
    }
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(500).json({
      success: false,
      msg: 'An error occurred while authenticating.'
    });
  }
};

// Role-based middleware with additional checks
const roleCheck = (role, requireVerified = false) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: 'Authentication required' });
  }
  
  if (req.user.role !== role) {
    return res.status(403).json({ msg: `Access denied: ${role} only` });
  }
  
  if (requireVerified && !req.user.isVerified) {
    return res.status(403).json({ msg: 'Account pending verification' });
  }
  
  next();
};

// Role-specific middleware
export const admin = roleCheck('admin');
export const farmer = roleCheck('farmer', true); // Requires verified status
export const user = roleCheck('user');
