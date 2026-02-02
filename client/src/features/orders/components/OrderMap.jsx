import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinIcon, HomeIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

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

// Custom icons
const createCustomIcon = (color, type = 'location') => {
  const svg = type === 'farm' 
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="40" height="40">
         <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
       </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="40" height="40">
         <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
       </svg>`;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const OrderMap = ({ 
  order, 
  viewMode = 'user', // 'user' or 'farmer'
  height = '400px',
  className = '' 
}) => {
  const [mapCenter, setMapCenter] = useState(null);
  const [farmLocation, setFarmLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  useEffect(() => {
    if (!order) return;

    // Extract farm location
    const farm = order.farm || order.items?.[0]?.product?.farm;
    if (farm?.location?.coordinates) {
      const [lng, lat] = farm.location.coordinates;
      setFarmLocation({ lat, lng, name: farm.name || 'Farm' });
    }

    // Extract delivery location from address
    if (order.deliveryAddress) {
      const addr = order.deliveryAddress;
      // Try to get coordinates from address
      // For now, we'll use a geocoding service or stored coordinates
      if (addr.coordinates && addr.coordinates.length === 2) {
        const [lng, lat] = addr.coordinates;
        setDeliveryLocation({ 
          lat, 
          lng, 
          address: `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''}`.trim() 
        });
      } else if (addr.lat && addr.lng) {
        setDeliveryLocation({ 
          lat: addr.lat, 
          lng: addr.lng, 
          address: `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''}`.trim() 
        });
      }
    }
  }, [order]);

  // Set map center based on view mode
  useEffect(() => {
    if (viewMode === 'farmer' && deliveryLocation) {
      setMapCenter(deliveryLocation);
    } else if (viewMode === 'user' && farmLocation) {
      setMapCenter(farmLocation);
    } else if (farmLocation) {
      setMapCenter(farmLocation);
    } else if (deliveryLocation) {
      setMapCenter(deliveryLocation);
    }
  }, [viewMode, farmLocation, deliveryLocation]);

  if (!order) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-xl`} style={{ height }}>
        <p className="text-gray-500">No order data available</p>
      </div>
    );
  }

  if (!mapCenter) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-xl`} style={{ height }}>
        <div className="text-center">
          <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Location information not available</p>
          <p className="text-sm text-gray-400 mt-1">
            {viewMode === 'farmer' 
              ? 'Customer delivery address not set' 
              : 'Farm location not available'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-xl overflow-hidden shadow-lg border border-gray-200`} style={{ height }}>
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Farm Marker */}
        {farmLocation && (
          <Marker 
            position={[farmLocation.lat, farmLocation.lng]}
            icon={createCustomIcon('#22C55E', 'farm')}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <BuildingStorefrontIcon className="h-5 w-5 text-green-600" />
                  <h3 className="font-bold text-lg">Farm Location</h3>
                </div>
                <p className="text-sm text-gray-700 mb-1">{farmLocation.name}</p>
                <p className="text-xs text-gray-500">
                  {viewMode === 'farmer' 
                    ? 'Your farm location' 
                    : 'Farm where your order was prepared'}
                </p>
                {order.farm?.address && (
                  <p className="text-xs text-gray-600 mt-2">{order.farm.address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Delivery Location Marker */}
        {deliveryLocation && (
          <Marker 
            position={[deliveryLocation.lat, deliveryLocation.lng]}
            icon={createCustomIcon('#3B82F6', 'home')}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <HomeIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-lg">Delivery Address</h3>
                </div>
                <p className="text-sm text-gray-700">{deliveryLocation.address}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {viewMode === 'farmer' 
                    ? 'Customer delivery location' 
                    : 'Your delivery address'}
                </p>
                {order.deliverySlot?.date && (
                  <div className="mt-2 text-xs">
                    <p className="text-gray-600">
                      <span className="font-medium">Delivery Slot:</span><br/>
                      {new Date(order.deliverySlot.date).toLocaleDateString()} 
                      {order.deliverySlot.timeSlot && ` (${order.deliverySlot.timeSlot})`}
                    </p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route line between farm and delivery location */}
        {farmLocation && deliveryLocation && (
          <Polyline
            positions={[
              [farmLocation.lat, farmLocation.lng],
              [deliveryLocation.lat, deliveryLocation.lng]
            ]}
            pathOptions={{
              color: '#F59E0B',
              weight: 3,
              opacity: 0.7,
              dashArray: '10, 10'
            }}
          />
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-xs z-[1000]">
        <div className="font-semibold mb-2 text-gray-700">Map Legend</div>
        <div className="space-y-1">
          {farmLocation && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Farm Location</span>
            </div>
          )}
          {deliveryLocation && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Delivery Address</span>
            </div>
          )}
          {farmLocation && deliveryLocation && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-amber-500 border-dashed border-t border-amber-500"></div>
              <span className="text-gray-600">Delivery Route</span>
            </div>
          )}
        </div>
        {order.orderStatus && (
          <div className="mt-2 pt-2 border-t">
            <span className="text-gray-600">Status: </span>
            <span className={`font-medium ${
              order.orderStatus === 'delivered' ? 'text-green-600' :
              order.orderStatus === 'out_for_delivery' ? 'text-blue-600' :
              order.orderStatus === 'cancelled' ? 'text-red-600' :
              'text-amber-600'
            }`}>
              {order.orderStatus.replace(/_/g, ' ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderMap;
