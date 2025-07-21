const { SensorData, PestAlert, CropHealth, Recommendation } = require('../models/FarmManagement');
const User = require('../models/User');
const Order = require('../models/Order');

// AI-based recommendation engine
const generateRecommendations = async (userId, location) => {
  try {
    const user = await User.findById(userId);
    const [lat, lng] = location.coordinates;

    // Find nearby farms
    const nearbyFarms = await User.find({
      role: 'farmer',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: 50000 // 50km radius
        }
      }
    });

    // Get user's order history
    const orderHistory = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    // Get trending products
    const trendingProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 10 }
    ]);

    // Generate personalized recommendations
    const recommendations = {
      nearby: nearbyFarms.map(farm => ({
        farmId: farm._id,
        score: 1,
        reason: 'Located near you'
      })),
      personal: orderHistory.map(order => ({
        itemId: order.items[0].productId,
        score: 0.8,
        reason: 'Based on your previous orders'
      })),
      trending: trendingProducts.map(product => ({
        itemId: product._id,
        score: 0.6,
        reason: 'Popular in your area'
      }))
    };

    // Save recommendations
    await Recommendation.create({
      userId,
      location,
      items: [
        ...recommendations.nearby,
        ...recommendations.personal,
        ...recommendations.trending
      ]
    });

    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
};

// Farm management controllers
exports.getSensorData = async (req, res) => {
  try {
    const { farmId } = req.params;
    const data = await SensorData.find({ farmId })
      .sort({ timestamp: -1 })
      .limit(24); // Last 24 readings

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addSensorData = async (req, res) => {
  try {
    const data = new SensorData(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.reportPestAlert = async (req, res) => {
  try {
    const alert = new PestAlert({
      ...req.body,
      farmId: req.user._id
    });
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPestAlerts = async (req, res) => {
  try {
    const alerts = await PestAlert.find({ farmId: req.user._id })
      .sort({ detectedAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCropHealth = async (req, res) => {
  try {
    const { cropId } = req.params;
    const update = await CropHealth.findByIdAndUpdate(
      cropId,
      { $set: req.body },
      { new: true }
    );
    res.json(update);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.analyzeCropImage = async (req, res) => {
  try {
    // Implement AI image analysis
    // This would connect to a machine learning service
    const mockAnalysis = {
      health: 'good',
      diseases: [],
      confidence: 0.95,
      recommendations: ['Optimal growth detected', 'Continue current care routine']
    };
    res.json(mockAnalysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Recommendation controllers
exports.getRecommendations = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const recommendations = await generateRecommendations(
      req.user._id,
      {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    );
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSeasonalGuide = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    // Implement seasonal recommendations based on location and time
    // This would connect to agricultural data services
    const mockGuide = {
      season: 'monsoon',
      recommendedCrops: [
        { name: 'Rice', confidence: 0.95 },
        { name: 'Pulses', confidence: 0.88 }
      ],
      tips: [
        'Ensure proper drainage',
        'Monitor humidity levels',
        'Use disease-resistant varieties'
      ]
    };
    res.json(mockGuide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
