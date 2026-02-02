import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPinIcon, 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ViewColumnsIcon,
  MapIcon as MapIconOutline,
  ListBulletIcon,
  XMarkIcon,
  StarIcon,
  PhoneIcon,
  ClockIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { MapPinIcon as MapPinSolid } from '@heroicons/react/24/solid';

// Fix for default marker icons in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icon for farms
const createFarmIcon = (isOrganic) => {
  const color = isOrganic ? '#22C55E' : '#3B82F6';
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component to recenter map and fit bounds
const RecenterMap = ({ center, markers }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom(), {
        animate: true,
        duration: 0.5
      });
    }
  }, [center, map]);
  
  // Fit bounds to show all markers
  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = markers
        .filter(m => m.latitude && m.longitude)
        .map(m => [m.latitude, m.longitude]);
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
          animate: true
        });
      }
    }
  }, [markers, map]);
  
  return null;
};

const LocationMap = ({ 
  farms = [], 
  userLocation = null, 
  onFarmSelect, 
  showUserLocation = true,
  height = '400px',
  className = ''
}) => {
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [filteredFarms, setFilteredFarms] = useState(farms);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    organic: false,
    delivery: false,
    openNow: false,
    distance: 50 // km
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(userLocation);

  // Get user location if not provided
  useEffect(() => {
    if (!currentLocation && showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Delhi if location fails
          setCurrentLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    }
  }, [currentLocation, showUserLocation]);

  // Filter farms based on search and filters
  useEffect(() => {
    let filtered = farms.filter(farm => {
      // Search filter
      if (searchQuery && !farm.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !farm.location?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Organic filter
      if (filters.organic && !farm.isOrganic) return false;

      // Delivery filter  
      if (filters.delivery && !farm.hasDelivery) return false;

      // Open now filter
      if (filters.openNow && !farm.isOpen) return false;

      // Distance filter
      if (currentLocation && filters.distance) {
        const distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          farm.latitude || 0,
          farm.longitude || 0
        );
        if (distance > filters.distance) return false;
      }

      return true;
    });

    setFilteredFarms(filtered);
  }, [farms, searchQuery, filters, currentLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const FarmCard = ({ farm, isSelected = false }) => (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      onClick={() => {
        setSelectedFarm(farm);
        if (onFarmSelect) onFarmSelect(farm);
        if (map) {
          map.setCenter({ lat: farm.latitude, lng: farm.longitude });
          map.setZoom(15);
        }
      }}
      className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'bg-gradient-to-r from-beige-100 to-cream-100 border-2 border-beige-300 shadow-medium'
          : 'bg-white hover:bg-beige-50 border border-beige-200 shadow-soft hover:shadow-medium'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={farm.image || '/images/farm-generic.svg'}
            alt={farm.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          {farm.isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-beige-800 truncate">{farm.name}</h3>
          <div className="flex items-center text-sm text-beige-600 mt-1">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span className="truncate">{farm.location}</span>
          </div>
          
          <div className="flex items-center space-x-4 mt-2 text-xs text-beige-500">
            {farm.rating && (
              <div className="flex items-center">
                <StarIcon className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                <span>{farm.rating}</span>
              </div>
            )}
            
            {currentLocation && (
              <div className="flex items-center">
                <TruckIcon className="h-3 w-3 mr-1" />
                <span>
                  {calculateDistance(
                    currentLocation.lat, 
                    currentLocation.lng, 
                    farm.latitude, 
                    farm.longitude
                  ).toFixed(1)} km
                </span>
              </div>
            )}
            
            {farm.isOpen ? (
              <span className="text-green-600 font-medium">Open</span>
            ) : (
              <span className="text-red-600">Closed</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            {farm.isOrganic && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Organic
              </span>
            )}
            {farm.hasDelivery && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Delivery
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`relative bg-white rounded-2xl shadow-soft overflow-hidden ${className}`}>
      {/* Header Controls */}
      <div className="p-4 border-b border-beige-200 bg-gradient-to-r from-beige-50 to-cream-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-beige-800">Nearby Farms</h2>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-colors ${
                showFilters ? 'bg-beige-200 text-beige-800' : 'bg-white text-beige-600 hover:bg-beige-100'
              }`}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </motion.button>
            
            <div className="flex bg-white rounded-xl p-1 border border-beige-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'map' ? 'bg-beige-500 text-white' : 'text-beige-600 hover:bg-beige-50'
                }`}
              >
                <MapIconOutline className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-beige-500 text-white' : 'text-beige-600 hover:bg-beige-50'
                }`}
              >
                <ListBulletIcon className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-beige-400" />
          <input
            type="text"
            placeholder="Search farms by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-beige-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-beige-300 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white rounded-xl border border-beige-200"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.organic}
                    onChange={(e) => setFilters(prev => ({ ...prev, organic: e.target.checked }))}
                    className="rounded border-beige-300 text-beige-500 focus:ring-beige-300"
                  />
                  <span className="text-sm text-beige-700">Organic</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.delivery}
                    onChange={(e) => setFilters(prev => ({ ...prev, delivery: e.target.checked }))}
                    className="rounded border-beige-300 text-beige-500 focus:ring-beige-300"
                  />
                  <span className="text-sm text-beige-700">Delivery</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={(e) => setFilters(prev => ({ ...prev, openNow: e.target.checked }))}
                    className="rounded border-beige-300 text-beige-500 focus:ring-beige-300"
                  />
                  <span className="text-sm text-beige-700">Open Now</span>
                </label>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-beige-700">Distance:</span>
                  <select
                    value={filters.distance}
                    onChange={(e) => setFilters(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
                    className="text-sm border border-beige-300 rounded px-2 py-1"
                  >
                    <option value={10}>10 km</option>
                    <option value={25}>25 km</option>
                    <option value={50}>50 km</option>
                    <option value={100}>100 km</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map/List View */}
      <div style={{ height }} className="relative">
        {viewMode === 'map' ? (
          <div className="w-full h-full rounded-xl overflow-hidden shadow-md">
            {currentLocation ? (
              <MapContainer
                center={[currentLocation.lat, currentLocation.lng]}
                zoom={13}
                scrollWheelZoom={true}
                zoomControl={true}
                doubleClickZoom={true}
                touchZoom={true}
                dragging={true}
                keyboard={true}
                boxZoom={true}
                tap={true}
                zoomSnap={0.5}
                zoomDelta={0.5}
                wheelPxPerZoomLevel={120}
                style={{ height: '100%', width: '100%', minHeight: '400px' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  tileSize={256}
                  maxZoom={19}
                  minZoom={5}
                />
                
                <RecenterMap center={currentLocation} markers={filteredFarms} />
                
                {/* User Location Marker */}
                {showUserLocation && (
                  <Marker position={[currentLocation.lat, currentLocation.lng]}>
                    <Popup>
                      <div className="text-center">
                        <strong className="text-blue-600">📍 Your Location</strong>
                      </div>
                    </Popup>
                  </Marker>
                )}
                
                {/* Farm Markers */}
                {filteredFarms.map((farm) => {
                  if (!farm.latitude || !farm.longitude) return null;
                  
                  return (
                    <Marker
                      key={farm.id || farm._id}
                      position={[farm.latitude, farm.longitude]}
                      icon={createFarmIcon(farm.isOrganic)}
                      eventHandlers={{
                        click: () => {
                          setSelectedFarm(farm);
                          if (onFarmSelect) onFarmSelect(farm);
                        }
                      }}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <h3 className="font-bold text-lg mb-2">{farm.name}</h3>
                          
                          {farm.location && (
                            <p className="text-sm text-gray-600 mb-2">📍 {farm.location}</p>
                          )}
                          
                          {farm.rating && (
                            <div className="flex items-center mb-2">
                              <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm">{farm.rating}</span>
                            </div>
                          )}
                          
                          <div className="flex gap-2 mb-2">
                            {farm.isOrganic && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Organic
                              </span>
                            )}
                            {farm.hasDelivery && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Delivery
                              </span>
                            )}
                          </div>
                          
                          {farm.isOpen !== undefined && (
                            <p className={`text-sm font-medium ${farm.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                              {farm.isOpen ? 'Open Now' : 'Closed'}
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-beige-50">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-beige-300 border-t-beige-600 rounded-full"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {filteredFarms.map((farm) => (
                <FarmCard
                  key={farm.id}
                  farm={farm}
                  isSelected={selectedFarm?.id === farm.id}
                />
              ))}
            </AnimatePresence>
            
            {filteredFarms.length === 0 && (
              <div className="text-center py-12">
                <MapPinIcon className="h-12 w-12 text-beige-300 mx-auto mb-4" />
                <p className="text-beige-600">No farms found matching your criteria</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Farm Info */}
      <AnimatePresence>
        {selectedFarm && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-strong border border-beige-200 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedFarm.image || '/images/farm-generic.svg'}
                  alt={selectedFarm.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-beige-800">{selectedFarm.name}</h3>
                  <p className="text-sm text-beige-600">{selectedFarm.location}</p>
                  <div className="flex items-center space-x-3 mt-2 text-sm">
                    {selectedFarm.phone && (
                      <div className="flex items-center text-beige-600">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        <span>{selectedFarm.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-beige-600">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{selectedFarm.hours || '9 AM - 6 PM'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedFarm(null)}
                className="p-1 text-beige-400 hover:text-beige-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationMap;
