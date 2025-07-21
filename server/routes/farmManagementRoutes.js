const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const farmManagementController = require('../controllers/farmManagementController');

// Sensor Data Routes
router.get('/sensor-data/:farmId', authMiddleware, farmManagementController.getSensorData);
router.post('/sensor-data', authMiddleware, farmManagementController.addSensorData);

// Pest Alert Routes
router.post('/pest-alert', authMiddleware, farmManagementController.reportPestAlert);
router.get('/pest-alerts', authMiddleware, farmManagementController.getPestAlerts);

// Crop Health Routes
router.put('/crop-health/:cropId', authMiddleware, farmManagementController.updateCropHealth);
router.post('/analyze-crop', authMiddleware, farmManagementController.analyzeCropImage);

// Recommendation Routes
router.get('/recommendations', authMiddleware, farmManagementController.getRecommendations);
router.get('/seasonal-guide', authMiddleware, farmManagementController.getSeasonalGuide);

module.exports = router;
