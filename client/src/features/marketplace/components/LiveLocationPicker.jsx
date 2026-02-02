import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { MapPinIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Fix marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker icon
const createLocationIcon = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F59E0B" width="40" height="40">
    <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
  </svg>`;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect, readOnly }) => {
  useMapEvents({
    click: (e) => {
      if (!readOnly) {
        onLocationSelect(e.latlng);
      }
    },
  });
  return null;
};

const LiveLocationPicker = ({ onLocationSelect, initialLocation, className = '', readOnly = false }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [address, setAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Fetch initial address if in read-only mode
  useEffect(() => {
    if (readOnly && initialLocation) {
      setSelectedLocation(initialLocation);
      fetchAddress(initialLocation.lat, initialLocation.lng);
    }
  }, [readOnly, initialLocation]);

  // Default center (India center)
  const defaultCenter = { lat: 20.5937, lng: 78.9629 };
  const mapCenter = selectedLocation || currentLocation || defaultCenter;

  // Get current location
  const getCurrentLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          setSelectedLocation(location);
          onLocationSelect?.(location);
          fetchAddress(location.lat, location.lng);
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please select manually on the map.');
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
    }
  };

  // Fetch address from coordinates using reverse geocoding
  const fetchAddress = async (lat, lng) => {
    setLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Handle map click to select location
  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng);
    onLocationSelect?.(latlng);
    fetchAddress(latlng.lat, latlng.lng);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 ${className}`}
    >
      {/* Header */}
      {!readOnly && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-amber-600" />
            <h4 className="text-sm font-medium text-amber-800">Select Location on Map</h4>
          </div>
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={loadingLocation}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingLocation ? (
              <>
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                <span className="text-sm">Getting Location...</span>
              </>
            ) : (
              <>
                <MapPinIcon className="h-4 w-4" />
                <span className="text-sm">Use My Location</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Map Container */}
      <div className={`relative rounded-xl overflow-hidden shadow-lg ${readOnly ? 'border-2 border-blue-300' : 'border-2 border-amber-200'}`}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={selectedLocation ? 15 : 5}
          style={{ height: '400px', width: '100%' }}
          scrollWheelZoom={!readOnly}
          dragging={!readOnly}
          doubleClickZoom={!readOnly}
          zoomControl={!readOnly}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onLocationSelect={handleLocationSelect} readOnly={readOnly} />
          
          {selectedLocation && (
            <Marker 
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={createLocationIcon()}
            />
          )}
        </MapContainer>
        
        {/* Read-only overlay badge */}
        {readOnly && (
          <div className="absolute top-4 right-4 z-[1000] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <p className="text-xs font-semibold flex items-center space-x-2">
              <MapPinIcon className="h-4 w-4" />
              <span>Farm Pickup Location</span>
            </p>
          </div>
        )}
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 rounded-xl border border-green-200"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-800">Location Selected</p>
              <p className="text-xs text-green-700 mt-1 font-mono">
                Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
              </p>
              {loadingAddress ? (
                <p className="text-xs text-green-600 mt-1">Loading address...</p>
              ) : address ? (
                <p className="text-sm text-green-700 mt-2">{address}</p>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {!readOnly && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Tip:</span> Click anywhere on the map to select your delivery location, 
            or use the "Use My Location" button to automatically detect your current position.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default LiveLocationPicker;
