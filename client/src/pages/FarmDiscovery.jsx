import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import API from '../api/api';
import FarmMap from '../components/FarmMap';
import { 
  MapPinIcon, 
  StarIcon,
  CheckBadgeIcon,
  PhoneIcon,
  EnvelopeIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const FarmDiscovery = () => {
  const { t } = useTranslation();
  
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  
  const [filters, setFilters] = useState({
    radius: 10, // km
    minScore: 0,
    limit: 20
  });

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          fetchNearbyFarms(location.lat, location.lng);
        },
        (error) => {
          console.error('Location error:', error);
          const defaultLocation = { lat: 11.0168, lng: 76.9558 };
          setUserLocation(defaultLocation);
          fetchNearbyFarms(defaultLocation.lat, defaultLocation.lng);
        }
      );
    } else {
      const defaultLocation = { lat: 11.0168, lng: 76.9558 };
      setUserLocation(defaultLocation);
      fetchNearbyFarms(defaultLocation.lat, defaultLocation.lng);
    }
  };

  const fetchNearbyFarms = async (lat, lng) => {
    if (!lat || !lng) return;
    
    setLoading(true);
    setError('');
    
    try {
      const params = {
        latitude: lat,
        longitude: lng,
        radius: filters.radius,
        minScore: filters.minScore,
        limit: filters.limit
      };
      
      const res = await API.get('/farms/nearby', { params });
      setFarms(res.data.farms || res.data);
      console.log('Fetched farms:', res.data);
    } catch (err) {
      setError('Error fetching farms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCertificationBadge = (score) => {
    if (score >= 35) return { label: 'Premium', color: 'bg-yellow-500', icon: '⭐' };
    if (score >= 20) return { label: 'Certified', color: 'bg-green-500', icon: '✓' };
    if (score >= 10) return { label: 'Verified', color: 'bg-blue-500', icon: '✓' };
    return { label: 'Standard', color: 'bg-gray-500', icon: '' };
  };

  const handleApplyFilters = () => {
    if (userLocation) {
      fetchNearbyFarms(userLocation.lat, userLocation.lng);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800">
              🌾 Discover Certified Farms
            </h1>
            
            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition text-sm sm:text-base ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow text-green-600 font-medium' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📋 Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md transition ${
                  viewMode === 'map' 
                    ? 'bg-white shadow text-green-600 font-medium' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🗺️ Map
              </button>
            </div>
          </div>
          
          {userLocation && (
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              📍 Showing farms near: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Filters
              </h3>
              
              {/* Distance Filter */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Search Radius: {filters.radius} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={filters.radius}
                  onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })}
                  className="w-full h-2"
                />
              </div>

              {/* Certification Score Filter */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Min Certification Score: {filters.minScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={filters.minScore}
                  onChange={(e) => setFilters({ ...filters, minScore: parseInt(e.target.value) })}
                  className="w-full h-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Any</span>
                  <span>Premium</span>
                </div>
              </div>

              {/* Limit */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Results: {filters.limit}
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={handleApplyFilters}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Apply Filters
              </button>
              
              {/* Results Count */}
              {farms.length > 0 && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  Found {farms.length} farms
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : viewMode === 'map' ? (
              /* Map View */
              <div className="h-[calc(100vh-200px)] bg-white rounded-lg shadow-md overflow-hidden">
                <FarmMap
                  farms={farms}
                  userLocation={userLocation}
                  radius={filters.radius * 1000}
                  onFarmClick={(farm) => {
                    setSelectedFarm(farm);
                    setViewMode('grid');
                  }}
                  selectedFarm={selectedFarm}
                />
              </div>
            ) : farms.length === 0 ? (
              <div className="text-center text-gray-600 py-8 bg-white rounded-lg shadow-md">
                <p className="text-lg mb-2">No farms found in your area.</p>
                <p className="text-sm">Try increasing the search radius or reducing the minimum certification score.</p>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {farms.map((farm) => {
                  const certBadge = getCertificationBadge(farm.certificationScore || 0);
                  const isSelected = selectedFarm?._id === farm._id;
                  
                  return (
                    <motion.div
                      key={farm._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all ${
                        isSelected ? 'ring-2 ring-green-500' : ''
                      }`}
                    >
                      {/* Farm Header */}
                      <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-bold">{farm.name}</h3>
                          <span className={`px-3 py-1 ${certBadge.color} rounded-full text-sm font-medium`}>
                            {certBadge.icon} {certBadge.label}
                          </span>
                        </div>
                        
                        {/* Certification Score */}
                        <div className="flex items-center gap-2">
                          <StarIcon className="h-5 w-5 fill-current" />
                          <span className="text-lg font-semibold">
                            {farm.certificationScore || 0} Points
                          </span>
                        </div>
                      </div>

                      {/* Farm Details */}
                      <div className="p-6">
                        {/* Distance & Ranking */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Distance</p>
                            <p className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                              <MapPinIcon className="h-5 w-5 text-green-600" />
                              {farm.distanceKm ? `${farm.distanceKm.toFixed(1)} km` : 'N/A'}
                            </p>
                          </div>
                          
                          {farm.finalScore !== undefined && (
                            <div>
                              <p className="text-sm text-gray-500">Ranking Score</p>
                              <p className="text-lg font-semibold text-green-600">
                                🏆 {farm.finalScore.toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Owner Information */}
                        {farm.ownerId && (
                          <div className="border-t pt-4 mb-4">
                            <p className="text-sm text-gray-500 mb-2">Farm Owner</p>
                            <p className="font-medium text-gray-800">
                              👨‍🌾 {farm.ownerId.name || 'N/A'}
                            </p>
                            {farm.ownerId.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <EnvelopeIcon className="h-4 w-4" />
                                <span>{farm.ownerId.email}</span>
                              </div>
                            )}
                            {farm.ownerId.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <PhoneIcon className="h-4 w-4" />
                                <span>{farm.ownerId.phone}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Certifications */}
                        {farm.certifications && farm.certifications.length > 0 && (
                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-500 mb-2">Certifications</p>
                            <div className="flex flex-wrap gap-2">
                              {farm.certifications.map((cert, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                                >
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* View on Map Button */}
                        <button
                          onClick={() => {
                            setSelectedFarm(farm);
                            setViewMode('map');
                          }}
                          className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                          <MapPinIcon className="h-5 w-5" />
                          View on Map
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
    </div>
  );
};

export default FarmDiscovery;
