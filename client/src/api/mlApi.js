import cache from '../services/cache';

// ML API endpoints
const ML_API = {
    PRICE_PREDICTION: '/api/ml/price-prediction',
    PRICE_FACTORS: '/api/ml/price-factors',
    AVAILABLE_CROPS: '/api/ml/available-crops',
    HEALTH: '/api/ml/health',
    CROP_RECOMMENDATION: '/api/ml/crop-recommendation',
    CROP_CALENDAR: '/api/ml/crop-calendar'
};

// Cache TTLs (in milliseconds)
const CACHE_TTL = {
    PREDICTIONS: 5 * 60 * 1000,      // 5 minutes
    FACTORS: 30 * 60 * 1000,         // 30 minutes
    AVAILABLE_CROPS: 60 * 60 * 1000, // 1 hour
    CALENDAR: 24 * 60 * 60 * 1000    // 24 hours
};

// Helper to handle response
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }
    return response.json();
};

// Helper to make authenticated requests with caching
const makeAuthenticatedRequest = async (endpoint, options = {}, cacheKey = null, ttl = null) => {
    // Check cache if cacheKey is provided
    if (cacheKey) {
        const cachedData = cache.get(cacheKey);
        if (cachedData) return cachedData;
    }

    const token = localStorage.getItem('token');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const response = await fetch(endpoint, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    });

    const data = await handleResponse(response);

    // Cache the response if cacheKey is provided
    if (cacheKey && ttl && data.success) {
        cache.set(cacheKey, data, ttl);
    }

    return data;
};

export const mlApi = {
    // Check ML service health
    checkHealth: () => makeAuthenticatedRequest(ML_API.HEALTH),
    
    // Get price predictions with caching
    getPricePrediction: (crop, days = 30) => {
        const cacheKey = `price_prediction:${crop}:${days}`;
        return makeAuthenticatedRequest(
            ML_API.PRICE_PREDICTION,
            {
                method: 'POST',
                body: JSON.stringify({ crop, days_ahead: days })
            },
            cacheKey,
            CACHE_TTL.PREDICTIONS
        );
    },
    
    // Get price impact factors with caching
    getPriceFactors: (crop) => {
        const cacheKey = `price_factors:${crop}`;
        return makeAuthenticatedRequest(
            `${ML_API.PRICE_FACTORS}/${crop}`,
            {},
            cacheKey,
            CACHE_TTL.FACTORS
        );
    },
    
    // Get available crops with caching
    getAvailableCrops: () => 
        makeAuthenticatedRequest(
            ML_API.AVAILABLE_CROPS,
            {},
            'available_crops',
            CACHE_TTL.AVAILABLE_CROPS
        ),
    
    // Get crop recommendations (no caching - depends on soil data)
    getCropRecommendations: (soilData) => 
        makeAuthenticatedRequest(
            ML_API.CROP_RECOMMENDATION,
            {
                method: 'POST',
                body: JSON.stringify({ soil_data: soilData })
            }
        ),
    
    // Get crop calendar with caching
    getCropCalendar: (crop, lat, lng) => {
        const cacheKey = `crop_calendar:${crop}:${lat}:${lng}`;
        return makeAuthenticatedRequest(
            `${ML_API.CROP_CALENDAR}/${crop}?lat=${lat}&lng=${lng}`,
            {},
            cacheKey,
            CACHE_TTL.CALENDAR
        );
    }
};
