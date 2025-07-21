import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authentication middleware
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ msg: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ msg: 'User not found or account deactivated' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Not authorized, invalid token' });
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
