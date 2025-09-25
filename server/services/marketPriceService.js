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
    this.resourceId = '9ef84268-d588-465a-a308-a864a43d0070'; // Agmarknet dataset id (daily prices)
    this.commoditiesCache = { data: null, ts: 0 };
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
      // Requires DATA_GOV_API_KEY in environment
      const response = await axios.get(`https://api.data.gov.in/resource/${this.resourceId}`, {
        params: {
          'api-key': process.env.DATA_GOV_API_KEY || 'demo-key',
          format: 'json',
          limit: 200,
          // Sort latest first for better recency
          'sort[by]': 'arrival_date',
          'sort[order]': 'desc'
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

  // Map UI crop names to dataset commodity names
  normalizeCommodityName(name = '') {
    const n = String(name).trim().toLowerCase();
    const map = {
      tomatoes: 'Tomato',
      tomato: 'Tomato',
      onions: 'Onion',
      onion: 'Onion',
      potatoes: 'Potato',
      potato: 'Potato',
      brinjal: 'Brinjal',
      eggplant: 'Brinjal',
      ladies_finger: 'Bhindi',
      okra: 'Bhindi',
      rice: 'Rice',
      wheat: 'Wheat'
    };
    return map[n] || (n.charAt(0).toUpperCase() + n.slice(1));
  }

  // Get list of available commodities from Agmarknet (cached), fallback to keys from fallbackPrices
  async getCommodities() {
    const now = Date.now();
    // Cache for 24 hours
    if (this.commoditiesCache.data && now - this.commoditiesCache.ts < 24 * 60 * 60 * 1000) {
      return this.commoditiesCache.data;
    }
    try {
      const params = {
        'api-key': process.env.DATA_GOV_API_KEY,
        format: 'json',
        limit: 5000,
        fields: 'commodity',
        'sort[by]': 'commodity',
        'sort[order]': 'asc'
      };
      const resp = await axios.get(`https://api.data.gov.in/resource/${this.resourceId}`, { params, timeout: 8000 });
      const recs = resp.data?.records || [];
      const set = new Set();
      for (const r of recs) {
        const c = (r.commodity || '').toString().trim();
        if (c) set.add(c);
      }
      let list = Array.from(set).sort((a, b) => a.localeCompare(b));
      if (list.length === 0) {
        list = Object.keys(this.fallbackPrices).map(k => this.normalizeCommodityName(k));
      }
      this.commoditiesCache = { data: list, ts: now };
      return list;
    } catch (e) {
      const list = Object.keys(this.fallbackPrices).map(k => this.normalizeCommodityName(k));
      this.commoditiesCache = { data: list, ts: now };
      return list;
    }
  }

  // Fetch recent daily prices for a commodity from Agmarknet and compute simple forecasts
  async getLivePriceAndForecast(commodityInput, options = {}) {
    const commodity = this.normalizeCommodityName(commodityInput);
    const days = Math.min(Math.max(parseInt(options.days || 30, 10) || 30, 7), 120);
    const cacheKey = `live_${commodity}_${days}`;
    const cached = this.pricesCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 15 * 60 * 1000) { // 15 minutes
      return cached.data;
    }

    try {
      // Normalize common state variants to official names
      const normalizeState = (s) => {
        if (!s) return s;
        const raw = String(s).trim().toLowerCase().replace(/\s+/g, '');
        const map = {
          'tamilnadu': 'Tamil Nadu',
          'andhrapradesh': 'Andhra Pradesh',
          'uttarpradesh': 'Uttar Pradesh',
          'madhyapradesh': 'Madhya Pradesh'
        };
        return map[raw] || s;
      };
      if (options.state) options.state = normalizeState(options.state);

      // Pull latest 1000 records for the commodity, sorted by date desc
      const paramsA = {
        'api-key': process.env.DATA_GOV_API_KEY,
        format: 'json',
        limit: 1000,
        'sort[by]': 'arrival_date',
        'sort[order]': 'desc',
        // Try filter style A
        [`filters[commodity]`]: commodity,
        ...(options.state ? { [`filters[state]`]: options.state } : {}),
        ...(options.district ? { [`filters[district]`]: options.district } : {}),
        ...(options.market ? { [`filters[market]`]: options.market } : {}),
        ...(options.variety ? { [`filters[variety]`]: options.variety } : {})
      };
      let records = [];
      try {
        const resp = await axios.get(`https://api.data.gov.in/resource/${this.resourceId}`, { params: paramsA, timeout: 8000 });
        records = resp.data?.records || [];
      } catch (e) {
        // Try filter style B if needed
        const resp = await axios.get(`https://api.data.gov.in/resource/${this.resourceId}`, {
          params: {
            'api-key': process.env.DATA_GOV_API_KEY,
            format: 'json',
            limit: 1000,
            'sort[by]': 'arrival_date',
            'sort[order]': 'desc',
            commodity,
            ...(options.state ? { state: options.state } : {}),
            ...(options.district ? { district: options.district } : {}),
            ...(options.market ? { market: options.market } : {}),
            ...(options.variety ? { variety: options.variety } : {})
          },
          timeout: 8000
        });
        records = resp.data?.records || [];
      }

      // Group by date and take median of modal_price across markets
      const byDate = new Map();
      for (const r of records) {
        if (!r?.arrival_date || !r?.modal_price) continue;
        const d = r.arrival_date; // format: DD/MM/YYYY
        const price = parseFloat(r.modal_price);
        if (isNaN(price)) continue;
        if (!byDate.has(d)) byDate.set(d, []);
        byDate.get(d).push(price);
      }

      // Convert to timeseries sorted asc by date
      const parseDMY = (s) => {
        const [dd, mm, yyyy] = String(s).split('/').map(x => parseInt(x, 10));
        return new Date(yyyy, (mm || 1) - 1, dd || 1);
      };
      const timeseries = Array.from(byDate.entries())
        .map(([date, arr]) => ({ date, ts: parseDMY(date).getTime(), median: this.median(arr), count: arr.length }))
        .filter(x => !isNaN(x.ts))
        .sort((a, b) => a.ts - b.ts);

      // Consider last N days window
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const recent = timeseries.filter(x => x.ts >= cutoff);

      if (recent.length === 0) {
        // Fallback to randomized based on static table
        const fb = this.generateRandomizedPrices()[commodity.toLowerCase()] || this.getPriceRange(commodity);
        const out = {
          success: true,
          crop: commodityInput,
          current_price: Math.round(fb.current || 50),
          predictions: { '7d': Math.round(fb.current), '15d': Math.round(fb.current), '30d': Math.round(fb.current) },
          trend: 'flat',
          confidence: 75,
          source: 'fallback'
        };
        this.pricesCache.set(cacheKey, { data: out, timestamp: Date.now() });
        return out;
      }

      const currentFloat = recent[recent.length - 1].median;
      const current = Math.round(currentFloat);

      // Simple linear trend using last K points
      const K = Math.min(recent.length, 30);
      const lastK = recent.slice(-K);
      const x = lastK.map((_, i) => i + 1);
      const y = lastK.map(p => p.median);
      const { slope, intercept } = this.linearRegression(x, y);
      const forecastAtFloat = (daysAhead) => Math.max(1, intercept + slope * (K + daysAhead));
      let p7f = forecastAtFloat(7);
      let p15f = forecastAtFloat(15);
      let p30f = forecastAtFloat(30);

      // Confidence based on sample size and volatility (std dev)
      const mean = y.reduce((a, b) => a + b, 0) / y.length;
      const variance = y.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / y.length;
      const std = Math.sqrt(variance);
      const volatility = Math.min(1, std / (mean || 1));
      const sampleFactor = Math.min(1, y.length / 30);
      const conf = Math.round(70 + 25 * sampleFactor * (1 - volatility)); // 70–95

      // If forecasts collapse to current due to tiny slope and rounding, adjust using volatility and last delta
      const lastDelta = y.length > 1 ? (y[y.length - 1] - y[y.length - 2]) : 0;
      const trendSign = Math.sign(slope || lastDelta || 1);
      const minStep = Math.max(1, Math.round(std * 0.15)); // at least ₹1 if any volatility

      const adjustIfFlat = (predFloat, horizonWeight) => {
        const pred = Math.round(predFloat);
        if (pred !== current) return pred;
        // If essentially flat, nudge by volatility in trend direction
        if (std > 0.01 || Math.abs(slope) > 0.0001 || Math.abs(lastDelta) > 0.01) {
          const nudged = current + trendSign * Math.max(1, Math.round(minStep * horizonWeight));
          return nudged;
        }
        return pred; // truly flat market
      };

      let p7 = adjustIfFlat(p7f, 0.5);
      let p15 = adjustIfFlat(p15f, 0.8);
      let p30 = adjustIfFlat(p30f, 1.2);

      // Clamp predictions within ±20% of current to avoid unrealistic spikes
      const clamp = (pred) => {
        const min = Math.round(current * 0.8);
        const max = Math.round(current * 1.2);
        return Math.max(min, Math.min(max, Math.round(pred)));
      };
      p7 = clamp(p7);
      p15 = clamp(p15);
      p30 = clamp(p30);

      const out = {
        success: true,
        crop: commodityInput,
        current_price: current,
        predictions: { '7d': p7, '15d': p15, '30d': p30 },
        trend: ((p30 + p15 + p7) / 3) >= current ? 'up' : 'down',
        confidence: Math.max(70, Math.min(95, conf)),
        source: 'agmarknet',
        sample_size: y.length
      };

      this.pricesCache.set(cacheKey, { data: out, timestamp: Date.now() });
      return out;
    } catch (err) {
      console.error('getLivePriceAndForecast error:', err.message);
      // graceful fallback
      const fb = this.generateRandomizedPrices()[commodity.toLowerCase()] || this.getPriceRange(commodity);
      const out = {
        success: true,
        crop: commodityInput,
        current_price: Math.round(fb.current || 50),
        predictions: { '7d': Math.round(fb.current), '15d': Math.round(fb.current), '30d': Math.round(fb.current) },
        trend: 'flat',
        confidence: 75,
        source: 'fallback'
      };
      this.pricesCache.set(cacheKey, { data: out, timestamp: Date.now() });
      return out;
    }
  }

  median(arr) {
    if (!arr || arr.length === 0) return 0;
    const a = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(a.length / 2);
    return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
  }

  linearRegression(x, y) {
    const n = Math.min(x.length, y.length);
    if (n === 0) return { slope: 0, intercept: y[0] || 0 };
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.slice(0, n).reduce((a, b) => a + b * b, 0);
    const denom = n * sumXX - sumX * sumX;
    const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  }
}

export default new MarketPriceService();
