// Get farm stats
// ...existing code...
export const getFarmStats = async (req, res) => {
  try {
    const totalFarms = await Farm.countDocuments();
    const farms = await Farm.find({}, 'rating');
    const avgRating = farms.length > 0 ? (farms.reduce((sum, f) => sum + (f.rating || 0), 0) / farms.length) : 0;
    res.json({ totalFarms, avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching farm stats' });
  }
};
import Farm from '../models/Farm.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Get farm profile
export const getFarmProfile = async (req, res) => {
  try {
    const farm = await Farm.findOne({ ownerId: req.user._id })
      .populate('ownerId', 'name email phone');
    
    if (!farm) {
      return res.status(404).json({ msg: 'Farm profile not found' });
    }

    res.json(farm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching farm profile' });
  }
};

// Update farm profile
export const updateFarmProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    const {
      farmName,
      farmType,
      description,
      location, // might be address string from client
      address,
      contactPhone,
      specialties,
      certifications,
      images,
      latitude,
      longitude,
      phone,
      email,
      website
    } = req.body;

  const ownerId = req.user._id;
  let farm = await Farm.findOne({ ownerId });
    
    // Build GeoJSON location if coordinates provided, else keep existing later
    let geoLocation;
    if (latitude && longitude) {
      geoLocation = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    const resolvedAddress = address || location; // client may send 'location' as address string
    const resolvedPhone = contactPhone || phone;

    // Basic validation for required fields on create
    if (!farm && (!farmName || !resolvedAddress || !resolvedPhone)) {
      return res.status(400).json({ msg: 'farmName, address and contactPhone are required' });
    }

    const allowedTypes = ['organic','conventional','hydroponic','mixed'];
    const normalizedType = farmType && typeof farmType === 'string'
      ? (allowedTypes.includes(farmType) ? farmType : 'mixed')
      : undefined;

    // Map farm size to schema shape { value, unit } with allowed units only
    let farmSizeObj;
    if (req.body.farmSize) {
      const rawUnit = (req.body.unit || req.body.farmSizeUnit || '').toLowerCase();
      let unit;
      if (rawUnit.includes('acre')) unit = 'acre';
      else if (rawUnit.includes('hect')) unit = 'hectare';
      else if (rawUnit.includes('bigha')) unit = 'bigha';
      else if (rawUnit.includes('katha')) unit = 'katha';
      // Only set if unit is one of the allowed
      if (unit) {
        const value = parseFloat(req.body.farmSize);
        if (!Number.isNaN(value)) {
          farmSizeObj = { value, unit };
        }
      }
    }

    const farmData = {
      ownerId, // Explicitly set the owner
      name: farmName,
      farmType: normalizedType,
      description,
      location: geoLocation, // may be undefined; handle on update
      address: resolvedAddress,
      contactPhone: resolvedPhone,
      email,
      website,
      ...(farmSizeObj ? { farmSize: farmSizeObj } : {}),
      specialties,
      certifications,
      images: images || []
    };

    // Debug log to verify ownerId presence
    try {
      console.log('updateFarmProfile: user._id =', req.user?._id, 'farmData.ownerId =', farmData.ownerId);
    } catch {}

    // Upsert farm atomically
    const update = {
      $set: {
        ...(farmName !== undefined ? { name: farmName } : {}),
        ...(normalizedType !== undefined ? { farmType: normalizedType } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(geoLocation ? { location: geoLocation } : {}),
        ...(resolvedAddress !== undefined ? { address: resolvedAddress } : {}),
        ...(resolvedPhone !== undefined ? { contactPhone: resolvedPhone } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(website !== undefined ? { website } : {}),
        ...(farmSizeObj ? { farmSize: farmSizeObj } : {}),
        ...(specialties !== undefined ? { specialties } : {}),
        ...(certifications !== undefined ? { certifications } : {}),
        ...(images ? { images } : {})
      },
      $setOnInsert: { ownerId }
    };
    const updatedFarm = await Farm.findOneAndUpdate(
      { ownerId },
      update,
      { new: true, upsert: true, runValidators: true }
    );
    
    // Update user's farm info
    const updates = { farmName, farmId: updatedFarm._id };
    await User.findByIdAndUpdate(req.user._id, updates);

    res.json({
      msg: 'Farm profile updated successfully',
      farm: updatedFarm
    });
  } catch (err) {
    console.error('Farm profile update error:', err);
    res.status(500).json({ msg: 'Error updating farm profile: ' + err.message });
  }
};

// Farm image upload handler
export const uploadFarmImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'No files uploaded' });
    }

  const farm = await Farm.findOne({ ownerId: req.user._id });
    if (!farm) {
      return res.status(404).json({ msg: 'Farm profile not found' });
    }

    // Get file paths
    const imagePaths = req.files.map(file => file.path.replace(/\\/g, '/'));

    // Add new images to farm's images array
    farm.images = [...farm.images, ...imagePaths];
    await farm.save();

    res.json({ 
      msg: 'Images uploaded successfully',
      images: imagePaths
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error uploading farm images' });
  }
};

// Farm image delete handler
export const deleteFarmImage = async (req, res) => {
  try {
    const { imagePath } = req.body;
    if (!imagePath) {
      return res.status(400).json({ msg: 'Image path is required' });
    }

  const farm = await Farm.findOne({ ownerId: req.user._id });
    if (!farm) {
      return res.status(404).json({ msg: 'Farm profile not found' });
    }

    // Remove image from farm's images array
    farm.images = farm.images.filter(img => img !== imagePath);
    await farm.save();

    // You might want to also delete the file from the filesystem
    // This requires the fs module and proper error handling
    // fs.unlink(imagePath, (err) => {
    //   if (err) console.error('Error deleting file:', err);
    // });

    res.json({ msg: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error deleting farm image' });
  }
};
// Get nearby farms
export const getNearbyFarms = async (req, res) => {
  try {
    const { longitude, latitude, radius = 10000 } = req.query; // radius in meters

    const farms = await Farm.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      }
  }).populate('ownerId', 'name');

    res.json(farms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching nearby farms' });
  }
};

// Get farm by ID (public route)
export const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id)
      .populate('ownerId', 'name')
      .select('-businessHours.monday -businessHours.tuesday -businessHours.wednesday -businessHours.thursday -businessHours.friday -businessHours.saturday -businessHours.sunday');

    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    res.json(farm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching farm' });
  }
};

// Add/update farm review
export const addFarmReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    // Check if user has already reviewed
    const reviewIndex = farm.reviews.findIndex(
      review => review.user.toString() === req.user._id.toString()
    );

    if (reviewIndex > -1) {
      // Update existing review
      farm.reviews[reviewIndex].rating = rating;
      farm.reviews[reviewIndex].comment = comment;
    } else {
      // Add new review
      farm.reviews.push({
        user: req.user._id,
        rating,
        comment
      });
    }

    // Update average rating
    const totalRating = farm.reviews.reduce((sum, review) => sum + review.rating, 0);
    farm.rating = totalRating / farm.reviews.length;

    await farm.save();
    res.json(farm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error adding review' });
  }
};

export const getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.find();
    res.json(farms);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load farms' });
  }
};

// End of file
// Per-farmer detailed stats for dashboard
export const getMyFarmStats = async (req, res) => {
  try {
    // Ensure farmer user
    if (!req.user || req.user.role !== 'farmer') {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    // Resolve farmId for this farmer
  const farm = await Farm.findOne({ ownerId: req.user._id }).select('_id');
    if (!farm) {
      return res.json({
        totalProducts: 0,
        activeListings: 0,
        completedOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        monthlyEarnings: 0
      });
    }

    const farmId = farm._id;
    const userId = req.user._id;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Products
    const [totalProducts, activeListings] = await Promise.all([
      Product.countDocuments({ farm: farmId }),
      Product.countDocuments({ farm: farmId, isActive: true })
    ]);

    // Orders filters: prefer denormalized farmer, but also fall back to farm id for legacy
    const farmerOrFarmMatch = { $or: [ { farmer: userId }, { farm: farmId } ] };

    const completedOrders = await Order.countDocuments({
      ...farmerOrFarmMatch,
      orderStatus: 'delivered'
    });

    // Total revenue (net: totalAmount - discount) for delivered orders
    const revenueAgg = await Order.aggregate([
      { $match: { ...farmerOrFarmMatch, orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: { $subtract: [ '$totalAmount', { $ifNull: [ '$discount', 0 ] } ] } } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Pending orders (not delivered/cancelled)
    const pendingStatuses = ['placed','confirmed','processing','ready','out_for_delivery'];
    const pendingOrders = await Order.countDocuments({
      ...farmerOrFarmMatch,
      orderStatus: { $in: pendingStatuses }
    });

    // Monthly earnings for delivered orders since month start
    const monthlyAgg = await Order.aggregate([
      { $match: { ...farmerOrFarmMatch, orderStatus: 'delivered', createdAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: { $subtract: [ '$totalAmount', { $ifNull: [ '$discount', 0 ] } ] } } } }
    ]);
    const monthlyEarnings = monthlyAgg[0]?.total || 0;

    res.json({
      totalProducts,
      activeListings,
      completedOrders,
      totalRevenue,
      pendingOrders,
      monthlyEarnings
    });
  } catch (err) {
    console.error('Error fetching my farm stats:', err);
    res.status(500).json({ msg: 'Error fetching farm stats' });
  }
};

// Per-farmer Today summary KPIs
export const getMyTodaySummary = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'farmer') {
      return res.status(403).json({ msg: 'Forbidden' });
    }

  const farm = await Farm.findOne({ ownerId: req.user._id }).select('_id');
    if (!farm) {
      return res.json({ newOrdersToday: 0, revenueToday: 0, pendingDeliveries: 0, customerInquiries: 0 });
    }

    const farmId = farm._id;
    const userId = req.user._id;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const farmerOrFarmMatch = { $or: [ { farmer: userId }, { farm: farmId } ] };

    // New orders created today
    const newOrdersToday = await Order.countDocuments({
      ...farmerOrFarmMatch,
      createdAt: { $gte: startOfDay }
    });

    // Revenue today:
    // - Prepaid orders paid today (approx by createdAt today when paymentStatus is paid)
    // - COD orders delivered today (deliveryVerification.verifiedAt today)
    const prepaidAgg = await Order.aggregate([
      { $match: { ...farmerOrFarmMatch, paymentStatus: 'paid', createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: { $subtract: [ '$totalAmount', { $ifNull: [ '$discount', 0 ] } ] } } } }
    ]);

    const codAgg = await Order.aggregate([
      { $match: { ...farmerOrFarmMatch, paymentMethod: 'cod', orderStatus: 'delivered', 'deliveryVerification.verifiedAt': { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: { $subtract: [ '$totalAmount', { $ifNull: [ '$discount', 0 ] } ] } } } }
    ]);

    const revenueToday = (prepaidAgg[0]?.total || 0) + (codAgg[0]?.total || 0);

    // Pending deliveries (delivery flow statuses)
    const pendingStatuses = ['confirmed','processing','ready','out_for_delivery'];
    const pendingDeliveries = await Order.countDocuments({
      ...farmerOrFarmMatch,
      orderStatus: { $in: pendingStatuses },
      deliveryType: 'delivery'
    });

    // Customer inquiries: Not currently tracked; return 0 for now
    const customerInquiries = 0;

    res.json({ newOrdersToday, revenueToday, pendingDeliveries, customerInquiries });
  } catch (err) {
    console.error('Error fetching today summary:', err);
    res.status(500).json({ msg: 'Error fetching today summary' });
  }
};
