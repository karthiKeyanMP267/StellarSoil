// Government Price Service
// Fetches and caches government commodity prices

import axios from 'axios';
import mongoose from 'mongoose';

// Simple cache schema for government prices
const govPriceSchema = new mongoose.Schema({
  commodity: { type: String, required: true },
  state: String,
  district: String,
  market: String,
  modalPrice: Number,
  minPrice: Number,
  maxPrice: Number,
  variety: String,
  arrivalDate: Date,
  lastUpdated: { type: Date, default: Date.now }
});

govPriceSchema.index({ commodity: 1, state: 1, district: 1 });
govPriceSchema.index({ lastUpdated: 1 });

const GovPrice = mongoose.model('GovPrice', govPriceSchema);

class GovernmentPriceService {
  constructor() {
    this.API_BASE = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
    this.API_KEY = process.env.GOV_DATA_API_KEY || 'YOUR_API_KEY_HERE';
    this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Fetch prices from government API
  async fetchFromAPI(commodity, state = '', district = '') {
    try {
      const params = {
        'api-key': this.API_KEY,
        format: 'json',
        limit: 100,
        filters: {}
      };

      if (commodity) {
        params.filters['commodity'] = commodity;
      }
      if (state) {
        params.filters['state'] = state;
      }
      if (district) {
        params.filters['district'] = district;
      }

      const response = await axios.get(this.API_BASE, { params });
      
      if (response.data && response.data.records) {
        return response.data.records;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching government prices:', error.message);
      return [];
    }
  }

  // Get cached price or fetch new
  async getPrice(commodity, state = '', district = '') {
    try {
      // Check cache first
      const cacheQuery = { commodity: commodity.toLowerCase() };
      if (state) cacheQuery.state = state;
      if (district) cacheQuery.district = district;

      const cached = await GovPrice.findOne(cacheQuery)
        .sort({ lastUpdated: -1 });

      // Return cached if recent
      if (cached && (Date.now() - cached.lastUpdated.getTime() < this.CACHE_DURATION)) {
        return {
          modalPrice: cached.modalPrice,
          minPrice: cached.minPrice,
          maxPrice: cached.maxPrice,
          variety: cached.variety,
          source: 'cache',
          lastUpdated: cached.lastUpdated
        };
      }

      // Fetch from API
      const records = await this.fetchFromAPI(commodity, state, district);
      
      if (records.length > 0) {
        // Calculate average prices
        const modalPrices = records.map(r => parseFloat(r.modal_price || 0)).filter(p => p > 0);
        const minPrices = records.map(r => parseFloat(r.min_price || 0)).filter(p => p > 0);
        const maxPrices = records.map(r => parseFloat(r.max_price || 0)).filter(p => p > 0);

        const avgModalPrice = modalPrices.length > 0 
          ? modalPrices.reduce((a, b) => a + b, 0) / modalPrices.length 
          : 0;
        const avgMinPrice = minPrices.length > 0 
          ? minPrices.reduce((a, b) => a + b, 0) / minPrices.length 
          : 0;
        const avgMaxPrice = maxPrices.length > 0 
          ? maxPrices.reduce((a, b) => a + b, 0) / maxPrices.length 
          : 0;

        // Update cache
        await GovPrice.findOneAndUpdate(
          cacheQuery,
          {
            modalPrice: avgModalPrice,
            minPrice: avgMinPrice,
            maxPrice: avgMaxPrice,
            variety: records[0].variety || '',
            arrivalDate: records[0].arrival_date || new Date(),
            lastUpdated: new Date()
          },
          { upsert: true, new: true }
        );

        return {
          modalPrice: avgModalPrice,
          minPrice: avgMinPrice,
          maxPrice: avgMaxPrice,
          variety: records[0].variety || '',
          source: 'api',
          lastUpdated: new Date()
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting government price:', error.message);
      return null;
    }
  }

  // Batch update prices for common commodities
  async batchUpdatePrices(commodities = []) {
    const results = [];
    
    for (const commodity of commodities) {
      try {
        const price = await this.getPrice(commodity);
        results.push({ commodity, price, success: true });
      } catch (error) {
        results.push({ commodity, error: error.message, success: false });
      }
    }

    return results;
  }

  // Get trending/common commodities
  async getTrendingCommodities() {
    try {
      const recent = await GovPrice.aggregate([
        { $match: { lastUpdated: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        { $group: { 
          _id: '$commodity', 
          avgPrice: { $avg: '$modalPrice' },
          count: { $sum: 1 }
        }},
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]);

      return recent.map(item => ({
        commodity: item._id,
        avgPrice: item.avgPrice,
        dataPoints: item.count
      }));
    } catch (error) {
      console.error('Error getting trending commodities:', error.message);
      return [];
    }
  }
}

export default new GovernmentPriceService();
