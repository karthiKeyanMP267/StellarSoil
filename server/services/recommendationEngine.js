import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Farm from '../models/Farm.js';
import marketPriceService from '../services/marketPriceService.js';

class RecommendationEngine {
  constructor() {
    this.weights = {
      frequency: 0.4,      // How often user buys this item
      recency: 0.3,        // How recently user bought this item
      popularity: 0.2,     // How popular the item is overall
      location: 0.1        // Distance to farm
    };
  }

  // Get personalized recommendations for a user
  async getPersonalizedRecommendations(userId, location = null, limit = 20) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get user's order history
      const userOrders = await Order.find({ userId })
        .populate('items.productId')
        .sort({ createdAt: -1 })
        .limit(50); // Last 50 orders

      // Get commonly bought items from market data
      const commonlyBought = marketPriceService.getCommonlyBought();

      // Generate recommendations based on different strategies
      const recommendations = await Promise.all([
        this.getFrequencyBasedRecommendations(userOrders, limit / 4),
        this.getCollaborativeRecommendations(userId, limit / 4),
        this.getLocationBasedRecommendations(location, limit / 4),
        this.getPopularItemsRecommendations(limit / 4)
      ]);

      // Flatten and merge recommendations
      const merged = this.mergeRecommendations(recommendations.flat(), commonlyBought);

      // If user is new (no orders), prioritize commonly bought items
      if (userOrders.length === 0) {
        return this.getNewUserRecommendations(location, limit);
      }

      return merged.slice(0, limit);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(limit);
    }
  }

  // Recommendations based on user's purchase frequency
  async getFrequencyBasedRecommendations(userOrders, limit) {
    const itemFrequency = new Map();
    const itemRecency = new Map();
    const now = Date.now();

    // Analyze user's order history
    userOrders.forEach((order, orderIndex) => {
      const recencyScore = 1 - (orderIndex / userOrders.length); // More recent orders get higher score
      
      order.items.forEach(item => {
        if (item.productId && item.productId.name) {
          const productName = item.productId.name.toLowerCase();
          
          // Update frequency
          itemFrequency.set(productName, (itemFrequency.get(productName) || 0) + 1);
          
          // Update recency (keep the most recent score)
          const currentRecency = itemRecency.get(productName) || 0;
          if (recencyScore > currentRecency) {
            itemRecency.set(productName, recencyScore);
          }
        }
      });
    });

    // Convert to recommendations with scores
    const recommendations = [];
    for (const [productName, frequency] of itemFrequency.entries()) {
      const recency = itemRecency.get(productName) || 0;
      const score = (frequency * this.weights.frequency) + (recency * this.weights.recency);
      
      recommendations.push({
        type: 'frequent',
        item: productName,
        score,
        reason: `You buy this ${frequency} times`,
        metadata: { frequency, recency }
      });
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Collaborative filtering recommendations
  async getCollaborativeRecommendations(userId, limit) {
    try {
      // Find users with similar purchase patterns
      const userOrders = await Order.find({ userId })
        .populate('items.productId')
        .limit(20);

      const userItems = new Set();
      userOrders.forEach(order => {
        order.items.forEach(item => {
          if (item.productId) {
            userItems.add(item.productId.name.toLowerCase());
          }
        });
      });

      if (userItems.size === 0) return [];

      // Find similar users
      const allUsers = await Order.aggregate([
        { $unwind: '$items' },
        { $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'productInfo'
        }},
        { $unwind: '$productInfo' },
        { $group: {
          _id: '$userId',
          items: { $addToSet: '$productInfo.name' }
        }}
      ]);

      const similarUsers = allUsers
        .map(user => ({
          userId: user._id,
          similarity: this.calculateJaccardSimilarity(
            Array.from(userItems),
            user.items.map(name => name.toLowerCase())
          )
        }))
        .filter(user => user.similarity > 0.1 && user.userId.toString() !== userId)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10);

      // Get recommendations from similar users
      const recommendations = new Map();
      
      for (const similarUser of similarUsers) {
        const similarUserOrders = await Order.find({ userId: similarUser.userId })
          .populate('items.productId')
          .limit(10);

        similarUserOrders.forEach(order => {
          order.items.forEach(item => {
            if (item.productId && !userItems.has(item.productId.name.toLowerCase())) {
              const productName = item.productId.name.toLowerCase();
              const currentScore = recommendations.get(productName) || 0;
              recommendations.set(productName, currentScore + similarUser.similarity);
            }
          });
        });
      }

      return Array.from(recommendations.entries())
        .map(([item, score]) => ({
          type: 'collaborative',
          item,
          score: score * this.weights.popularity,
          reason: 'Users like you also bought this',
          metadata: { collaborativeScore: score }
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    } catch (error) {
      console.error('Error in collaborative recommendations:', error);
      return [];
    }
  }

  // Location-based recommendations
  async getLocationBasedRecommendations(location, limit) {
    if (!location || !location.lat || !location.lng) {
      return [];
    }

    try {
      const nearbyFarms = await Farm.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(location.lng), parseFloat(location.lat)]
            },
            $maxDistance: 50000 // 50km radius
          }
        }
      }).limit(20);

      const recommendations = nearbyFarms.map(farm => ({
        type: 'nearby',
        item: farm.name,
        score: this.weights.location,
        reason: `${this.calculateDistance(location, farm.location.coordinates)} km away`,
        metadata: {
          farmId: farm._id,
          distance: this.calculateDistance(location, farm.location.coordinates)
        }
      }));

      return recommendations.slice(0, limit);
    } catch (error) {
      console.error('Error in location-based recommendations:', error);
      return [];
    }
  }

  // Popular items recommendations
  async getPopularItemsRecommendations(limit) {
    try {
      const popularItems = await Order.aggregate([
        { $unwind: '$items' },
        { $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'productInfo'
        }},
        { $unwind: '$productInfo' },
        { $group: {
          _id: '$productInfo.name',
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: '$items.quantity' }
        }},
        { $sort: { totalOrders: -1 } },
        { $limit: limit }
      ]);

      return popularItems.map(item => ({
        type: 'popular',
        item: item._id.toLowerCase(),
        score: item.totalOrders * this.weights.popularity,
        reason: `Ordered ${item.totalOrders} times by others`,
        metadata: {
          orderCount: item.totalOrders,
          totalQuantity: item.totalQuantity
        }
      }));
    } catch (error) {
      console.error('Error in popular items recommendations:', error);
      return [];
    }
  }

  // New user recommendations (commonly bought items)
  async getNewUserRecommendations(location, limit) {
    const commonlyBought = marketPriceService.getCommonlyBought();
    const locationRecs = location ? await this.getLocationBasedRecommendations(location, limit / 2) : [];
    
    const recommendations = [
      ...locationRecs,
      ...commonlyBought.slice(0, limit - locationRecs.length).map(item => ({
        type: 'commonly_bought',
        item: item.name,
        score: 0.8,
        reason: 'Popular choice for new users',
        metadata: {
          displayName: item.displayName,
          priceRange: `₹${item.min}-₹${item.max}/kg`
        }
      }))
    ];

    return recommendations.slice(0, limit);
  }

  // Merge recommendations from different sources
  mergeRecommendations(recommendations, commonlyBought) {
    const merged = new Map();
    
    // Add all recommendations to map, summing scores for duplicates
    recommendations.forEach(rec => {
      const key = rec.item.toLowerCase();
      if (merged.has(key)) {
        const existing = merged.get(key);
        existing.score += rec.score;
        existing.reasons = [...(existing.reasons || [existing.reason]), rec.reason];
        existing.types = [...(existing.types || [existing.type]), rec.type];
      } else {
        merged.set(key, {
          ...rec,
          reasons: [rec.reason],
          types: [rec.type]
        });
      }
    });

    // Add commonly bought items if not present
    commonlyBought.forEach(item => {
      const key = item.name.toLowerCase();
      if (!merged.has(key)) {
        merged.set(key, {
          type: 'market_popular',
          item: key,
          score: 0.3,
          reason: 'Popular in markets',
          metadata: {
            displayName: item.displayName,
            priceRange: `₹${item.min}-₹${item.max}/kg`
          }
        });
      }
    });

    return Array.from(merged.values()).sort((a, b) => b.score - a.score);
  }

  // Fallback recommendations
  getFallbackRecommendations(limit) {
    const commonlyBought = marketPriceService.getCommonlyBought();
    return commonlyBought.slice(0, limit).map(item => ({
      type: 'fallback',
      item: item.name,
      score: 0.5,
      reason: 'Popular choice',
      metadata: {
        displayName: item.displayName,
        priceRange: `₹${item.min}-₹${item.max}/kg`
      }
    }));
  }

  // Utility functions
  calculateJaccardSimilarity(set1, set2) {
    const s1 = new Set(set1);
    const s2 = new Set(set2);
    const intersection = new Set([...s1].filter(x => s2.has(x)));
    const union = new Set([...s1, ...s2]);
    return intersection.size / union.size;
  }

  calculateDistance(point1, point2) {
    if (!point1 || !point2) return 0;
    
    const lat1 = point1.lat;
    const lon1 = point1.lng;
    const lat2 = point2[1]; // GeoJSON format [lng, lat]
    const lon2 = point2[0];

    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }
}

export default new RecommendationEngine();
