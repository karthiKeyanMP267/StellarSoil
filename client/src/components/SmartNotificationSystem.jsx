import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  BellIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TruckIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  HeartIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';

const SmartNotificationSystem = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState('all');

  // Get user information from AuthContext
  const { user } = useAuth();
  
  useEffect(() => {
    loadNotifications();
    
    // Use setTimeout instead of setInterval for better performance
    // This creates a self-adjusting timer that waits for the previous operation to complete
    let timeoutId;
    
    const scheduleNextUpdate = () => {
      timeoutId = setTimeout(() => {
        // Only add notification in idle periods using requestIdleCallback if available
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            if (Math.random() > 0.7) { // 30% chance every 10 seconds
              addNewNotification();
            }
            scheduleNextUpdate();
          }, { timeout: 2000 });
        } else {
          // Fallback for browsers that don't support requestIdleCallback
          if (Math.random() > 0.7) { // 30% chance every 10 seconds
            addNewNotification();
          }
          scheduleNextUpdate();
        }
      }, 10000);
    };
    
    scheduleNextUpdate();

    return () => clearTimeout(timeoutId);
  }, []);

  const loadNotifications = () => {
    // Base notifications that all users can receive
    let mockNotifications = [
      {
        id: 2,
        type: 'promotion',
        title: 'Flash Sale Alert!',
        message: '🔥 50% OFF on all organic vegetables - Limited time only!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        priority: 'medium',
        actionUrl: '/marketplace?category=vegetables',
        icon: CurrencyDollarIcon,
        color: 'green',
        forRoles: ['user', 'farmer', 'admin'] // Everyone can see promotions
      },
      {
        id: 4,
        type: 'inventory',
        title: 'Back in Stock',
        message: 'Organic Rainbow Carrots from Sunset Valley Farm are now available!',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        read: true,
        priority: 'medium',
        actionUrl: '/marketplace/product/rainbow-carrots',
        icon: ShoppingBagIcon,
        color: 'orange',
        forRoles: ['user', 'admin'] // Only users and admins care about stock updates
      }
    ];
    
    // User-specific notifications
    const userNotifications = [
      {
        id: 1,
        type: 'order',
        title: 'Order Shipped',
        message: 'Your order #12345 has been shipped and will arrive tomorrow!',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        priority: 'high',
        actionUrl: '/orders/12345',
        icon: TruckIcon,
        color: 'blue',
        forRoles: ['user'] // Only buyers see this
      },
      {
        id: 3,
        type: 'health',
        title: 'Weekly Nutrition Goal Achieved',
        message: 'Congratulations! You\'ve met your vitamin C intake goal this week.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true,
        priority: 'low',
        actionUrl: '/dashboard?tab=nutrition',
        icon: HeartIcon,
        color: 'purple',
        forRoles: ['user'] // Only users see health tracking
      }
    ];
    
    // Farmer-specific notifications
    const farmerNotifications = [
      {
        id: 5,
        type: 'system',
        title: 'New AI Feature Available',
        message: 'Try our new Crop Health Monitoring feature for better farm management!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        priority: 'low',
        actionUrl: '/farmer?tab=health',
        icon: InformationCircleIcon,
        color: 'blue',
        forRoles: ['farmer'] // Only farmers see farm management features
      },
      {
        id: 6,
        type: 'order',
        title: 'New Order Received',
        message: 'You have received a new order for organic carrots',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        read: false,
        priority: 'high',
        actionUrl: '/farmer/orders',
        icon: ShoppingBagIcon,
        color: 'green',
        forRoles: ['farmer'] // Only farmers see incoming orders
      }
    ];
    
    // Filter notifications based on user role
    if (user && user.role) {
      if (user.role === 'farmer') {
        mockNotifications = [...mockNotifications, ...farmerNotifications];
      } else if (user.role === 'user') {
        mockNotifications = [...mockNotifications, ...userNotifications];
      } else if (user.role === 'admin') {
        // Admin can see everything for monitoring
        mockNotifications = [...mockNotifications, ...userNotifications, ...farmerNotifications];
      }
    } else {
      // If no user or role, show only general notifications
      mockNotifications = mockNotifications.filter(n => !n.forRoles || n.forRoles.includes('guest'));
    }

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  };

  const addNewNotification = () => {
    // Define role-specific notifications
    const userNotifications = [
      {
        type: 'promotion',
        title: 'Price Alert',
        message: 'Tomato prices have dropped by 15% - Great time to buy!',
        icon: CurrencyDollarIcon,
        color: 'green',
        priority: 'medium',
        actionUrl: '/marketplace?product=tomatoes',
        forRoles: ['user']
      },
      {
        type: 'inventory',
        title: 'Low Stock Alert',
        message: 'Only 3 items left of your favorite organic apples.',
        icon: ExclamationTriangleIcon,
        color: 'yellow',
        priority: 'medium',
        actionUrl: '/marketplace/product/organic-apples',
        forRoles: ['user']
      }
    ];
    
    const farmerNotifications = [
      {
        type: 'order',
        title: 'New Order Received',
        message: 'You have a new order from a local customer!',
        icon: ShoppingBagIcon,
        color: 'green',
        priority: 'high',
        actionUrl: '/farmer/orders',
        forRoles: ['farmer']
      },
      {
        type: 'inventory',
        title: 'Low Stock Alert',
        message: 'You have only 5 units of organic potatoes left. Consider restocking.',
        icon: ExclamationTriangleIcon,
        color: 'yellow',
        priority: 'medium',
        actionUrl: '/farmer/inventory',
        forRoles: ['farmer']
      }
    ];
    
    // Select notifications based on user role
    let availableNotifications = [];
    
    if (user && user.role) {
      if (user.role === 'farmer') {
        availableNotifications = farmerNotifications;
      } else if (user.role === 'user') {
        availableNotifications = userNotifications;
      } else if (user.role === 'admin') {
        // Admins can see all notification types
        availableNotifications = [...userNotifications, ...farmerNotifications];
      }
    } else {
      // Default to user notifications if no role defined
      availableNotifications = userNotifications.filter(n => !n.forRoles || n.forRoles.includes('guest'));
    }
    
    // Only continue if we have notifications appropriate for this user
    if (availableNotifications.length === 0) return;

    const randomNotification = availableNotifications[Math.floor(Math.random() * availableNotifications.length)];
    const newNotification = {
      id: Date.now(),
      ...randomNotification,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Play notification sound
    if (soundEnabled) {
      playNotificationSound();
    }

    // Show toast notification
    showToast(newNotification);
  };

  const playNotificationSound = () => {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const showToast = (notification) => {
    // This would integrate with a toast notification system
    console.log('Toast notification:', notification.title);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filter);
  };

  const getTypeColor = (type) => {
    const colors = {
      order: 'text-blue-600 bg-blue-100 border-blue-200',
      promotion: 'text-green-600 bg-green-100 border-green-200',
      health: 'text-purple-600 bg-purple-100 border-purple-200',
      inventory: 'text-orange-600 bg-orange-100 border-orange-200',
      system: 'text-gray-600 bg-gray-100 border-gray-200'
    };
    return colors[type] || colors.system;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-l-red-500',
      medium: 'border-l-yellow-500',
      low: 'border-l-green-500'
    };
    return colors[priority] || colors.low;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    if (diff < 60 * 1000) return 'Just now';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="floating-notification-btn relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300"
      >
        <BellIcon className="h-6 w-6" />
        
        {/* Unread Count Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-xs text-white font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Animation for New Notifications */}
        {unreadCount > 0 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-blue-400 rounded-2xl opacity-20"
          />
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-beige-200/50 z-50 max-h-[70vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-beige-200/50 bg-gradient-to-r from-beige-50 to-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-earth-700">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-2 hover:bg-beige-100 rounded-xl transition-colors"
                    >
                      {soundEnabled ? (
                        <SpeakerWaveIcon className="h-5 w-5 text-beige-600" />
                      ) : (
                        <SpeakerXMarkIcon className="h-5 w-5 text-beige-400" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-beige-100 rounded-xl transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5 text-beige-600" />
                    </motion.button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex space-x-2 overflow-x-auto">
                  {['all', 'unread', 'order', 'promotion', 'health', 'inventory'].map(filterOption => (
                    <motion.button
                      key={filterOption}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilter(filterOption)}
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        filter === filterOption
                          ? 'bg-blue-500 text-white'
                          : 'bg-beige-100 text-beige-600 hover:bg-beige-200'
                      }`}
                    >
                      {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                    </motion.button>
                  ))}
                </div>

                {/* Action Buttons */}
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={markAllAsRead}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all as read
                  </motion.button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {getFilteredNotifications().length === 0 ? (
                  <div className="p-8 text-center">
                    <BellIcon className="h-12 w-12 text-beige-300 mx-auto mb-4" />
                    <p className="text-beige-500">No notifications yet</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {getFilteredNotifications().map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 mb-2 rounded-2xl border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                          notification.read 
                            ? 'bg-white/60 border-beige-200' 
                            : 'bg-blue-50/80 border-blue-200'
                        } ${getPriorityColor(notification.priority)}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-xl ${getTypeColor(notification.type)}`}>
                            <notification.icon className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-semibold text-sm ${
                                notification.read ? 'text-beige-700' : 'text-earth-700'
                              }`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-beige-500">
                                {formatTime(notification.timestamp)}
                              </span>
                            </div>
                            
                            <p className={`text-sm leading-relaxed ${
                              notification.read ? 'text-beige-600' : 'text-beige-700'
                            }`}>
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between mt-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                                {notification.type}
                              </span>
                              
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <XMarkIcon className="h-4 w-4 text-red-500" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-beige-200/50 bg-gradient-to-r from-white to-beige-50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Notifications
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartNotificationSystem;
