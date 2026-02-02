/**
 * Model Helper Utilities
 * Provides backward compatibility and helper functions for model changes
 */

/**
 * Convert old location format {lat, lng} to GeoJSON
 */
export function convertToGeoJSON(location) {
  if (!location) return { type: 'Point', coordinates: [0, 0] };
  
  // Already GeoJSON format
  if (location.type === 'Point' && location.coordinates) {
    return location;
  }
  
  // Old format {lat, lng}
  if ('lat' in location || 'lng' in location) {
    return {
      type: 'Point',
      coordinates: [location.lng || 0, location.lat || 0]
    };
  }
  
  return { type: 'Point', coordinates: [0, 0] };
}

/**
 * Convert GeoJSON to simple {lat, lng} (for backward compatibility)
 */
export function convertFromGeoJSON(location) {
  if (!location || !location.coordinates) {
    return { lat: 0, lng: 0 };
  }
  
  return {
    lng: location.coordinates[0],
    lat: location.coordinates[1]
  };
}

/**
 * Get user location in preferred format
 */
export function getUserLocation(user, format = 'geojson') {
  if (format === 'geojson') {
    return convertToGeoJSON(user.location);
  }
  return convertFromGeoJSON(user.location);
}

/**
 * Check if user email is verified (backward compatible)
 */
export function isEmailVerified(user) {
  // New format
  if (user.verification?.email?.verified !== undefined) {
    return user.verification.email.verified;
  }
  // Old format
  if (user.emailVerified !== undefined) {
    return user.emailVerified;
  }
  return false;
}

/**
 * Check if farmer is verified (backward compatible)
 */
export function isFarmerVerified(user) {
  if (user.role !== 'farmer') return true;
  
  // New format
  if (user.verification?.kisan?.verified !== undefined) {
    return user.verification.kisan.verified;
  }
  // Old format
  if (user.kisanId?.verified !== undefined) {
    return user.kisanId.verified;
  }
  if (user.isVerified !== undefined) {
    return user.isVerified;
  }
  return false;
}

/**
 * Get product display price (backward compatible)
 */
export function getProductPrice(product) {
  // New pricing structure
  if (product.pricing?.displayPrice) {
    return product.pricing.displayPrice;
  }
  if (product.pricing?.farmerPrice) {
    return product.pricing.farmerPrice;
  }
  // Old format
  if (product.price) {
    return product.price;
  }
  return 0;
}

/**
 * Get product reference prices
 */
export function getReferencePrices(product) {
  const prices = {};
  
  // New format
  if (product.pricing?.reference) {
    prices.government = product.pricing.reference.governmentAverage;
    prices.marketTrend = product.pricing.reference.marketTrend;
    prices.lastUpdated = product.pricing.reference.lastUpdated;
  } else {
    // Old format
    prices.government = product.governmentPrice;
    prices.marketTrend = product.predictedPrice;
    prices.lastUpdated = null;
  }
  
  return prices;
}

/**
 * Get product available quantity (backward compatible)
 */
export function getProductQuantity(product) {
  if (product.quantity !== undefined) {
    return product.quantity;
  }
  if (product.stock !== undefined) {
    return product.stock;
  }
  return 0;
}

/**
 * Set product price with new structure
 */
export function setProductPrice(product, farmerPrice, referenceData = {}) {
  product.pricing = {
    farmerPrice,
    displayPrice: farmerPrice,
    reference: {
      governmentAverage: referenceData.governmentAverage || null,
      marketTrend: referenceData.marketTrend || null,
      lastUpdated: new Date()
    }
  };
  // Keep old field for backward compatibility
  product.price = farmerPrice;
  return product;
}

/**
 * Calculate product freshness in days
 */
export function calculateFreshness(product) {
  if (!product.freshness?.harvestedAt) return null;
  
  const now = new Date();
  const harvestedDate = new Date(product.freshness.harvestedAt);
  const daysOld = Math.floor((now - harvestedDate) / (1000 * 60 * 60 * 24));
  
  return daysOld;
}

/**
 * Check if product is fresh
 */
export function isFresh(product, maxDays = 7) {
  const daysOld = calculateFreshness(product);
  if (daysOld === null) return true; // No harvest date, assume fresh
  return daysOld <= maxDays;
}

/**
 * Get farmer from order (handles both old and new structure)
 */
export async function getOrderFarmer(order) {
  // New structure: get via farm populate
  if (order.farm && order.farm.ownerId) {
    return order.farm.ownerId;
  }
  
  // If farm is not populated, populate it
  if (order.farm && !order.farm.ownerId) {
    await order.populate('farm');
    return order.farm?.ownerId;
  }
  
  // Old structure: direct farmer reference (deprecated)
  if (order.farmer) {
    return order.farmer;
  }
  
  return null;
}

/**
 * Format user notification preferences
 */
export function getNotificationPreferences(user) {
  if (user.notifications) {
    return user.notifications;
  }
  
  // Default preferences
  return {
    email: true,
    sms: false,
    whatsapp: false,
    orders: true,
    offers: true
  };
}

/**
 * Validate cart has required farm reference
 */
export function validateCart(cart) {
  if (!cart.farm) {
    throw new Error('Cart must have a farm reference');
  }
  return true;
}

/**
 * DEPRECATED: Use MongoDB $geoNear instead
 * This function is kept for backward compatibility only
 * MongoDB's $geoNear is much more efficient for distance queries
 */
export function createDistanceQuery(longitude, latitude, maxDistanceKm = 50) {
  console.warn('createDistanceQuery is deprecated. Use $geoNear in aggregation pipeline instead.');
  return {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistanceKm * 1000 // Convert km to meters
      }
    }
  };
}

/**
 * DEPRECATED: Distance should be calculated by MongoDB using $geoNear
 * This function is kept for backward compatibility only
 * Use $geoNear's distanceField instead for better performance
 */
export function calculateDistance(point1, point2) {
  console.warn('calculateDistance is deprecated. Let MongoDB compute distance using $geoNear instead.');
  const R = 6371; // Earth's radius in km
  
  const coords1 = point1.coordinates || [0, 0];
  const coords2 = point2.coordinates || [0, 0];
  
  const lon1 = coords1[0] * Math.PI / 180;
  const lat1 = coords1[1] * Math.PI / 180;
  const lon2 = coords2[0] * Math.PI / 180;
  const lat2 = coords2[1] * Math.PI / 180;
  
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
}

export default {
  convertToGeoJSON,
  convertFromGeoJSON,
  getUserLocation,
  isEmailVerified,
  isFarmerVerified,
  getProductPrice,
  getReferencePrices,
  getProductQuantity,
  setProductPrice,
  calculateFreshness,
  isFresh,
  getOrderFarmer,
  getNotificationPreferences,
  validateCart,
  createDistanceQuery,
  calculateDistance
};
