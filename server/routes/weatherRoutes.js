import express from 'express';
import weatherService from '../services/weatherService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current weather for a location
router.get('/current', protect, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const weather = await weatherService.getCurrentWeather(lat, lon);
    res.json(weather);
  } catch (error) {
    console.error('Weather current API error:', error);
    res.status(500).json({ message: 'Failed to fetch current weather' });
  }
});

// Get weather forecast
router.get('/forecast', protect, async (req, res) => {
  try {
    const { lat, lon, days = 5 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const forecast = await weatherService.getWeatherForecast(lat, lon, parseInt(days));
    res.json(forecast);
  } catch (error) {
    console.error('Weather forecast API error:', error);
    res.status(500).json({ message: 'Failed to fetch weather forecast' });
  }
});

// Get agricultural alerts
router.get('/alerts', protect, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const alerts = await weatherService.getAgriculturalAlerts(lat, lon);
    res.json(alerts);
  } catch (error) {
    console.error('Weather alerts API error:', error);
    res.status(500).json({ message: 'Failed to fetch agricultural alerts' });
  }
});

export default router;
