import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import API from '../api/api';
import FarmMap from '../components/FarmMap';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  MapPinIcon,
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  AdjustmentsHorizontalIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const ProductDiscovery = () => {
  const { t } = useTranslation();
  
  // State Management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showMap, setShowMap] = useState(false);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    radius: 10000, // 10km default
    minScore: 0,
    category: '',
    minPrice: '',
    maxPrice: '',
    isOrganic: '',
    sortBy: 'distance' // distance, certScore, price
  });
  
  const [favorites, setFavorites] = useState(new Set());

  // Get user location on mount
  useEffect(() => {
    getUserLocation();
    fetchFavorites();
  }, []);

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // Auto-search once location is obtained
          fetchProducts(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Location error:', error);
          // Default to some location (e.g., Coimbatore)
          setUserLocation({ lat: 11.0168, lng: 76.9558 });
          fetchProducts(11.0168, 76.9558);
        }
      );
    } else {
      // Default location
      setUserLocation({ lat: 11.0168, lng: 76.9558 });
      fetchProducts(11.0168, 76.9558);
    }
  };

  const fetchProducts = useCallback(async (lat, lng) => {
    if (!lat || !lng) return;
    
    setLoading(true);
    setError('');
    
    try {
      const params = {
        latitude: lat,
        longitude: lng,
        radius: filters.radius,
        minScore: filters.minScore,
        query: searchQuery
      };
      
      const res = await API.get('/products/nearby', { params });
      setProducts(res.data);
    } catch (err) {
      setError('Error fetching products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters.radius, filters.minScore]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (userLocation) {
      fetchProducts(userLocation.lat, userLocation.lng);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await API.get('/favorites');
      setFavorites(new Set(res.data.map(fav => fav.productId)));
    } catch (err) {
      console.error('Error fetching favorites');
    }
  };

  const toggleFavorite = async (productId) => {
    try {
      if (favorites.has(productId)) {
        await API.delete(`/favorites/${productId}`);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        await API.post('/favorites', { productId });
        setFavorites(prev => new Set([...prev, productId]));
      }
    } catch (err) {
      console.error('Error toggling favorite');
    }
  };

  const addToCart = async (productId) => {
    try {
      await API.post('/cart/add', { productId, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert('Error adding to cart');
    }
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const getCertificationBadge = (score) => {
    if (score >= 35) return { label: 'Premium', color: 'bg-yellow-500' };
    if (score >= 20) return { label: 'Certified', color: 'bg-green-500' };
    if (score >= 10) return { label: 'Verified', color: 'bg-blue-500' };
    return { label: 'Standard', color: 'bg-gray-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-green-800 mb-4">
            {t('Discover Fresh Produce')}
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search crops... (e.g., carrot, tomato)')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base font-medium"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <MapPinIcon className="h-5 w-5 text-gray-600" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FunnelIcon className="h-5 w-5" />
                Filters
              </h3>
              
              {/* Distance Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance: {(filters.radius / 1000).toFixed(0)}km
                </label>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={filters.radius}
                  onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Certification Score Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Certification Score: {filters.minScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={filters.minScore}
                  onChange={(e) => setFilters({ ...filters, minScore: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-1/2 px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-1/2 px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Organic Filter */}
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.isOrganic === 'true'}
                    onChange={(e) => setFilters({ ...filters, isOrganic: e.target.checked ? 'true' : '' })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Organic Only</span>
                </label>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={() => userLocation && fetchProducts(userLocation.lat, userLocation.lng)}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-600 py-8">
                No products found in your area. Try increasing the distance filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const certBadge = getCertificationBadge(product.farm?.certificationScore || 0);
                  
                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 bg-gray-200">
                        {product.images && product.images[0] ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}/${product.images[0]}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        
                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(product._id)}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition"
                        >
                          {favorites.has(product._id) ? (
                            <HeartIconSolid className="h-5 w-5 text-red-500" />
                          ) : (
                            <HeartIcon className="h-5 w-5 text-gray-600" />
                          )}
                        </button>

                        {/* Organic Badge */}
                        {product.isOrganic && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                            Organic
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {product.name}
                        </h3>
                        
                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-2xl font-bold text-green-600">
                            ₹{product.price}
                          </span>
                          <span className="text-sm text-gray-500">/{product.unit}</span>
                          {product.predictedPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.predictedPrice}
                            </span>
                          )}
                        </div>

                        {/* Distance & Farm */}
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4" />
                            <span>{formatDistance(product.distance)} away</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <span className="font-medium">{product.farm?.name}</span>
                          </div>

                          {/* Certification Badge */}
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 ${certBadge.color} text-white rounded-full`}>
                              {certBadge.label}
                            </span>
                            <div className="flex items-center gap-1">
                              <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600">
                                {product.farm?.certificationScore || 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => addToCart(product._id)}
                          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                          <ShoppingCartIcon className="h-5 w-5" />
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="fixed bottom-0 left-0 right-0 h-96 bg-white border-t shadow-lg z-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">📍 Nearby Farms & Products</h3>
            <button
              onClick={() => setShowMap(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            >
              ✕ Close
            </button>
          </div>
          <div className="w-full h-[calc(100%-3rem)]">
            <FarmMap
              farms={products}
              userLocation={userLocation}
              radius={filters.radius}
              onFarmClick={(farm) => {
                setSelectedProduct(farm);
                console.log('Selected farm:', farm);
              }}
              selectedFarm={selectedProduct}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDiscovery;
