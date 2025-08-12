import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Farm from '../models/Farm.js';
import { SensorData } from '../models/FarmManagement.js';

// Dashboard overview statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get date ranges
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User statistics
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonth }
    });
    const newUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: lastMonth, $lt: thisMonth }
    });

    // Order statistics
    const totalOrders = await Order.countDocuments();
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: thisMonth }
    });
    const ordersLastMonth = await Order.countDocuments({
      createdAt: { $gte: lastMonth, $lt: thisMonth }
    });

    // Revenue statistics
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const revenueThisMonth = await Order.aggregate([
      { 
        $match: { 
          status: 'delivered',
          createdAt: { $gte: thisMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const revenueLastMonth = await Order.aggregate([
      { 
        $match: { 
          status: 'delivered',
          createdAt: { $gte: lastMonth, $lt: thisMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Product statistics
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({
      stock: { $lt: 10 }
    });

    // Farm statistics
    const totalFarms = await Farm.countDocuments();
    const activeFarms = await Farm.countDocuments({
      'owner': { $exists: true }
    });

    // Calculate growth percentages
    const userGrowth = newUsersLastMonth > 0 
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100).toFixed(1)
      : 0;

    const orderGrowth = ordersLastMonth > 0
      ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth * 100).toFixed(1)
      : 0;

    const revenueGrowth = revenueLastMonth[0]?.total > 0
      ? ((revenueThisMonth[0]?.total || 0 - revenueLastMonth[0]?.total) / revenueLastMonth[0]?.total * 100).toFixed(1)
      : 0;

    res.json({
      users: {
        total: totalUsers,
        thisMonth: newUsersThisMonth,
        growth: parseFloat(userGrowth)
      },
      orders: {
        total: totalOrders,
        thisMonth: ordersThisMonth,
        growth: parseFloat(orderGrowth)
      },
      revenue: {
        total: totalRevenue,
        thisMonth: revenueThisMonth[0]?.total || 0,
        growth: parseFloat(revenueGrowth)
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts
      },
      farms: {
        total: totalFarms,
        active: activeFarms
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sales analytics
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    let dateFilter;
    
    switch (period) {
      case '7d':
        dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFilter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        dateFilter = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Daily sales
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateFilter },
          status: { $in: ['confirmed', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: dateFilter } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          quantity: 1,
          revenue: 1
        }
      }
    ]);

    // Category sales
    const categorySales = await Order.aggregate([
      { $match: { createdAt: { $gte: dateFilter } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          sales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { sales: -1 } }
    ]);

    res.json({
      dailySales,
      topProducts,
      categorySales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User analytics
export const getUserAnalytics = async (req, res) => {
  try {
    // User registration trends
    const userTrends = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // User by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Active users (users with orders in last 30 days)
    const activeUsers = await Order.distinct('userId', {
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Top customers
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          totalSpent: 1,
          orderCount: 1
        }
      }
    ]);

    res.json({
      userTrends,
      usersByRole,
      activeUsersCount: activeUsers.length,
      topCustomers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Farm analytics
export const getFarmAnalytics = async (req, res) => {
  try {
    // Farm distribution by location
    const farmsByLocation = await Farm.aggregate([
      {
        $group: {
          _id: '$address.state',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Farm productivity (based on sensor data)
    const farmProductivity = await SensorData.aggregate([
      {
        $group: {
          _id: '$farmId',
          avgTemperature: { $avg: '$temperature' },
          avgHumidity: { $avg: '$humidity' },
          avgSoilMoisture: { $avg: '$soilMoisture' },
          dataPoints: { $sum: 1 }
        }
      },
      { $sort: { dataPoints: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'farm'
        }
      },
      { $unwind: '$farm' },
      {
        $project: {
          farmName: '$farm.name',
          avgTemperature: { $round: ['$avgTemperature', 1] },
          avgHumidity: { $round: ['$avgHumidity', 1] },
          avgSoilMoisture: { $round: ['$avgSoilMoisture', 1] },
          dataPoints: 1
        }
      }
    ]);

    // Sensor data trends
    const sensorTrends = await SensorData.aggregate([
      {
        $match: {
          timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp'
            }
          },
          avgTemperature: { $avg: '$temperature' },
          avgHumidity: { $avg: '$humidity' },
          avgSoilMoisture: { $avg: '$soilMoisture' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      farmsByLocation,
      farmProductivity,
      sensorTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Product analytics
export const getProductAnalytics = async (req, res) => {
  try {
    // Product performance
    const productPerformance = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalQuantitySold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          category: '$product.category',
          currentStock: '$product.stock',
          totalQuantitySold: 1,
          totalRevenue: 1,
          orderCount: 1,
          avgOrderValue: {
            $divide: ['$totalRevenue', '$orderCount']
          }
        }
      }
    ]);

    // Inventory alerts
    const inventoryAlerts = await Product.find({
      $or: [
        { stock: { $lt: 10 } },
        { stock: 0 }
      ]
    }).select('name category stock').sort({ stock: 1 });

    // Price trends (mock data - would need historical price tracking)
    const priceTrends = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          productCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      productPerformance,
      inventoryAlerts,
      priceTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
