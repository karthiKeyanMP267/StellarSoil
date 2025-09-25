import User from '../models/User.js';
import Farm from '../models/Farm.js';
import jwt from 'jsonwebtoken';
import { extractRegionFromAddress } from '../services/regionUtil.js';

const generateToken = (user) => {
  // Access token with shorter expiry (1 hour)
  const accessToken = jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      email: user.email,
      version: user.tokenVersion || 0
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '1h',
      algorithm: 'HS256'
    }
  );

  // Refresh token with longer expiry (7 days)
  const refreshToken = jwt.sign(
    { 
      id: user._id,
      version: user.tokenVersion || 0
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '7d',
      algorithm: 'HS256'
    }
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    if (!['user', 'farmer'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role specified' });
    }

    const userData = {
      name,
      email,
      password,
      role,
      isVerified: role === 'user' // User accounts are verified by default, farmer accounts need admin approval
    };

    if (role === 'farmer') {
      if (!req.file) {
        return res.status(400).json({ msg: 'Kisan ID document is required for farmer registration' });
      }

      userData.kisanId = {
        documentPath: req.file.path,
        verified: false
      };
    }

    const user = await User.create(userData);
    
    // Only generate token for regular users, farmers need to wait for approval
    if (role === 'user') {
      const token = generateToken(user);
      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          isVerified: true
        }
      });
    } else {
      res.status(201).json({
        msg: 'Registration successful! Please wait for admin approval before logging in.',
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          isVerified: false
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ msg: 'Your account has been deactivated' });
    }

    if (user.role === 'farmer' && !user.isVerified) {
      return res.status(401).json({ msg: 'Your account is pending admin approval' });
    }

    const { accessToken, refreshToken } = generateToken(user);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Login failed' });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching user profile' });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users' });
  }
};

// Return current user with farm and parsed region details
export const getMe = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, msg: 'Unauthorized' });
    }

    // Fresh fetch to include latest fields (but exclude password)
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

    // Resolve farm by explicit reference or ownership
    let farm = null;
    if (user.farmId) {
      farm = await Farm.findById(user.farmId).lean();
    }
    if (!farm) {
      farm = await Farm.findOne({ ownerId: user._id }).lean();
    }

    // Prefer structured defaultRegion if present; fallback to parsed address
    const parsed = extractRegionFromAddress(user.address || farm?.address || '');
    const region = {
      state: user.defaultRegion?.state || parsed.state,
      district: user.defaultRegion?.district || parsed.district,
      market: user.defaultRegion?.market || parsed.market,
      variety: user.defaultRegion?.variety || undefined
    };

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        address: user.address || undefined,
        farmId: user.farmId || undefined,
        defaultRegion: user.defaultRegion || undefined
      },
      farm: farm ? {
        id: farm._id,
        name: farm.name,
        address: farm.address,
        ownerId: farm.ownerId
      } : null,
      region
    });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ success: false, msg: 'Failed to fetch profile' });
  }
};

export const approveFarmer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'farmer') {
      return res.status(404).json({ msg: 'Farmer not found' });
    }
    user.isVerified = true;
    await user.save();
    res.json({ msg: 'Farmer approved', user });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to approve farmer' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting user' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ msg: 'No refresh token provided' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ msg: 'Invalid refresh token' });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateToken(user);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Refresh token expired, please login again' });
    }
    res.status(401).json({ msg: 'Invalid refresh token' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address, defaultRegion } = req.body;
    const userId = req.user._id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email is already in use' });
      }
    }

    // Update user
    const update = {
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined
    };
    if (defaultRegion && typeof defaultRegion === 'object') {
      const clean = {};
      const fields = ['state','district','market','variety'];
      for (const k of fields) {
        const v = typeof defaultRegion[k] === 'string' ? defaultRegion[k].trim() : defaultRegion[k];
        if (v) clean[k] = v;
      }
      update.defaultRegion = Object.keys(clean).length ? clean : undefined;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      msg: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};