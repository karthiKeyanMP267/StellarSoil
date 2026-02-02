// ML Price Prediction Service
// Provides price predictions based on historical data and trends

import mongoose from 'mongoose';
import governmentPriceService from './governmentPriceService.js';

// Historical price tracking
const priceHistorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  commodity: String,
  price: Number,
  quantity: Number,
  region: String,
  recordedAt: { type: Date, default: Date.now }
});

priceHistorySchema.index({ commodity: 1, recordedAt: -1 });
priceHistorySchema.index({ productId: 1 });

const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);

class MLPriceService {
  constructor() {
    this.PREDICTION_WINDOW = 30; // days
  }

  // Simple moving average prediction
  async predictPrice(commodity, region = '') {
    try {
      // Get historical data for past 90 days
      const historicalData = await PriceHistory.find({
        commodity: commodity.toLowerCase(),
        recordedAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
      }).sort({ recordedAt: -1 });

      if (historicalData.length < 5) {
        // Not enough data, use government price as baseline
        const govPrice = await governmentPriceService.getPrice(commodity);
        return govPrice ? govPrice.modalPrice : null;
      }

      // Calculate weighted moving average (recent prices weighted more)
      let totalWeight = 0;
      let weightedSum = 0;

      historicalData.forEach((record, index) => {
        const weight = 1 / (index + 1); // More recent = higher weight
        weightedSum += record.price * weight;
        totalWeight += weight;
      });

      const predictedPrice = weightedSum / totalWeight;

      // Apply seasonal adjustment (simple multiplier based on month)
      const currentMonth = new Date().getMonth();
      const seasonalMultiplier = this.getSeasonalMultiplier(commodity, currentMonth);

      return Math.round(predictedPrice * seasonalMultiplier);
    } catch (error) {
      console.error('Error predicting price:', error.message);
      return null;
    }
  }

  // Seasonal adjustment factors
  getSeasonalMultiplier(commodity, month) {
    // Simplified seasonal factors
    // In production, this would be based on actual data analysis
    const seasonalFactors = {
      'tomato': [1.2, 1.15, 1.0, 0.9, 0.85, 0.95, 1.1, 1.15, 1.1, 1.0, 0.95, 1.1],
      'carrot': [0.9, 0.95, 1.0, 1.05, 1.1, 1.05, 1.0, 0.95, 0.9, 0.9, 0.95, 0.9],
      'potato': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      'onion': [1.1, 1.15, 1.2, 1.1, 1.0, 0.95, 0.9, 0.9, 0.95, 1.0, 1.05, 1.1],
      'default': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
    };

    const factors = seasonalFactors[commodity.toLowerCase()] || seasonalFactors['default'];
    return factors[month];
  }

  // Record price for future predictions
  async recordPrice(productId, commodity, price, quantity, region = '') {
    try {
      await PriceHistory.create({
        productId,
        commodity: commodity.toLowerCase(),
        price,
        quantity,
        region,
        recordedAt: new Date()
      });
    } catch (error) {
      console.error('Error recording price:', error.message);
    }
  }

  // Batch predict prices for multiple products
  async batchPredict(products) {
    const predictions = [];

    for (const product of products) {
      try {
        const predictedPrice = await this.predictPrice(product.name, product.region);
        predictions.push({
          productId: product._id,
          commodity: product.name,
          currentPrice: product.price,
          predictedPrice,
          confidence: this.calculateConfidence(product.name)
        });
      } catch (error) {
        console.error(`Error predicting price for ${product.name}:`, error.message);
      }
    }

    return predictions;
  }

  // Calculate prediction confidence based on data availability
  calculateConfidence(commodity) {
    // Simplified confidence calculation
    // In production, this would consider:
    // - Amount of historical data
    // - Price volatility
    // - Seasonal consistency
    // - Market conditions
    return 0.75; // 75% confidence placeholder
  }

  // Get price trend (increasing/decreasing/stable)
  async getPriceTrend(commodity, days = 30) {
    try {
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const data = await PriceHistory.find({
        commodity: commodity.toLowerCase(),
        recordedAt: { $gte: cutoffDate }
      }).sort({ recordedAt: 1 });

      if (data.length < 2) {
        return { trend: 'unknown', change: 0 };
      }

      const firstPrice = data[0].price;
      const lastPrice = data[data.length - 1].price;
      const change = ((lastPrice - firstPrice) / firstPrice) * 100;

      let trend = 'stable';
      if (change > 5) trend = 'increasing';
      else if (change < -5) trend = 'decreasing';

      return { trend, change: change.toFixed(2) };
    } catch (error) {
      console.error('Error getting price trend:', error.message);
      return { trend: 'unknown', change: 0 };
    }
  }

  // Get price recommendations for farmers
  async getSellingRecommendation(commodity, currentPrice) {
    try {
      const predictedPrice = await this.predictPrice(commodity);
      const govPrice = await governmentPriceService.getPrice(commodity);
      const trend = await this.getPriceTrend(commodity);

      let recommendation = '';
      let suggestedPrice = currentPrice;

      if (predictedPrice && govPrice) {
        const avgMarketPrice = (predictedPrice + govPrice.modalPrice) / 2;

        if (currentPrice < avgMarketPrice * 0.8) {
          recommendation = 'Your price is below market average. Consider increasing.';
          suggestedPrice = Math.round(avgMarketPrice * 0.9);
        } else if (currentPrice > avgMarketPrice * 1.2) {
          recommendation = 'Your price is above market average. Consider competitive pricing.';
          suggestedPrice = Math.round(avgMarketPrice * 1.1);
        } else {
          recommendation = 'Your price is competitive.';
        }

        if (trend.trend === 'increasing') {
          recommendation += ' Market prices are rising.';
        } else if (trend.trend === 'decreasing') {
          recommendation += ' Market prices are falling.';
        }
      }

      return {
        recommendation,
        suggestedPrice,
        currentPrice,
        predictedPrice,
        govPrice: govPrice?.modalPrice,
        trend: trend.trend,
        trendChange: trend.change
      };
    } catch (error) {
      console.error('Error getting selling recommendation:', error.message);
      return null;
    }
  }
}

export default new MLPriceService();
