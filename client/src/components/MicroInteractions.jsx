import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

// Animated Button with Ripple Effect
export const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '',
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (event) => {
    if (!disabled) {
      createRipple(event);
      onClick?.(event);
    }
  };

  const variants = {
    primary: 'bg-gradient-to-r from-sage-600 to-sage-700 text-white hover:from-sage-700 hover:to-sage-800',
    secondary: 'bg-white text-sage-600 border border-sage-300 hover:bg-sage-50',
    outline: 'border-2 border-sage-600 text-sage-600 hover:bg-sage-600 hover:text-white',
    ghost: 'text-sage-600 hover:bg-sage-100'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-lg font-medium transition-all duration-300 
        focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
      style={{ 
        outline: 'none !important', 
        boxShadow: 'none !important'
      }}
      tabIndex="-1"
      onFocus={(e) => {
        e.target.style.outline = 'none';
        e.target.style.boxShadow = 'none';
      }}
    >
      {children}
      
      {/* Ripple Effect */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            initial={{
              width: 0,
              height: 0,
              opacity: 1,
              x: ripple.x,
              y: ripple.y
            }}
            animate={{
              width: ripple.size,
              height: ripple.size,
              opacity: 0,
              x: ripple.x,
              y: ripple.y
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
};

// Floating Action Button with Tooltip
export const FloatingButton = ({ 
  icon: Icon, 
  tooltip, 
  onClick, 
  position = 'bottom-right',
  color = 'sage' 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-20 right-6',
    'top-left': 'fixed top-20 left-6'
  };

  const colors = {
    sage: 'bg-sage-600 hover:bg-sage-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700'
  };

  return (
    <motion.div
      className={`${positions[position]} z-50`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setShowTooltip(true)}
      onHoverEnd={() => setShowTooltip(false)}
    >
      <button
        onClick={onClick}
        className={`
          ${colors[color]} text-white p-4 rounded-full shadow-lg
          transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50
          hover:shadow-xl transform hover:-translate-y-1
        `}
        style={{ 
          outline: 'none !important', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.15) !important'
        }}
        tabIndex="-1"
        onFocus={(e) => {
          e.target.style.outline = 'none';
          e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        }}
      >
        <Icon className="h-6 w-6" />
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && tooltip && (
          <motion.div
            className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              {tooltip}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Animated Card with Hover Effects
export const AnimatedCard = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  ...props 
}) => {
  return (
    <motion.div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200/50 
        transition-all duration-300 overflow-hidden
        ${gradient ? 'bg-gradient-to-br from-white to-gray-50/50' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        y: -5, 
        shadow: '0 20px 40px rgba(0,0,0,0.1)',
        transition: { duration: 0.3 }
      } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Progressive Loading Dots
export const LoadingDots = ({ size = 'md', color = 'sage' }) => {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colors = {
    sage: 'bg-sage-600',
    blue: 'bg-blue-600',
    gray: 'bg-gray-600'
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizes[size]} ${colors[color]} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
};

// Animated Counter
export const AnimatedCounter = ({ 
  value, 
  duration = 2, 
  className = '',
  prefix = '',
  suffix = ''
}) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, Math.round);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = motionValue.start(value, { duration });
    return controls.stop;
  }, [motionValue, value, duration]);

  useEffect(() => {
    return rounded.onChange(setDisplayValue);
  }, [rounded]);

  return (
    <span className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// Animated Progress Bar
export const AnimatedProgress = ({ 
  value, 
  max = 100, 
  height = 'h-2',
  color = 'sage',
  showValue = false,
  animated = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    sage: 'bg-sage-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600'
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <motion.div
          className={`${colors[color]} ${height} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1.5 : 0, 
            ease: 'easeOut' 
          }}
        />
      </div>
      {showValue && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

// Bounce Animation Component
export const BounceIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay
    }}
  >
    {children}
  </motion.div>
);

// Slide Up Animation Component
export const SlideUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      duration: 0.6,
      ease: "easeOut",
      delay
    }}
  >
    {children}
  </motion.div>
);

// Stagger Container for Child Animations
export const StaggerContainer = ({ children, staggerDelay = 0.1 }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
  >
    {children}
  </motion.div>
);

// Stagger Item
export const StaggerItem = ({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
  >
    {children}
  </motion.div>
);

export default {
  AnimatedButton,
  FloatingButton,
  AnimatedCard,
  LoadingDots,
  AnimatedCounter,
  AnimatedProgress,
  BounceIn,
  SlideUp,
  StaggerContainer,
  StaggerItem
};
