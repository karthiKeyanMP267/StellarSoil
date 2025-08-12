import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as farmManagementController from '../controllers/farmManagementController.js';

const router = express.Router();

// Sensor Data Routes
router.get('/sensor-data/:farmId', protect, farmManagementController.getSensorData);
router.post('/sensor-data', protect, farmManagementController.addSensorData);

// Pest Alert Routes
router.post('/pest-alert', protect, farmManagementController.reportPestAlert);
router.get('/pest-alerts', protect, farmManagementController.getPestAlerts);

// Crop Health Routes
router.put('/crop-health/:cropId', protect, farmManagementController.updateCropHealth);
router.post('/analyze-crop', protect, farmManagementController.analyzeCropImage);

// Recommendation Routes
router.get('/recommendations', protect, farmManagementController.getRecommendations);
router.get('/seasonal-guide', protect, farmManagementController.getSeasonalGuide);

export default router;
