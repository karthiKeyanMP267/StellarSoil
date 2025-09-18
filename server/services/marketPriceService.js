import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Set up proper environment loading
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

class MarketPriceService {
  constructor() {
    this.pricesCache = new Map();
    this.cacheExpiry = 60 * 60 * 1000; // 1 hour cache
    this.fallbackPrices = this.loadFallbackPrices();
  }

  loadFallbackPrices() {
    // Fallback prices for common vegetables and fruits (₹/kg)
    return {
      'tomato': { min: 20, max: 80, current: 45 },
      'onion': { min: 15, max: 60, current: 35 },
      'potato': { min: 12, max: 40, current: 25 },
      'carrot': { min: 18, max: 50, current: 30 },
      'cabbage': { min: 8, max: 25, current: 15 },
      'cauliflower': { min: 15, max: 45, current: 25 },
      'brinjal': { min: 20, max: 60, current: 35 },
      'ladyfinger': { min: 25, max: 70, current: 40 },
      'green_chili': { min: 30, max: 120, current: 60 },
      'ginger': { min: 80, max: 200, current: 120 },
      'garlic': { min: 100, max: 300, current: 180 },
      'spinach': { min: 15, max: 40, current: 25 },
      'coriander': { min: 40, max: 150, current: 80 },
      'mint': { min: 50, max: 200, current: 100 },
      'apple': { min: 80, max: 200, current: 120 },
      'banana': { min: 30, max: 80, current: 50 },
      'orange': { min: 40, max: 120, current: 70 },
      'grapes': { min: 60, max: 150, current: 90 },
      'mango': { min: 50, max: 150, current: 80 },
      'papaya': { min: 20, max: 60, current: 35 },
      'watermelon': { min: 8, max: 25, current: 15 },
      'pomegranate': { min: 100, max: 250, current: 150 },
      'lemon': { min: 40, max: 100, current: 60 },
      'guava': { min: 30, max: 80, current: 50 }
    };
  }

  // Get cached prices or fetch new ones
  async getMarketPrices() {
    const cacheKey = 'market_prices';
    const cached = this.pricesCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      // Try to fetch from multiple sources
      let prices = await this.fetchFromMultipleSources();
      
      if (!prices || Object.keys(prices).length === 0) {
        prices = this.generateRandomizedPrices();
      }

      // Cache the results
      this.pricesCache.set(cacheKey, {
        data: prices,
        timestamp: Date.now()
      });

      return prices;
    } catch (error) {
      console.error('Error fetching market prices:', error);
      return this.generateRandomizedPrices();
    }
  }

  // Fetch from multiple API sources
  async fetchFromMultipleSources() {
    const sources = [
      this.fetchFromAgmarknet.bind(this),
      this.fetchFromDataGov.bind(this),
      this.fetchFromAPILayer.bind(this)
    ];

    for (const source of sources) {
      try {
        const prices = await source();
        if (prices && Object.keys(prices).length > 0) {
          return prices;
        }
      } catch (error) {
        console.log(`Source failed, trying next: ${error.message}`);
        continue;
      }
    }

    return null;
  }

  // Try fetching from Agmarknet API (Government of India)
  async fetchFromAgmarknet() {
    try {
      // This is a placeholder for actual API integration
      // You would need to register and get API keys
      const response = await axios.get('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070', {
        params: {
          'api-key': process.env.DATA_GOV_API_KEY || 'demo-key',
          format: 'json',
          limit: 100
        },
        timeout: 5000
      });

      if (response.data && response.data.records) {
        return this.parseAgmarknetData(response.data.records);
      }
    } catch (error) {
      throw new Error(`Agmarknet API failed: ${error.message}`);
    }
    return null;
  }

  // Try fetching from Data.gov.in
  async fetchFromDataGov() {
    try {
      // Placeholder for data.gov.in API
      const response = await axios.get('https://api.data.gov.in/resource/agricultural-marketing', {
        params: {
          'api-key': process.env.DATA_GOV_API_KEY,
          format: 'json'
        },
        timeout: 5000
      });

      if (response.data) {
        return this.parseDataGovData(response.data);
      }
    } catch (error) {
      throw new Error(`Data.gov API failed: ${error.message}`);
    }
    return null;
  }

  // Try fetching from third-party API
  async fetchFromAPILayer() {
    try {
      // Placeholder for third-party API
      const response = await axios.get('https://api.apilayer.com/agriculture/prices', {
        headers: {
          'apikey': process.env.APILAYER_API_KEY
        },
        timeout: 5000
      });

      if (response.data) {
        return this.parseAPILayerData(response.data);
      }
    } catch (error) {
      throw new Error(`APILayer failed: ${error.message}`);
    }
    return null;
  }

  // Parse different API response formats
  parseAgmarknetData(records) {
    const prices = {};
    records.forEach(record => {
      const commodity = record.commodity?.toLowerCase().replace(/\s+/g, '_');
      if (commodity && record.modal_price) {
        prices[commodity] = {
          min: parseFloat(record.min_price) || 0,
          max: parseFloat(record.max_price) || 0,
          current: parseFloat(record.modal_price) || 0,
          market: record.market,
          date: record.arrival_date
        };
      }
    });
    return prices;
  }

  parseDataGovData(data) {
    // Parse data.gov.in format
    const prices = {};
    // Implementation depends on actual API response format
    return prices;
  }

  parseAPILayerData(data) {
    // Parse third-party API format
    const prices = {};
    // Implementation depends on actual API response format
    return prices;
  }

  // Generate realistic randomized prices based on fallback data
  generateRandomizedPrices() {
    const prices = {};
    const currentDate = new Date().toISOString().split('T')[0];

    Object.entries(this.fallbackPrices).forEach(([commodity, basePrice]) => {
      // Add some random variation (±20%)
      const variation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const current = Math.round(basePrice.current * variation);
      const min = Math.round(basePrice.min * variation);
      const max = Math.round(basePrice.max * variation);

      prices[commodity] = {
        min: Math.min(min, current),
        max: Math.max(max, current),
        current: current,
        market: 'Mixed Markets',
        date: currentDate,
        source: 'Estimated'
      };
    });

    return prices;
  }

  // Get price range for specific commodity
  getPriceRange(commodity) {
    const prices = this.fallbackPrices[commodity.toLowerCase()];
    if (!prices) {
      return { min: 10, max: 100, current: 50 };
    }
    return prices;
  }

  // Validate if farmer's price is within acceptable range
  validateFarmerPrice(commodity, farmerPrice, tolerance = 0.3) {
    const range = this.getPriceRange(commodity);
    const minAllowed = range.min * (1 - tolerance);
    const maxAllowed = range.max * (1 + tolerance);
    
    return {
      isValid: farmerPrice >= minAllowed && farmerPrice <= maxAllowed,
      minAllowed: Math.round(minAllowed),
      maxAllowed: Math.round(maxAllowed),
      marketPrice: range.current,
      suggestion: farmerPrice < minAllowed ? 'too_low' : 
                 farmerPrice > maxAllowed ? 'too_high' : 'optimal'
    };
  }

  // Get commonly bought items for recommendations
  getCommonlyBought() {
    const commonly = [
      'tomato', 'onion', 'potato', 'carrot', 'cabbage',
      'apple', 'banana', 'orange', 'lemon', 'ginger'
    ];

    return commonly.map(commodity => ({
      name: commodity,
      displayName: commodity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      ...this.fallbackPrices[commodity]
    }));
  }
}

export default new MarketPriceService();
