import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classNames } from '../utils/classNames';

const EnhancedButton = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  ripple = true,
  gradient = false,
  rounded = 'lg',
  className = '',
  onClick,
  ...props
}, ref) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    if (!ripple || disabled || loading) return;
    
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
    if (!disabled && !loading) {
      createRipple(event);
      onClick?.(event);
    }
  };

  // Base styles
  const baseStyles = `
    relative inline-flex items-center justify-center font-medium 
    transition-all duration-300 focus:outline-none overflow-hidden
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Size variants
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  // Color variants
  const variantStyles = {
    primary: gradient 
      ? 'bg-gradient-to-r from-sage-600 to-sage-700 text-white hover:from-sage-700 hover:to-sage-800 shadow-lg hover:shadow-xl'
      : 'bg-sage-600 text-white hover:bg-sage-700 shadow-sm hover:shadow-md',
    
    secondary: gradient
      ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
    
    outline: 'border-2 border-sage-600 text-sage-600 hover:bg-sage-600 hover:text-white bg-transparent',
    
    ghost: 'text-sage-600 hover:bg-sage-100 bg-transparent',
    
    danger: gradient
      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl'
      : 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md',
    
    success: gradient
      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl'
      : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md',
    
    warning: gradient
      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl'
      : 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm hover:shadow-md',
    
    link: 'text-sage-600 hover:text-sage-800 underline bg-transparent p-0 shadow-none'
  };

  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const buttonClasses = classNames(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    roundedStyles[rounded],
    className
  );

  return (
    <motion.button
      ref={ref}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: disabled || loading ? 1 : 0.98,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ 
        outline: 'none !important', 
        boxShadow: variant === 'link' ? 'none !important' : undefined
      }}
      tabIndex="-1"
      onFocus={(e) => {
        e.target.style.outline = 'none';
      }}
      {...props}
    >
      {/* Loading Spinner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button Content */}
      <motion.div
        className={`flex items-center justify-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'}`}
        transition={{ duration: 0.2 }}
      >
        {Icon && iconPosition === 'left' && (
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className={`${size === 'xs' ? 'h-3 w-3' : size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : size === 'xl' ? 'h-7 w-7' : 'h-5 w-5'}`} />
          </motion.div>
        )}
        
        {children && <span>{children}</span>}
        
        {Icon && iconPosition === 'right' && (
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className={`${size === 'xs' ? 'h-3 w-3' : size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : size === 'xl' ? 'h-7 w-7' : 'h-5 w-5'}`} />
          </motion.div>
        )}
      </motion.div>

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
});

EnhancedButton.displayName = 'EnhancedButton';

// Icon Button variant
export const IconButton = ({ icon: Icon, tooltip, size = 'md', ...props }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className="relative">
      <EnhancedButton
        variant="ghost"
        className={`${sizeClasses[size]} rounded-full hover:bg-gray-100`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        {...props}
      >
        <Icon className={iconSizes[size]} />
      </EnhancedButton>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
          >
            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {tooltip}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Button Group
export const ButtonGroup = ({ children, spacing = 'sm', className = '' }) => {
  const spacingClasses = {
    none: 'space-x-0',
    sm: 'space-x-2',
    md: 'space-x-3',
    lg: 'space-x-4'
  };

  return (
    <div className={`flex items-center ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};

export default EnhancedButton;
