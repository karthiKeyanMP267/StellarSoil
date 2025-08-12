import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Helper to validate soil data
const validateSoilData = (data) => {
    const requiredFields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
    return requiredFields.every(field => {
        const value = data[field];
        return value !== undefined && value !== null && !isNaN(value);
    });
};

const runPythonScript = (scriptName, args = []) => {
    return new Promise((resolve, reject) => {
        // Add error handling for script existence
        const scriptPath = path.join(__dirname, '..', 'ml_service', scriptName);
        
        const pythonProcess = spawn('python', [
            scriptPath,
            ...args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
        ]);

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        // Add timeout
        const timeout = setTimeout(() => {
            pythonProcess.kill();
            reject(new Error('Process timed out'));
        }, 30000); // 30 second timeout

        pythonProcess.on('close', (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
                reject(new Error(error || `Process failed with code ${code}`));
            } else {
                try {
                    resolve(JSON.parse(result));
                } catch (e) {
                    resolve(result);
                }
            }
        });

        pythonProcess.on('error', (err) => {
            clearTimeout(timeout);
            reject(err);
        });
    });
};

// Health check endpoint
router.get('/health', async (req, res) => {
    try {
        await Promise.all([
            runPythonScript('crop_recommendation.py', ['health']),
            runPythonScript('price_prediction.py', ['health'])
        ]);
        res.json({ status: 'healthy' });
    } catch (error) {
        res.status(503).json({ 
            status: 'unhealthy',
            error: error.message
        });
    }
});

// Get crop recommendations
router.post('/crop-recommendation', protect, async (req, res) => {
    try {
        const { soil_data } = req.body;
        
        if (!soil_data) {
            return res.status(400).json({ 
                success: false, 
                message: 'Soil data is required' 
            });
        }

        if (!validateSoilData(soil_data)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or missing soil data fields' 
            });
        }

        const result = await runPythonScript('crop_recommendation.py', [
            soil_data
        ]);

        res.json(result);
    } catch (error) {
        console.error('Crop recommendation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error generating crop recommendations',
            error: error.message 
        });
    }
});

// Get price predictions
router.post('/price-prediction', protect, async (req, res) => {
    try {
        const { crop, days_ahead = 30 } = req.body;
        
        if (!crop) {
            return res.status(400).json({ 
                success: false, 
                message: 'Crop name is required' 
            });
        }

        if (!Number.isInteger(days_ahead) || days_ahead < 1 || days_ahead > 365) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid days_ahead value. Must be between 1 and 365.' 
            });
        }

        const result = await runPythonScript('price_prediction.py', [
            crop,
            days_ahead.toString()
        ]);

        res.json(result);
    } catch (error) {
        console.error('Price prediction error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error generating price predictions',
            error: error.message 
        });
    }
});

// Get crop calendar
router.get('/crop-calendar/:crop', protect, async (req, res) => {
    try {
        const { crop } = req.params;
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ 
                success: false, 
                message: 'Latitude and longitude are required' 
            });
        }

        const result = await runPythonScript('crop_recommendation.py', [
            'calendar',
            crop,
            { lat: parseFloat(lat), lng: parseFloat(lng) }
        ]);

        res.json(result);
    } catch (error) {
        console.error('Crop calendar error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error getting crop calendar',
            error: error.message 
        });
    }
});

// Get available crops
router.get('/available-crops', protect, async (req, res) => {
    try {
        const result = await runPythonScript('crop_recommendation.py', ['list-crops']);
        res.json(result);
    } catch (error) {
        console.error('Available crops error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error getting available crops',
            error: error.message 
        });
    }
});

// Get price factors
router.get('/price-factors/:crop', protect, async (req, res) => {
    try {
        const { crop } = req.params;
        
        const result = await runPythonScript('price_prediction.py', [
            'factors',
            crop
        ]);

        res.json(result);
    } catch (error) {
        console.error('Price factors error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error getting price factors',
            error: error.message 
        });
    }
});

export default router;
