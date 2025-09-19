import API from './api';
import cache from '../services/cache';

// ML API endpoints - using relative paths since API already has baseURL
const ML_API = {
    PRICE_PREDICTION: '/ml/price-prediction',
    PRICE_FACTORS: '/ml/price-factors',
    AVAILABLE_CROPS: '/ml/available-crops',
    HEALTH: '/ml/health',
    CROP_RECOMMENDATION: '/ml/crop-recommendation',
    CROP_CALENDAR: '/ml/crop-calendar'
};

// Cache TTLs (in milliseconds)
const CACHE_TTL = {
    PREDICTIONS: 5 * 60 * 1000,      // 5 minutes
    FACTORS: 30 * 60 * 1000,         // 30 minutes
    AVAILABLE_CROPS: 60 * 60 * 1000, // 1 hour
    CALENDAR: 24 * 60 * 60 * 1000    // 24 hours
};

// Helper to make authenticated requests with caching using our API instance
const makeAuthenticatedRequest = async (endpoint, options = {}, cacheKey = null, ttl = null) => {
    // Check cache if cacheKey is provided
    if (cacheKey) {
        const cachedData = cache.get(cacheKey);
        if (cachedData) return cachedData;
    }

    try {
        // Use API instance with interceptors that already handle auth headers
        let response;
        
        if (options.method === 'POST') {
            response = await API.post(endpoint, options.body ? JSON.parse(options.body) : {});
        } else if (options.method === 'PUT') {
            response = await API.put(endpoint, options.body ? JSON.parse(options.body) : {});
        } else {
            // Default to GET
            response = await API.get(endpoint);
        }

        const data = response.data;

        // Cache the response if cacheKey is provided
        if (cacheKey && ttl && data.success) {
            cache.set(cacheKey, data, ttl);
        }

        return data;
    } catch (error) {
        console.error('ML API request failed:', error);
        throw error;
    }
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
