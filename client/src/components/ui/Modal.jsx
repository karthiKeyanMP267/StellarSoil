import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  description,
  size = 'medium',
  variant = 'default',
  animation = 'scale',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = '',
  ...props 
}) => {
  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-7xl'
  };
  
  const variants = {
    default: 'bg-white shadow-2xl',
    glass: 'bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20',
    gradient: 'bg-gradient-to-br from-white via-beige-25 to-cream-25 shadow-2xl',
    beige: 'bg-gradient-to-br from-beige-50 to-cream-50 shadow-2xl border border-beige-200',
    minimal: 'bg-white shadow-xl border border-beige-100'
  };
  
  const animations = {
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 }
    },
    slideUp: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 50, opacity: 0 }
    },
    slideDown: {
      initial: { y: -50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -50, opacity: 0 }
    },
    slideLeft: {
      initial: { x: 50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 50, opacity: 0 }
    },
    slideRight: {
      initial: { x: -50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -50, opacity: 0 }
    },
    zoom: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 }
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog 
          as={motion.div}
          open={isOpen} 
          onClose={closeOnOverlayClick ? onClose : () => {}}
          className="relative z-50"
          {...props}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={animations[animation].initial}
              animate={animations[animation].animate}
              exit={animations[animation].exit}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`w-full ${sizes[size]} ${variants[variant]} rounded-2xl p-0 overflow-hidden ${className}`}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 pb-4">
                  <div>
                    {title && (
                      <Dialog.Title className="text-2xl font-bold text-beige-800">
                        {title}
                      </Dialog.Title>
                    )}
                    {description && (
                      <Dialog.Description className="text-beige-600 mt-1">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                  
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-beige-100 text-beige-600 hover:bg-beige-200 hover:text-beige-800 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className={`${(title || showCloseButton) ? 'px-6 pb-6' : 'p-6'}`}>
                {children}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'danger',
  isLoading = false,
  ...props 
}) => {
  const variants = {
    danger: {
      confirmButton: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      icon: '⚠️'
    },
    warning: {
      confirmButton: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      icon: '⚡'
    },
    success: {
      confirmButton: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      icon: '✅'
    },
    info: {
      confirmButton: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      icon: 'ℹ️'
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      variant="glass"
      animation="scale"
      {...props}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="mx-auto w-16 h-16 bg-gradient-to-r from-beige-400 to-cream-400 rounded-full flex items-center justify-center text-2xl mb-6"
        >
          {variants[variant].icon}
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-beige-800 mb-4"
        >
          {title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-beige-600 mb-8"
        >
          {message}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-beige-100 text-beige-700 rounded-xl font-semibold hover:bg-beige-200 transition-colors"
            disabled={isLoading}
          >
            {cancelText}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-colors ${variants[variant].confirmButton} disabled:opacity-50`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Loading...
              </div>
            ) : (
              confirmText
            )}
          </motion.button>
        </motion.div>
      </div>
    </Modal>
  );
};

const ImageModal = ({ 
  isOpen, 
  onClose, 
  images = [], 
  currentIndex = 0,
  onIndexChange,
  title,
  description,
  ...props 
}) => {
  const [index, setIndex] = React.useState(currentIndex);
  
  const nextImage = () => {
    const newIndex = (index + 1) % images.length;
    setIndex(newIndex);
    if (onIndexChange) onIndexChange(newIndex);
  };
  
  const prevImage = () => {
    const newIndex = (index - 1 + images.length) % images.length;
    setIndex(newIndex);
    if (onIndexChange) onIndexChange(newIndex);
  };
  
  const currentImage = images[index];
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xlarge"
      variant="minimal"
      animation="zoom"
      className="bg-black/90"
      {...props}
    >
      <div className="relative">
        {currentImage && (
          <motion.img
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            src={currentImage.src || currentImage}
            alt={currentImage.alt || `Image ${index + 1}`}
            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
          />
        )}
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {index + 1} / {images.length}
          </div>
        )}
        
        {/* Image Info */}
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            {title && <h3 className="text-xl font-bold text-white mb-2">{title}</h3>}
            {description && <p className="text-gray-300">{description}</p>}
          </motion.div>
        )}
        
        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center space-x-2 mt-6 overflow-x-auto pb-2"
          >
            {images.map((image, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIndex(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === index ? 'border-white' : 'border-transparent'
                }`}
              >
                <img
                  src={image.src || image}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </Modal>
  );
};

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  type = 'info',
  title,
  message,
  autoClose = 5000,
  actions = [],
  ...props 
}) => {
  const [timeLeft, setTimeLeft] = React.useState(autoClose / 1000);
  
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, autoClose, onClose]);
  
  const types = {
    success: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '✅'
    },
    error: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: '❌'
    },
    warning: {
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: '⚠️'
    },
    info: {
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: 'ℹ️'
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      variant="minimal"
      animation="slideDown"
      {...props}
    >
      <div className={`${types[type].bgColor} ${types[type].borderColor} border rounded-xl p-6`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 text-2xl mr-4">
            {types[type].icon}
          </div>
          
          <div className="flex-1">
            {title && (
              <h3 className={`text-lg font-semibold ${types[type].color} mb-2`}>
                {title}
              </h3>
            )}
            
            {message && (
              <p className="text-gray-700 mb-4">
                {message}
              </p>
            )}
            
            {actions.length > 0 && (
              <div className="flex space-x-3">
                {actions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.onClick}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      action.primary 
                        ? `${types[type].color} bg-white border border-current hover:bg-opacity-10`
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>
            )}
            
            {autoClose && timeLeft > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Auto-closing in {timeLeft}s</span>
                  <div className="w-24 bg-gray-200 rounded-full h-1">
                    <motion.div
                      className={`h-1 rounded-full ${types[type].color.replace('text-', 'bg-')}`}
                      initial={{ width: '100%' }}
                      animate={{ width: `${(timeLeft / (autoClose / 1000)) * 100}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export {
  Modal,
  ConfirmModal,
  ImageModal,
  NotificationModal
};
