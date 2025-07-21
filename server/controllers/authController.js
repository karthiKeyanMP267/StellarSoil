import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
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

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
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
    const user = await User.findById(req.user.id);
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