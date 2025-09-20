import React, { useState, useEffect, useRef } from 'react';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
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

const LocationMap = ({ 
  farms = [], 
  userLocation = null, 
  onFarmSelect, 
  showUserLocation = true,
  height = '400px',
  className = ''
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userMarker, setUserMarker] = useState(null);
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
  const [isLoading, setIsLoading] = useState(true);
  const [userLocationError, setUserLocationError] = useState(null);

  // Initialize Google Maps with singleton loader
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        await loadGoogleMaps();
        if (cancelled || !mapRef.current || !window.google) return;
        const mapOptions = {
          zoom: 10,
          center: userLocation || { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
          styles: [
            { featureType: 'all', elementType: 'geometry.fill', stylers: [{ color: '#f5f1eb' }] },
            { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#c8e6c9' }] },
            { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#d4b896' }] }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true
        };
        const newMap = new window.google.maps.Map(mapRef.current, {
          ...mapOptions,
          // Optional vector mapId for Advanced Markers (set VITE_GOOGLE_MAPS_MAP_ID in .env)
          ...(import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ? { mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID } : {})
        });
        if (!cancelled) {
          setMap(newMap);
          setIsLoading(false);
        }
      } catch (e) {
        console.error('Google Maps load/init failed', e);
      }
    };
    init();
    return () => { cancelled = true; };
  }, [userLocation]);

  // Get user's current location
  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newUserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          if (map) {
            map.setCenter(newUserLocation);
            
            // Create user location marker using AdvancedMarkerElement when available
            try {
              const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');
              const el = document.createElement('div');
              el.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" width="24" height="24">
                  <circle cx="12" cy="12" r="8" fill="#3B82F6"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>`;
              const advMarker = new AdvancedMarkerElement({ map, position: newUserLocation, content: el, title: 'Your Location' });
              setUserMarker(advMarker);
            } catch (e) {
              // Fallback to classic Marker if AdvancedMarker not available
              const marker = new window.google.maps.Marker({ position: newUserLocation, map, title: 'Your Location' });
              setUserMarker(marker);
            }
          }
        },
        (error) => {
          setUserLocationError(error.message);
          console.error('Error getting location:', error);
        }
      );
    }
  }, [map, showUserLocation]);

  // Create farm markers
  useEffect(() => {
    if (!map || !filteredFarms.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap && marker.setMap(null));

    (async () => {
      try {
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');
        const created = filteredFarms.map((farm) => {
          const el = document.createElement('div');
          el.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EFCB73" width="32" height="32">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>`;
          const adv = new AdvancedMarkerElement({ map, position: { lat: farm.latitude, lng: farm.longitude }, content: el, title: farm.name });
          adv.addListener('gmp-click', () => {
            setSelectedFarm(farm);
            if (onFarmSelect) onFarmSelect(farm);
          });
          return adv;
        });
        setMarkers(created);
      } catch (e) {
        // Fallback to classic markers
        const created = filteredFarms.map((farm) => {
          const marker = new window.google.maps.Marker({ position: { lat: farm.latitude, lng: farm.longitude }, map, title: farm.name });
          marker.addListener('click', () => {
            setSelectedFarm(farm);
            if (onFarmSelect) onFarmSelect(farm);
          });
          return marker;
        });
        setMarkers(created);
      }
    })();
  }, [map, filteredFarms, onFarmSelect]);

  // Filter farms based on search and filters
  useEffect(() => {
    let filtered = farms.filter(farm => {
      // Search filter
      if (searchQuery && !farm.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !farm.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Organic filter
      if (filters.organic && !farm.isOrganic) return false;

      // Delivery filter  
      if (filters.delivery && !farm.hasDelivery) return false;

      // Open now filter
      if (filters.openNow && !farm.isOpen) return false;

      return true;
    });

    setFilteredFarms(filtered);
  }, [farms, searchQuery, filters]);

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
            src={farm.image || '/placeholder.jpg'}
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
            
            {userLocation && (
              <div className="flex items-center">
                <TruckIcon className="h-3 w-3 mr-1" />
                <span>
                  {calculateDistance(
                    userLocation.lat, 
                    userLocation.lng, 
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
          <>
            <div ref={mapRef} className="w-full h-full" />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-beige-50">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-beige-300 border-t-beige-600 rounded-full"
                />
              </div>
            )}
          </>
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
                  src={selectedFarm.image || '/placeholder.jpg'}
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

      {userLocationError && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm">
          Unable to get your location
        </div>
      )}
    </div>
  );
};

export default LocationMap;
