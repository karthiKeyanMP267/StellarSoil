import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', variant = 'default' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  if (variant === 'farm') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses[size]} relative`}
          >
            <div className="absolute inset-0 rounded-full border-4 border-beige-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-beige-500 border-r-beige-500"></div>
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: [-5, 5, -5],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 flex items-center justify-center text-2xl"
          >
            🌾
          </motion.div>
        </div>
        
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`${textSizes[size]} text-beige-700 font-medium`}
        >
          {message}
        </motion.p>
      </div>
    );
  }

  if (variant === 'organic') {
    return (
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses[size]} border-4 border-sage-200 rounded-full`}
          >
            <div className="absolute inset-0 border-4 border-transparent border-t-sage-500 rounded-full"></div>
          </motion.div>
          
          {/* Inner ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-3 border-cream-200 rounded-full"
          >
            <div className="absolute inset-0 border-3 border-transparent border-b-cream-500 rounded-full"></div>
          </motion.div>
          
          {/* Center icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 flex items-center justify-center text-xl"
          >
            🌱
          </motion.div>
        </div>
        
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-center"
        >
          <p className={`${textSizes[size]} text-sage-700 font-semibold`}>
            {message}
          </p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 bg-sage-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className={`${sizeClasses[size]} bg-gradient-to-r from-beige-400 to-cream-400 rounded-full flex items-center justify-center shadow-glow-beige`}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-white text-2xl"
            >
              ✨
            </motion.div>
          </motion.div>
          
          {/* Ripple effect */}
          <motion.div
            animate={{ 
              scale: [1, 2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeOut" 
            }}
            className={`absolute inset-0 ${sizeClasses[size]} border-2 border-beige-400 rounded-full`}
          />
        </div>
        
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className={`${textSizes[size]} text-beige-700 font-medium`}
        >
          {message}
        </motion.p>
      </div>
    );
  }

  // Default spinner
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} border-4 border-beige-200 border-t-beige-500 rounded-full`}
      />
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={`${textSizes[size]} text-beige-700 font-medium`}
      >
        {message}
      </motion.p>
    </div>
  );
};

const PageLoader = ({ message = 'Loading your fresh experience...' }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Main logo animation */}
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="text-8xl mb-4"
            >
              🌾
            </motion.div>
            
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, Math.sin(i) * 30, 0],
                  y: [0, Math.cos(i) * 20, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute text-2xl"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${20 + i * 10}%`
                }}
              >
                {['🌱', '🥕', '🍃', '🌽', '🍅', '🥬'][i]}
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-beige-700 via-earth-600 to-sage-700 mb-4"
        >
          StellarSoil
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl text-beige-600 mb-8"
        >
          {message}
        </motion.p>
        
        <LoadingSpinner size="large" variant="organic" message="" />
      </div>
    </div>
  );
};

const InlineLoader = ({ size = 'small', className = '' }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`inline-block border-2 border-beige-200 border-t-beige-500 rounded-full ${
        size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-6 h-6' : 'w-8 h-8'
      } ${className}`}
    />
  );
};

const SkeletonLoader = ({ className = '', lines = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        {[...Array(lines)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="rounded-full bg-beige-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-beige-200 rounded w-3/4"></div>
              <div className="h-4 bg-beige-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-white rounded-2xl shadow-soft p-6 ${className}`}>
      <div className="space-y-4">
        <div className="h-48 bg-beige-200 rounded-xl"></div>
        <div className="space-y-2">
          <div className="h-4 bg-beige-200 rounded w-3/4"></div>
          <div className="h-4 bg-beige-200 rounded w-1/2"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-beige-200 rounded w-16"></div>
          <div className="h-8 bg-beige-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export { 
  LoadingSpinner, 
  PageLoader, 
  InlineLoader, 
  SkeletonLoader, 
  CardSkeleton 
};
