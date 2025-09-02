import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const Notification = ({ 
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  position = 'top-right',
  onRemove,
  actions = [],
  progress = true,
  ...props 
}) => {
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [isPaused, setIsPaused] = React.useState(false);
  
  const types = {
    success: {
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      progressColor: 'bg-green-500'
    },
    error: {
      icon: XCircleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      progressColor: 'bg-red-500'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      progressColor: 'bg-orange-500'
    },
    info: {
      icon: InformationCircleIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      progressColor: 'bg-blue-500'
    }
  };
  
  const Icon = types[type].icon;
  
  React.useEffect(() => {
    if (duration && !isPaused) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 100) {
            onRemove(id);
            return 0;
          }
          return prev - 100;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [duration, isPaused, id, onRemove]);
  
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };
  
  const animations = {
    'top-left': {
      initial: { x: -300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -300, opacity: 0 }
    },
    'top-right': {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 300, opacity: 0 }
    },
    'top-center': {
      initial: { y: -100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -100, opacity: 0 }
    },
    'bottom-left': {
      initial: { x: -300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -300, opacity: 0 }
    },
    'bottom-right': {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 300, opacity: 0 }
    },
    'bottom-center': {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 }
    }
  };
  
  return (
    <motion.div
      layout
      initial={animations[position].initial}
      animate={animations[position].animate}
      exit={animations[position].exit}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed z-50 ${positionClasses[position]} max-w-sm w-full`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className={`${types[type].bgColor} ${types[type].borderColor} border rounded-xl shadow-lg overflow-hidden backdrop-blur-sm`}>
        {/* Progress Bar */}
        {progress && duration && (
          <div className="h-1 bg-gray-200">
            <motion.div
              className={types[type].progressColor}
              initial={{ width: '100%' }}
              animate={{ 
                width: isPaused ? `${(timeLeft / duration) * 100}%` : '0%' 
              }}
              transition={{ 
                duration: isPaused ? 0 : timeLeft / 1000, 
                ease: "linear" 
              }}
              style={{ height: '100%' }}
            />
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-start">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="flex-shrink-0"
            >
              <Icon className={`h-6 w-6 ${types[type].color}`} />
            </motion.div>
            
            {/* Content */}
            <div className="ml-3 flex-1">
              {title && (
                <motion.h4
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-sm font-semibold ${types[type].color}`}
                >
                  {title}
                </motion.h4>
              )}
              
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-sm text-gray-700 ${title ? 'mt-1' : ''}`}
                >
                  {message}
                </motion.p>
              )}
              
              {/* Actions */}
              {actions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-3 flex space-x-2"
                >
                  {actions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        action.onClick();
                        if (action.closeOnClick !== false) {
                          onRemove(id);
                        }
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        action.primary
                          ? `${types[type].color} bg-white border border-current hover:bg-opacity-10`
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
            
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(id)}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const NotificationProvider = ({ children, maxNotifications = 5 }) => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      duration: 5000,
      position: 'top-right',
      ...notification
    };
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Keep only the most recent notifications
      return updated.slice(0, maxNotifications);
    });
    
    return id;
  }, [maxNotifications]);
  
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Convenience methods
  const success = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'success', title, message, ...options });
  }, [addNotification]);
  
  const error = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'error', title, message, duration: 8000, ...options });
  }, [addNotification]);
  
  const warning = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'warning', title, message, duration: 6000, ...options });
  }, [addNotification]);
  
  const info = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'info', title, message, ...options });
  }, [addNotification]);
  
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info
  };
  
  // Group notifications by position
  const notificationGroups = notifications.reduce((groups, notification) => {
    const position = notification.position || 'top-right';
    if (!groups[position]) {
      groups[position] = [];
    }
    groups[position].push(notification);
    return groups;
  }, {});
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render notification groups */}
      {Object.entries(notificationGroups).map(([position, positionNotifications]) => (
        <div key={position} className="fixed z-50 pointer-events-none">
          <AnimatePresence mode="popLayout">
            {positionNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className="pointer-events-auto"
                style={{
                  marginBottom: index > 0 ? '12px' : '0'
                }}
              >
                <Notification
                  {...notification}
                  onRemove={removeNotification}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </NotificationContext.Provider>
  );
};

// Toast component for simple usage
export const Toast = ({ 
  type = 'info', 
  title, 
  message, 
  isVisible = true, 
  onClose,
  duration = 3000,
  ...props 
}) => {
  const [visible, setVisible] = React.useState(isVisible);
  
  React.useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  if (!visible) return null;
  
  const types = {
    success: {
      icon: '✅',
      bgColor: 'bg-green-500',
      textColor: 'text-white'
    },
    error: {
      icon: '❌',
      bgColor: 'bg-red-500',
      textColor: 'text-white'
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-orange-500',
      textColor: 'text-white'
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-blue-500',
      textColor: 'text-white'
    }
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${types[type].bgColor} ${types[type].textColor} rounded-full px-6 py-3 shadow-lg backdrop-blur-sm`}
          {...props}
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">{types[type].icon}</span>
            {title && <span className="font-semibold">{title}</span>}
            {message && <span>{message}</span>}
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="ml-2 hover:bg-white/20 rounded-full p-1"
              >
                <XMarkIcon className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Alert component for inline notifications
export const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  dismissible = false,
  onDismiss,
  className = '',
  ...props 
}) => {
  const [visible, setVisible] = React.useState(true);
  
  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) {
      setTimeout(onDismiss, 300);
    }
  };
  
  const types = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      iconColor: 'text-orange-500'
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  };
  
  const Icon = types[type].icon;
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={`${types[type].bgColor} ${types[type].borderColor} border rounded-xl p-4 ${className}`}
          {...props}
        >
          <div className="flex items-start">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="flex-shrink-0"
            >
              <Icon className={`h-5 w-5 ${types[type].iconColor}`} />
            </motion.div>
            
            <div className="ml-3 flex-1">
              {title && (
                <motion.h4
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-sm font-semibold ${types[type].textColor}`}
                >
                  {title}
                </motion.h4>
              )}
              
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-sm ${types[type].textColor} ${title ? 'mt-1' : ''}`}
                >
                  {message}
                </motion.p>
              )}
            </div>
            
            {dismissible && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDismiss}
                className={`flex-shrink-0 ml-2 ${types[type].iconColor} hover:opacity-75 transition-opacity`}
              >
                <XMarkIcon className="h-5 w-5" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
