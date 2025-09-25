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
    const scriptPath = path.join(__dirname, '..', 'ml_service', scriptName);
    const isWin = process.platform === 'win32';
    const candidates = [];
    const envExec = process.env.PYTHON_EXEC || process.env.PYTHON_PATH;
    if (envExec) {
        candidates.push({ exec: envExec, preArgs: [] });
    }
    if (isWin) {
        candidates.push({ exec: 'py', preArgs: ['-3'] }, { exec: 'python', preArgs: [] }, { exec: 'python3', preArgs: [] });
    } else {
        candidates.push({ exec: 'python3', preArgs: [] }, { exec: 'python', preArgs: [] });
    }

    const tryOne = (exec, preArgs) => new Promise((resolve, reject) => {
        let result = '';
        let error = '';
        const pythonProcess = spawn(exec, [
            ...preArgs,
            scriptPath,
            ...args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
        ]);

        const timeout = setTimeout(() => {
            pythonProcess.kill();
            reject(new Error('Process timed out'));
        }, 30000);

        pythonProcess.stdout.on('data', (d) => { result += d.toString(); });
        pythonProcess.stderr.on('data', (d) => { error += d.toString(); });
        pythonProcess.on('close', (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
                reject(new Error(error || `Process failed with code ${code}`));
            } else {
                try { resolve(JSON.parse(result)); } catch { resolve(result); }
            }
        });
        pythonProcess.on('error', (err) => { clearTimeout(timeout); reject(err); });
    });

    return candidates.reduce((p, { exec, preArgs }) => p.catch(() => tryOne(exec, preArgs)), Promise.reject())
        .catch((err) => {
            // Final error with hint
            throw new Error(`Python execution failed: ${err.message}. Set PYTHON_EXEC or install Python 3.`);
        });
};

// Health check endpoint
router.get('/health', async (req, res) => {
    try {
        await Promise.all([
            runPythonScript('crop_recommendation.py', ['health']),
            runPythonScript('price_prediction.py', ['health']),
            runPythonScript('stock_prediction.py', ['health'])
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
            'predict',
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
            'predict',
            crop,
            days_ahead.toString()
        ]);

        // Normalize to UI schema expected by LiveMarketPriceWidget
        if (result && result.success && Array.isArray(result.predictions)) {
            const preds = result.predictions || [];
            const pick = (idx) => preds[Math.min(idx, preds.length - 1)]?.price ?? null;
            const current = Math.round(result.average_price || pick(0) || Math.random() * 80 + 20);
            const p7 = Math.round(pick(6) || current);
            const p15 = Math.round(pick(14) || p7);
            const p30 = Math.round(pick(29) || p15);
            const trend = ((p30 + p15 + p7) / 3) >= current ? 'up' : 'down';
            // Derive a confidence score from the confidence interval range; clamp to [70, 95]
            const confFromCI = result.confidence_interval ? Math.max(70, Math.min(95, 100 - Math.round(result.confidence_interval))) : 85;

            return res.json({
                success: true,
                crop,
                current_price: current,
                predictions: { '7d': p7, '15d': p15, '30d': p30 },
                trend,
                confidence: confFromCI,
                factors: [
                    'Seasonal demand',
                    'Supply constraints',
                    'Weather patterns'
                ]
            });
        }

        // If python returned a different shape or failed gracefully, forward it
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

// Public GET variant for widgets (no auth). Query: ?crop=tomatoes&days_ahead=30
router.get('/price-prediction', async (req, res) => {
    try {
        const crop = req.query.crop;
        const days_ahead = parseInt(req.query.days_ahead || '30', 10);
        if (!crop) {
            return res.status(400).json({ success: false, message: 'Crop name is required' });
        }
        if (!Number.isInteger(days_ahead) || days_ahead < 1 || days_ahead > 365) {
            return res.status(400).json({ success: false, message: 'Invalid days_ahead value. Must be between 1 and 365.' });
        }
        const result = await runPythonScript('price_prediction.py', ['predict', crop, days_ahead.toString()]);
        if (result && result.success && Array.isArray(result.predictions)) {
            const preds = result.predictions || [];
            const pick = (idx) => preds[Math.min(idx, preds.length - 1)]?.price ?? null;
            const current = Math.round(result.average_price || pick(0) || Math.random() * 80 + 20);
            const p7 = Math.round(pick(6) || current);
            const p15 = Math.round(pick(14) || p7);
            const p30 = Math.round(pick(29) || p15);
            const trend = ((p30 + p15 + p7) / 3) >= current ? 'up' : 'down';
            const confFromCI = result.confidence_interval ? Math.max(70, Math.min(95, 100 - Math.round(result.confidence_interval))) : 85;
            return res.json({ success: true, crop, current_price: current, predictions: { '7d': p7, '15d': p15, '30d': p30 }, trend, confidence: confFromCI, factors: ['Seasonal demand','Supply constraints','Weather patterns'] });
        }
        res.json(result);
    } catch (error) {
        console.error('Public price prediction error:', error);
        res.status(500).json({ success: false, message: 'Error generating price predictions', error: error.message });
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

// New: Predict stock depletion and inventory forecast
router.post('/stock-prediction', protect, async (req, res) => {
    try {
        const { product_name, current_stock, days_ahead = 30, sales_history } = req.body || {};

        if (product_name === undefined || current_stock === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'product_name and current_stock are required' 
            });
        }

        const payload = {
            product_name,
            current_stock: Number(current_stock),
            days_ahead: Number.isInteger(days_ahead) ? days_ahead : parseInt(days_ahead, 10) || 30,
            sales_history: Array.isArray(sales_history) ? sales_history : []
        };

        const result = await runPythonScript('stock_prediction.py', [
            'predict',
            payload
        ]);

        res.json(result);
    } catch (error) {
        console.error('Stock prediction error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error generating stock predictions',
            error: error.message 
        });
    }
});

export default router;
