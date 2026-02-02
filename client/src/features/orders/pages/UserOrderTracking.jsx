import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../api/api';
import {
  MapPinIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  PhoneIcon,
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  HomeIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

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
const createFarmIcon = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10B981" width="50" height="50">
    <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
  </svg>`;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });
};

const createUserIcon = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" width="50" height="50">
    <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
  </svg>`;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });
};

const UserOrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [farmLocation, setFarmLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchOrderDetails, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await API.get(`/orders/${orderId}`);
      setOrder(data);
      
      // Extract locations
      if (data.farmId) {
        const farmData = await API.get(`/farms/${data.farmId}`);
        if (farmData.data.location && farmData.data.location.coordinates) {
          setFarmLocation({
            lat: farmData.data.location.coordinates[1],
            lng: farmData.data.location.coordinates[0],
            name: farmData.data.name,
            phone: farmData.data.contactPhone
          });
        }
      }
      
      // Extract user delivery location
      if (data.deliveryAddress) {
        if (data.deliveryAddress.coordinates) {
          setUserLocation({
            lat: data.deliveryAddress.coordinates.lat,
            lng: data.deliveryAddress.coordinates.lng,
            address: `${data.deliveryAddress.street}, ${data.deliveryAddress.city}, ${data.deliveryAddress.state}`
          });
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Could not load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'out_for_delivery':
      case 'ready':
        return <TruckIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      placed: 'Order Placed',
      confirmed: 'Confirmed',
      processing: 'Processing',
      ready: 'Ready for Pickup',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const orderStatuses = ['placed', 'confirmed', 'processing', 'ready', order?.deliveryType === 'delivery' ? 'out_for_delivery' : 'ready', 'delivered'];
  const currentStatusIndex = order ? orderStatuses.indexOf(order.orderStatus) : 0;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-6 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800">{error || 'Order not found'}</p>
            <button
              onClick={() => navigate('/orders')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mapCenter = farmLocation && userLocation
    ? { lat: (farmLocation.lat + userLocation.lat) / 2, lng: (farmLocation.lng + userLocation.lng) / 2 }
    : farmLocation || userLocation || { lat: 20.5937, lng: 78.9629 };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition mb-3 sm:mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Back to Orders</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Track Your Order</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Order #{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full border-2 ${getStatusColor(order.orderStatus)}`}>
              {getStatusIcon(order.orderStatus)}
              <span className="text-sm sm:text-base font-semibold">{getStatusText(order.orderStatus)}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content - Map and Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-orange-600">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-white rounded-lg">
                      <MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-bold text-white">Live Location Tracking</h2>
                      <p className="text-amber-100 text-xs sm:text-sm hidden sm:block">Track your order in real-time</p>
                    </div>
                  </div>
                  {['ready', 'out_for_delivery'].includes(order.orderStatus) && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex items-center space-x-2 bg-white/20 px-2 sm:px-3 py-1 rounded-full"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-xs sm:text-sm font-medium">Live</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="relative" style={{ height: '350px', minHeight: '350px' }}>
                <style>{`
                  @media (min-width: 640px) {
                    .map-container { height: 450px !important; }
                  }
                  @media (min-width: 768px) {
                    .map-container { height: 500px !important; }
                  }
                `}</style>
                {farmLocation || userLocation ? (
                  <div className="map-container h-full">
                    <MapContainer
                    center={[mapCenter.lat, mapCenter.lng]}
                    zoom={farmLocation && userLocation ? 12 : 14}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Farm Location */}
                    {farmLocation && (
                      <Marker
                        position={[farmLocation.lat, farmLocation.lng]}
                        icon={createFarmIcon()}
                      >
                        <Popup>
                          <div className="p-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <BuildingStorefrontIcon className="h-5 w-5 text-green-600" />
                              <strong className="text-green-800">Farm Location</strong>
                            </div>
                            <p className="text-sm font-medium">{farmLocation.name}</p>
                            {farmLocation.phone && (
                              <p className="text-xs text-gray-600 mt-1">{farmLocation.phone}</p>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    )}
                    
                    {/* User Delivery Location */}
                    {userLocation && (
                      <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={createUserIcon()}
                      >
                        <Popup>
                          <div className="p-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <HomeIcon className="h-5 w-5 text-blue-600" />
                              <strong className="text-blue-800">Your Location</strong>
                            </div>
                            <p className="text-sm">{userLocation.address}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                    
                    {/* Route Line */}
                    {farmLocation && userLocation && (
                      <Polyline
                        positions={[
                          [farmLocation.lat, farmLocation.lng],
                          [userLocation.lat, userLocation.lng]
                        ]}
                        color="#F59E0B"
                        weight={4}
                        opacity={0.7}
                        dashArray="10, 10"
                      />
                    )}
                  </MapContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <div className="text-center">
                      <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Location information not available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Legend */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  {farmLocation && (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Farm Location</span>
                    </div>
                  )}
                  {userLocation && (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Your Location</span>
                    </div>
                  )}
                  {farmLocation && userLocation && (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-0.5 bg-amber-500 border-dashed"></div>
                      <span className="text-gray-700">Route</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Order Status Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Progress</h3>
              
              <div className="space-y-4">
                {orderStatuses.filter(status => order.deliveryType === 'pickup' ? status !== 'out_for_delivery' : true).map((status, index) => {
                  const isCurrent = status === order.orderStatus;
                  const isPast = index < currentStatusIndex;
                  const isActive = isPast || isCurrent;
                  
                  return (
                    <div key={status} className="relative flex items-start">
                      {/* Timeline Line */}
                      {index < orderStatuses.length - 1 && (
                        <div className={`absolute left-4 top-10 w-0.5 h-full ${isActive ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                      )}
                      
                      {/* Status Dot */}
                      <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-amber-500' : 'bg-gray-300'
                      } ${isCurrent ? 'ring-4 ring-amber-200 animate-pulse' : ''}`}>
                        {isPast ? (
                          <CheckCircleIcon className="h-5 w-5 text-white" />
                        ) : (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      
                      {/* Status Info */}
                      <div className="ml-4 flex-1">
                        <h4 className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                          {getStatusText(status)}
                        </h4>
                        {isCurrent && (
                          <p className="text-sm text-amber-600 mt-1">Current Status</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Order Details */}
          <div className="space-y-6">
            {/* Order Ready Notification */}
            {order.orderStatus === 'ready' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white"
              >
                <div className="flex items-start space-x-3">
                  <BellAlertIcon className="h-8 w-8 flex-shrink-0 animate-bounce" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Order Ready!</h3>
                    <p className="text-green-100 text-sm">
                      {order.deliveryType === 'pickup' 
                        ? 'Your order is ready for pickup at the farm location shown on the map.'
                        : 'Your order is ready and will be out for delivery soon!'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Order Type</span>
                  <span className="font-medium">
                    {order.deliveryType === 'pickup' ? 'Farm Pickup' : 'Home Delivery'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium uppercase">{order.paymentMethod}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                
                {order.deliverySlot && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-start space-x-2">
                      <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.deliveryType === 'pickup' ? 'Pickup Time' : 'Delivery Time'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(order.deliverySlot.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        {order.deliverySlot.timeSlot && (
                          <p className="text-sm text-gray-600">{order.deliverySlot.timeSlot}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Contact Farm */}
            {farmLocation && farmLocation.phone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Farm</h3>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {farmLocation.name}
                  </p>
                  <a
                    href={`tel:${farmLocation.phone}`}
                    className="flex items-center space-x-3 w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                  >
                    <PhoneIcon className="h-5 w-5" />
                    <span className="font-medium">{farmLocation.phone}</span>
                  </a>
                </div>
              </motion.div>
            )}

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
              
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product?.name || 'Product'}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-amber-600">₹{order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderTracking;
