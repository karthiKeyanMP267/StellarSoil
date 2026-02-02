import User from '../models/User.js';
import Farm from '../models/Farm.js';
import jwt from 'jsonwebtoken';
import { extractRegionFromAddress } from '../services/regionUtil.js';
import { verifyFirebaseIdToken } from '../services/firebaseAdmin.js';
import { v4 as uuidv4 } from 'uuid';
import dns from 'dns/promises';
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/emailService.js';

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

const createEmailVerificationToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { token, tokenHash, expires };
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const normalizedEmail = (email || '').trim().toLowerCase();
    const blockedDomains = new Set([
      'example.com',
      'example.org',
      'example.net',
      'test.com',
      'test.org',
      'fake.com',
      'mailinator.com',
      'tempmail.com',
      '10minutemail.com',
      'guerrillamail.com'
    ]);

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const emailDomain = normalizedEmail.split('@')[1];

    if (!normalizedEmail || !emailRegex.test(normalizedEmail) || (emailDomain && blockedDomains.has(emailDomain))) {
      return res.status(400).json({ msg: 'Please enter a valid email address' });
    }

    if (emailDomain) {
      const mxCheckEnabled = process.env.EMAIL_MX_CHECK !== 'false';
      if (mxCheckEnabled) {
        try {
          const mxRecords = await dns.resolveMx(emailDomain);
          if (!mxRecords || mxRecords.length === 0) {
            return res.status(400).json({ msg: 'Email domain is not configured for mail' });
          }
        } catch (err) {
          return res.status(400).json({ msg: 'Email domain is not configured for mail' });
        }
      }
    }
    
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    if (!['user', 'farmer'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role specified' });
    }

    const { token, tokenHash, expires } = createEmailVerificationToken();

    const userData = {
      name,
      email: normalizedEmail,
      password,
      role,
      isVerified: role === 'user',
      emailVerified: false,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: expires
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
    const emailResult = await sendVerificationEmail(user.email, token);

    if (role === 'user') {
      res.status(201).json({
        msg: 'Registration successful! Please verify your email before logging in.',
        verificationSent: emailResult.sent,
        verificationUrl: emailResult.verifyUrl,
        user: {
          id: user._id,
          name: user.name,
          role: user.role === 'consumer' ? 'user' : user.role, // Normalize for frontend
          isVerified: true,
          emailVerified: false
        }
      });
    } else {
      res.status(201).json({
        msg: 'Registration successful! Please verify your email and wait for admin approval before logging in.',
        verificationSent: emailResult.sent,
        verificationUrl: emailResult.verifyUrl,
        user: {
          id: user._id,
          name: user.name,
          role: user.role === 'consumer' ? 'user' : user.role, // Normalize for frontend
          isVerified: false,
          emailVerified: false
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

    if (user.emailVerified === false) {
      return res.status(401).json({ msg: 'Please verify your email before logging in' });
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
        role: user.role === 'consumer' ? 'user' : user.role, // Normalize for frontend
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Login failed' });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { idToken, role } = req.body;
    if (!idToken) {
      return res.status(400).json({ msg: 'Google ID token is required' });
    }

    let decoded;
    try {
      decoded = await verifyFirebaseIdToken(idToken);
    } catch (err) {
      return res.status(401).json({ msg: 'Invalid Google token' });
    }

    const email = decoded?.email?.toLowerCase();
    const name = decoded?.name || decoded?.displayName || 'User';
    const isEmailVerified = decoded?.email_verified === true;

    if (!email) {
      return res.status(400).json({ msg: 'Google account email not available' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      if (role && role !== 'user') {
        return res.status(400).json({ msg: 'Google sign-in is only supported for user accounts' });
      }

      user = await User.create({
        name,
        email,
        password: uuidv4(),
        role: 'user',
        isVerified: true,
        emailVerified: isEmailVerified || true
      });
    }

    if (user.emailVerified === false && isEmailVerified) {
      user.emailVerified = true;
      user.emailVerificationTokenHash = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
    }

    if (!user.isActive) {
      return res.status(401).json({ msg: 'Your account has been deactivated' });
    }

    if (user.emailVerified === false) {
      return res.status(401).json({ msg: 'Please verify your email before logging in' });
    }

    if (user.role === 'farmer' && !user.isVerified) {
      return res.status(401).json({ msg: 'Your account is pending admin approval' });
    }

    const { accessToken, refreshToken } = generateToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
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
    return res.status(500).json({ msg: 'Google authentication failed' });
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

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ msg: 'Verification token is required' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired verification token' });
    }

    user.emailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.json({ success: true, msg: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Email verification failed' });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ msg: 'Email already verified' });
    }

    const { token, tokenHash, expires } = createEmailVerificationToken();
    user.emailVerificationTokenHash = tokenHash;
    user.emailVerificationExpires = expires;
    await user.save();

    const emailResult = await sendVerificationEmail(user.email, token);

    return res.json({
      success: true,
      verificationSent: emailResult.sent,
      verificationUrl: emailResult.verifyUrl
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Failed to resend verification email' });
  }
};