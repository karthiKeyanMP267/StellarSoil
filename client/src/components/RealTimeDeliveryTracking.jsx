import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CameraIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const RealTimeDeliveryTracking = ({ orderId }) => {
  const [deliveryData, setDeliveryData] = useState({});
  const [currentStatus, setCurrentStatus] = useState('confirmed');
  const [driverLocation, setDriverLocation] = useState({ lat: 0, lng: 0 });
  const [estimatedTime, setEstimatedTime] = useState(45);
  const [loading, setLoading] = useState(true);
  const [showDriverInfo, setShowDriverInfo] = useState(false);

  useEffect(() => {
    loadDeliveryData();
    
    // Simulate real-time updates - using separate intervals with staggered timing
    // to prevent simultaneous heavy operations
    const statusInterval = setInterval(updateDeliveryStatus, 30000); // 30 seconds
    const locationInterval = setInterval(updateDriverLocation, 31000); // 31 seconds
    const timeInterval = setInterval(updateEstimatedTime, 32000); // 32 seconds

    return () => {
      clearInterval(statusInterval);
      clearInterval(locationInterval);
      clearInterval(timeInterval);
    };
  }, [orderId]);

  const loadDeliveryData = () => {
    // Simulate delivery data loading
    const mockDeliveryData = {
      orderId: orderId || 'ORD-12345',
      customerName: 'John Doe',
      deliveryAddress: '123 Oak Street, Green Valley, CA 90210',
      orderItems: [
        { name: 'Organic Rainbow Carrots', quantity: 2, farmer: 'Sunset Valley Farm' },
        { name: 'Fresh Basil Bundle', quantity: 1, farmer: 'Herb Haven' },
        { name: 'Heirloom Tomatoes', quantity: 3, farmer: 'Garden of Eden' }
      ],
      driver: {
        name: 'Mike Rodriguez',
        phone: '+1 (555) 123-4567',
        rating: 4.9,
        photo: '👨‍🚚',
        vehicle: 'Green Delivery Van - ECO123'
      },
      timeline: [
        {
          status: 'confirmed',
          title: 'Order Confirmed',
          description: 'Your order has been confirmed and is being prepared',
          timestamp: '2024-08-29T09:00:00Z',
          completed: true
        },
        {
          status: 'preparing',
          title: 'Preparing Your Order',
          description: 'Farmers are carefully packing your fresh produce',
          timestamp: '2024-08-29T09:30:00Z',
          completed: true
        },
        {
          status: 'picked_up',
          title: 'Picked Up',
          description: 'Your order has been collected from the farms',
          timestamp: '2024-08-29T11:00:00Z',
          completed: true
        },
        {
          status: 'in_transit',
          title: 'On the Way',
          description: 'Mike is delivering your fresh produce',
          timestamp: '2024-08-29T11:30:00Z',
          completed: true
        },
        {
          status: 'nearby',
          title: 'Nearby',
          description: 'Driver is approaching your location',
          timestamp: null,
          completed: false
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Order successfully delivered',
          timestamp: null,
          completed: false
        }
      ]
    };

    setDeliveryData(mockDeliveryData);
    setCurrentStatus('in_transit');
    setDriverLocation({ lat: 34.0522, lng: -118.2437 }); // LA coordinates
    setLoading(false);
  };

  const updateDeliveryStatus = () => {
    const statuses = ['confirmed', 'preparing', 'picked_up', 'in_transit', 'nearby', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (currentIndex < statuses.length - 1 && Math.random() > 0.7) {
      const nextStatus = statuses[currentIndex + 1];
      setCurrentStatus(nextStatus);
      
      // Update timeline
      setDeliveryData(prev => ({
        ...prev,
        timeline: prev.timeline.map(item => 
          item.status === nextStatus 
            ? { ...item, completed: true, timestamp: new Date().toISOString() }
            : item
        )
      }));
    }
  };

  const updateDriverLocation = () => {
    // Simulate driver movement (random small changes)
    setDriverLocation(prev => ({
      lat: prev.lat + (Math.random() - 0.5) * 0.01,
      lng: prev.lng + (Math.random() - 0.5) * 0.01
    }));
  };

  const updateEstimatedTime = () => {
    if (currentStatus === 'delivered') {
      setEstimatedTime(0);
    } else if (estimatedTime > 0) {
      setEstimatedTime(prev => Math.max(0, prev - Math.floor(Math.random() * 5) - 1));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-blue-500',
      preparing: 'bg-yellow-500',
      picked_up: 'bg-orange-500',
      in_transit: 'bg-purple-500',
      nearby: 'bg-green-500',
      delivered: 'bg-emerald-600'
    };
    return colors[status] || 'bg-gray-400';
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: CheckCircleIcon,
      preparing: ClockIcon,
      picked_up: TruckIcon,
      in_transit: TruckIcon,
      nearby: MapPinIcon,
      delivered: CheckCircleIcon
    };
    return icons[status] || ClockIcon;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleCallDriver = () => {
    // Simulate call functionality
    alert(`Calling ${deliveryData.driver?.name} at ${deliveryData.driver?.phone}`);
  };

  const handleChatDriver = () => {
    // Simulate chat functionality
    alert('Opening chat with driver...');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-beige-200"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-beige-200 rounded w-1/2"></div>
          <div className="h-4 bg-beige-100 rounded w-3/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-beige-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-beige-200/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg"
          >
            <TruckIcon className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-earth-700">Live Delivery Tracking</h2>
            <p className="text-beige-600 font-medium">Order #{deliveryData.orderId}</p>
          </div>
        </div>
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200"
        >
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 font-semibold">Live Tracking</span>
        </motion.div>
      </div>

      {/* Estimated Time */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 mb-8"
      >
        <div className="text-center">
          <div className="text-4xl font-black text-blue-700 mb-2">
            {estimatedTime > 0 ? `${estimatedTime} min` : 'Delivered!'}
          </div>
          <p className="text-blue-600 font-medium">
            {estimatedTime > 0 ? 'Estimated delivery time' : 'Your order has been delivered'}
          </p>
          {estimatedTime > 0 && (
            <p className="text-blue-500 text-sm mt-2">
              Delivering to: {deliveryData.deliveryAddress}
            </p>
          )}
        </div>
      </motion.div>

      {/* Driver Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200 mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{deliveryData.driver?.photo}</div>
            <div>
              <h3 className="text-lg font-bold text-earth-700">{deliveryData.driver?.name}</h3>
              <p className="text-beige-600 text-sm">{deliveryData.driver?.vehicle}</p>
              <div className="flex items-center space-x-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.floor(deliveryData.driver?.rating || 0) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-beige-600 ml-1">
                  {deliveryData.driver?.rating}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCallDriver}
              className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              <PhoneIcon className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChatDriver}
              className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200 mb-8"
      >
        <h3 className="text-lg font-bold text-earth-700 mb-4">Your Order</h3>
        <div className="space-y-3">
          {deliveryData.orderItems?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center justify-between p-3 bg-beige-50 rounded-xl"
            >
              <div>
                <p className="font-semibold text-earth-700">{item.name}</p>
                <p className="text-beige-600 text-sm">from {item.farmer}</p>
              </div>
              <span className="text-beige-700 font-medium">×{item.quantity}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Delivery Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200"
      >
        <h3 className="text-lg font-bold text-earth-700 mb-6">Delivery Progress</h3>
        
        <div className="space-y-6">
          {deliveryData.timeline?.map((step, index) => {
            const Icon = getStatusIcon(step.status);
            const isActive = step.status === currentStatus;
            const isCompleted = step.completed;
            
            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`flex items-center space-x-4 ${
                  isActive ? 'scale-105' : ''
                } transition-all duration-300`}
              >
                <div className={`relative p-3 rounded-2xl ${
                  isCompleted 
                    ? getStatusColor(step.status) 
                    : isActive 
                      ? 'bg-blue-500 animate-pulse' 
                      : 'bg-gray-300'
                } text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                  
                  {isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-blue-400 rounded-2xl opacity-30"
                    />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold ${
                      isCompleted || isActive ? 'text-earth-700' : 'text-beige-500'
                    }`}>
                      {step.title}
                    </h4>
                    {step.timestamp && (
                      <span className="text-sm text-beige-500">
                        {formatTime(step.timestamp)}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    isCompleted || isActive ? 'text-beige-600' : 'text-beige-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
                
                {isCompleted && (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-2xl border border-green-200"
      >
        <div className="text-center">
          <MapPinIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-green-800 mb-2">Live Map View</h3>
          <p className="text-green-600 mb-4">
            Track your driver's location in real-time
          </p>
          <div className="bg-white/60 rounded-xl p-4">
            <p className="text-sm text-green-700">
              📍 Current location: {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}
            </p>
            <p className="text-xs text-green-600 mt-2">
              * Map integration coming soon - Google Maps/OpenStreetMap
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex flex-col sm:flex-row gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          <BellIcon className="h-5 w-5 inline mr-2" />
          Get Notifications
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          <CameraIcon className="h-5 w-5 inline mr-2" />
          Delivery Proof
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default RealTimeDeliveryTracking;
