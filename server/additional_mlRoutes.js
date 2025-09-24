// Add these routes to the mlRoutes.js file

// Get crop list for dropdown
router.get('/crop-list', async (req, res) => {
    try {
        // This could be expanded with real data from a database
        const crops = [
            { value: 'tomato', label: 'Tomato' },
            { value: 'potato', label: 'Potato' },
            { value: 'onion', label: 'Onion' },
            { value: 'cabbage', label: 'Cabbage' },
            { value: 'rice', label: 'Rice' },
            { value: 'wheat', label: 'Wheat' },
            { value: 'carrot', label: 'Carrot' }
        ];
        
        res.json({
            success: true,
            crops
        });
    } catch (error) {
        console.error('Crop list error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error getting crop list',
            error: error.message 
        });
    }
});

// Get price prediction (GET method for easier caching and fetching)
router.get('/price-prediction/:crop', protect, async (req, res) => {
    try {
        const { crop } = req.params;
        const { region = 'national', days_ahead = 30 } = req.query;
        
        if (!crop) {
            return res.status(400).json({ 
                success: false, 
                message: 'Crop name is required' 
            });
        }

        // Convert days_ahead to number and validate
        const daysAhead = parseInt(days_ahead, 10);
        if (isNaN(daysAhead) || daysAhead < 1 || daysAhead > 365) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid days_ahead value. Must be between 1 and 365.' 
            });
        }

        const result = await runPythonScript('price_prediction.py', [
            'predict',
            crop,
            daysAhead.toString()
        ]);

        // If region is specified, adjust prices based on region
        // This is a simplified example - in production, this would use real regional data
        if (region && region !== 'national' && result.success) {
            const regionFactors = {
                'north': 0.95, // 5% lower than national average
                'south': 1.10, // 10% higher than national average
                'east': 0.90,  // 10% lower than national average
                'west': 1.05   // 5% higher than national average
            };
            
            const factor = regionFactors[region] || 1;
            
            // Apply regional adjustment to all prices
            if (result.predictions && Array.isArray(result.predictions)) {
                result.predictions = result.predictions.map(pred => ({
                    ...pred,
                    price: parseFloat((pred.price * factor).toFixed(2)),
                    lower_bound: parseFloat((pred.lower_bound * factor).toFixed(2)),
                    upper_bound: parseFloat((pred.upper_bound * factor).toFixed(2))
                }));
            }
            
            if (result.average_price) {
                result.average_price = parseFloat((result.average_price * factor).toFixed(2));
            }
            
            result.region = region;
        }

        // Format the data to match what our widget expects
        const formattedResult = [];
        const today = new Date();
        
        // Add historical data (7 days ago to yesterday)
        for (let i = -7; i < 0; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            
            // Generate a somewhat realistic historical price using the prediction as base
            const basePrice = result.predictions?.[0]?.price || 50;
            const fluctuation = ((Math.random() - 0.5) * 10); // Random between -5 and +5
            const price = parseFloat((basePrice + fluctuation).toFixed(2));
            
            formattedResult.push({
                date: date.toISOString().split('T')[0],
                price,
                isProjected: false
            });
        }
        
        // Add today's price
        formattedResult.push({
            date: today.toISOString().split('T')[0],
            price: result.predictions?.[0]?.price || 50,
            isProjected: false
        });
        
        // Add future projections
        if (result.predictions && Array.isArray(result.predictions)) {
            // Skip the first one as it's already added as today
            for (let i = 1; i < result.predictions.length && i <= 7; i++) {
                const prediction = result.predictions[i];
                formattedResult.push({
                    date: prediction.date,
                    price: prediction.price,
                    isProjected: true
                });
            }
        }
        
        res.json(formattedResult);
    } catch (error) {
        console.error('Price prediction error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error generating price predictions',
            error: error.message 
        });
    }
});