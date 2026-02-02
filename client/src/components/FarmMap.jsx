import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Custom marker icons for different certification levels
const createCustomIcon = (certificationScore) => {
  const color = certificationScore >= 35 ? '#EAB308' : // gold
                certificationScore >= 20 ? '#22C55E' : // green
                certificationScore >= 10 ? '#3B82F6' : // blue
                '#6B7280'; // gray
  
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

// Component to recenter map when location changes
const RecenterMap = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  
  return null;
};

const FarmMap = ({ 
  farms = [], 
  userLocation, 
  radius = 10000, 
  onFarmClick,
  selectedFarm 
}) => {
  const center = userLocation ? [userLocation.lat, userLocation.lng] : [11.0168, 76.9558];
  
  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterMap center={userLocation} />
        
        {/* User Location Marker */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div className="text-center">
                  <strong className="text-blue-600">📍 Your Location</strong>
                </div>
              </Popup>
            </Marker>
            
            {/* Radius Circle */}
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={radius}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#93C5FD',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '10, 10'
              }}
            />
          </>
        )}
        
        {/* Farm Markers */}
        {farms.map((farm) => {
          const farmLocation = farm.farm?.location?.coordinates || farm.location?.coordinates;
          if (!farmLocation || farmLocation.length !== 2) return null;
          
          const [lng, lat] = farmLocation;
          const certScore = farm.farm?.certificationScore || farm.certificationScore || 0;
          const isSelected = selectedFarm?._id === (farm.farm?._id || farm._id);
          
          return (
            <Marker
              key={farm._id || farm.farm?._id}
              position={[lat, lng]}
              icon={createCustomIcon(certScore)}
              eventHandlers={{
                click: () => onFarmClick && onFarmClick(farm)
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-2">
                    {farm.farm?.name || farm.name || 'Farm'}
                  </h3>
                  
                  {/* Certification Badge */}
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs text-white ${
                      certScore >= 35 ? 'bg-yellow-500' :
                      certScore >= 20 ? 'bg-green-500' :
                      certScore >= 10 ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>
                      {certScore >= 35 ? '⭐ Premium' :
                       certScore >= 20 ? '✓ Certified' :
                       certScore >= 10 ? '✓ Verified' : 'Standard'} - Score: {certScore}
                    </span>
                  </div>
                  
                  {/* Distance */}
                  {(farm.distanceKm || farm.distance) && (
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {farm.distanceKm ? 
                        `${farm.distanceKm.toFixed(1)} km away` : 
                        `${(farm.distance / 1000).toFixed(1)} km away`}
                    </p>
                  )}
                  
                  {/* Final Score */}
                  {farm.finalScore !== undefined && (
                    <p className="text-sm font-semibold text-green-600 mb-2">
                      🏆 Ranking Score: {farm.finalScore.toFixed(2)}
                    </p>
                  )}
                  
                  {/* Product Info (if available) */}
                  {farm.name && farm.pricing && (
                    <div className="border-t pt-2 mt-2">
                      <p className="font-medium">{farm.name}</p>
                      <p className="text-sm text-gray-600">
                        ₹{farm.pricing.displayPrice}/{farm.unit || 'kg'}
                      </p>
                      {farm.pricing.farmerPrice && (
                        <p className="text-xs text-gray-500">
                          Farmer: ₹{farm.pricing.farmerPrice}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Farm Owner (if available) */}
                  {(farm.farm?.ownerId?.name || farm.ownerId?.name) && (
                    <p className="text-xs text-gray-500 mt-1">
                      👨‍🌾 {farm.farm?.ownerId?.name || farm.ownerId?.name}
                    </p>
                  )}
                  
                  <button
                    onClick={() => onFarmClick && onFarmClick(farm)}
                    className="mt-2 w-full px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default FarmMap;
