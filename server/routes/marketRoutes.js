import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import marketPriceService from '../services/marketPriceService.js';
import recommendationEngine from '../services/recommendationEngine.js';

const router = express.Router();

// Get current market prices
router.get('/market-prices', async (req, res) => {
  try {
    const prices = await marketPriceService.getMarketPrices();
    res.json({
      success: true,
      prices,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching market prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market prices',
      error: error.message
    });
  }
});

// Get commonly bought items
router.get('/commonly-bought', async (req, res) => {
  try {
    const items = marketPriceService.getCommonlyBought();
    res.json({
      success: true,
      items
    });
  } catch (error) {
    console.error('Error fetching commonly bought items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch commonly bought items',
      error: error.message
    });
  }
});

// Validate farmer's price
router.post('/validate-price', protect, async (req, res) => {
  try {
    const { commodity, price } = req.body;
    
    if (!commodity || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Commodity name and price are required'
      });
    }

    const validation = marketPriceService.validateFarmerPrice(commodity, parseFloat(price));
    res.json({
      success: true,
      validation
    });
  } catch (error) {
    console.error('Error validating price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate price',
      error: error.message
    });
  }
});

// Get personalized recommendations
router.get('/recommendations', protect, async (req, res) => {
  try {
    const { lat, lng, limit = 20 } = req.query;
    const location = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;
    
    const recommendations = await recommendationEngine.getPersonalizedRecommendations(
      req.user._id,
      location,
      parseInt(limit)
    );
    
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
});

// Get price range for a commodity
router.get('/price-range/:commodity', async (req, res) => {
  try {
    const { commodity } = req.params;
    const range = marketPriceService.getPriceRange(commodity);
    
    res.json({
      success: true,
      commodity,
      range
    });
  } catch (error) {
    console.error('Error fetching price range:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch price range',
      error: error.message
    });
  }
});

export default router;
