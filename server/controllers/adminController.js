import User from '../models/User.js';
import Farm from '../models/Farm.js';

// Admin functions for managing farmer verifications
export const getPendingFarmers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const pendingFarmers = await User.find({
      role: 'farmer',
      isVerified: false,
      isActive: true
    }).select('-password');

    res.json(pendingFarmers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching pending farmers' });
  }
};

// Get all farms for admin management
export const getAllFarmsAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const farms = await Farm.find()
      .populate('owner', 'name email phone isVerified')
      .sort({ createdAt: -1 });

    res.json(farms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching farms' });
  }
};

// Get all users for admin management
export const getAllUsersAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching users' });
  }
};

export const approveFarmer = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const farmerId = req.params.id;
    const farmer = await User.findOne({
      _id: farmerId,
      role: 'farmer',
      isVerified: false
    });

    if (!farmer) {
      return res.status(404).json({ msg: 'Farmer not found or already verified' });
    }

    farmer.isVerified = true;
    farmer.kisanId.verified = true;
    await farmer.save();

    res.json({ msg: 'Farmer verified successfully', farmer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error approving farmer' });
  }
};

export const rejectFarmer = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const farmerId = req.params.id;
    const { reason } = req.body;

    const farmer = await User.findOne({
      _id: farmerId,
      role: 'farmer',
      isVerified: false
    });

    if (!farmer) {
      return res.status(404).json({ msg: 'Farmer not found or already verified' });
    }

    // Instead of deleting, deactivate the account
    farmer.isActive = false;
    farmer.rejectionReason = reason;
    await farmer.save();

    res.json({ msg: 'Farmer rejected successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error rejecting farmer' });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      msg: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error toggling user status' });
  }
};
