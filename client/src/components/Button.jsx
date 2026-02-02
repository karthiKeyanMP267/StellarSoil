import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { InlineLoader } from './Loading';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  animation = 'default',
  className = '',
  onClick,
  type = 'button',
  ...props 
}, ref) => {
  
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300";
  
  const variants = {
    primary: "bg-gradient-to-r from-beige-500 to-cream-500 text-white hover:from-beige-600 hover:to-cream-600 shadow-medium hover:shadow-strong",
    secondary: "border-2 border-beige-500 text-beige-700 bg-white hover:bg-beige-50 hover:border-beige-600 hover:text-beige-800 shadow-soft",
    outline: "border-2 border-beige-300 text-beige-600 bg-transparent hover:bg-beige-50 hover:border-beige-400",
    ghost: "text-beige-700 bg-transparent hover:bg-beige-100 hover:text-beige-800",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-medium",
    success: "bg-gradient-to-r from-sage-500 to-sage-600 text-white hover:from-sage-600 hover:to-sage-700 shadow-medium",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-medium",
    info: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-medium",
    earth: "bg-gradient-to-r from-earth-500 to-earth-600 text-white hover:from-earth-600 hover:to-earth-700 shadow-medium",
    sage: "bg-gradient-to-r from-sage-500 to-sage-600 text-white hover:from-sage-600 hover:to-sage-700 shadow-medium",
    cream: "bg-gradient-to-r from-cream-400 to-cream-500 text-beige-800 hover:from-cream-500 hover:to-cream-600 shadow-medium"
  };
  
  const sizes = {
    small: "px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm",
    medium: "px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base",
    large: "px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg",
    xlarge: "px-8 py-4 sm:px-10 sm:py-5 text-lg sm:text-xl"
  };
  
  const animations = {
    default: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 }
    },
    bounce: {
      whileHover: { scale: 1.05, y: -2 },
      whileTap: { scale: 0.95 }
    },
    glow: {
      whileHover: { 
        scale: 1.02,
        boxShadow: "0 0 30px rgba(239, 195, 115, 0.4)"
      },
      whileTap: { scale: 0.98 }
    },
    wiggle: {
      whileHover: { 
        scale: 1.02,
        rotate: [0, 1, -1, 0],
        transition: { rotate: { duration: 0.3, repeat: 2 } }
      },
      whileTap: { scale: 0.98 }
    },
    float: {
      whileHover: { 
        scale: 1.02,
        y: [-2, -4, -2],
        transition: { y: { duration: 0.6, repeat: Infinity } }
      },
      whileTap: { scale: 0.98 }
    },
    pulse: {
      whileHover: { 
        scale: [1, 1.05, 1],
        transition: { duration: 0.6, repeat: Infinity }
      },
      whileTap: { scale: 0.98 }
    }
  };
  
  const isDisabled = disabled || loading;
  const disabledClasses = isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;
  
  const motionProps = !isDisabled ? animations[animation] : {};
  
  const renderIcon = () => {
    if (loading) {
      return <InlineLoader size="small" className={iconPosition === 'right' ? 'ml-1.5 sm:ml-2' : 'mr-1.5 sm:mr-2'} />;
    }
    if (Icon) {
      return <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconPosition === 'right' ? 'ml-1.5 sm:ml-2' : 'mr-1.5 sm:mr-2'}`} />;
    }
    return null;
  };
  
  return (
    <motion.button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={!isDisabled ? onClick : undefined}
      {...motionProps}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
      {iconPosition === 'right' && renderIcon()}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <InlineLoader size="small" />
        </div>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

// Specialized button components
const IconButton = forwardRef(({ 
  icon: Icon, 
  size = 'medium', 
  variant = 'ghost',
  className = '',
  ...props 
}, ref) => {
  const iconSizes = {
    small: 'p-2',
    medium: 'p-3',
    large: 'p-4'
  };
  
  const iconDimensions = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6'
  };
  
  return (
    <Button
      ref={ref}
      variant={variant}
      className={`${iconSizes[size]} ${className}`}
      {...props}
    >
      <Icon className={iconDimensions[size]} />
    </Button>
  );
});

IconButton.displayName = 'IconButton';

const FloatingActionButton = forwardRef(({ 
  icon: Icon, 
  variant = 'primary',
  size = 'large',
  className = '',
  ...props 
}, ref) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <IconButton
        ref={ref}
        icon={Icon}
        variant={variant}
        size={size}
        className={`rounded-full shadow-strong ${className}`}
        animation="glow"
        {...props}
      />
    </motion.div>
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';

const ButtonGroup = ({ children, className = '', variant = 'horizontal' }) => {
  const groupClasses = variant === 'horizontal' 
    ? 'flex space-x-2' 
    : 'flex flex-col space-y-2';
    
  return (
    <div className={`${groupClasses} ${className}`}>
      {children}
    </div>
  );
};

const SplitButton = ({ 
  children, 
  dropdownItems = [], 
  onMainClick,
  variant = 'primary',
  size = 'medium',
  ...props 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="relative inline-flex">
      <Button
        variant={variant}
        size={size}
        onClick={onMainClick}
        className="rounded-r-none border-r border-white/20"
        {...props}
      >
        {children}
      </Button>
      
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-l-none px-3"
        icon={ChevronDownIcon}
        iconPosition="right"
      />
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-strong border border-beige-200 py-2 z-50"
        >
          {dropdownItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-beige-50 transition-colors text-beige-700"
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Preset button combinations
const PrimaryButton = (props) => <Button variant="primary" animation="bounce" {...props} />;
const SecondaryButton = (props) => <Button variant="secondary" animation="default" {...props} />;
const DangerButton = (props) => <Button variant="danger" animation="default" {...props} />;
const SuccessButton = (props) => <Button variant="success" animation="bounce" {...props} />;
const GhostButton = (props) => <Button variant="ghost" animation="default" {...props} />;
const OutlineButton = (props) => <Button variant="outline" animation="default" {...props} />;

// Specialized themed buttons
const FarmButton = (props) => (
  <Button 
    variant="sage" 
    animation="float"
    icon={props.icon || ((props) => <span className="text-xl mr-2">🌾</span>)}
    {...props} 
  />
);

const OrganicButton = (props) => (
  <Button 
    variant="success" 
    animation="glow"
    icon={props.icon || ((props) => <span className="text-xl mr-2">🌱</span>)}
    {...props} 
  />
);

const EarthButton = (props) => (
  <Button 
    variant="earth" 
    animation="pulse"
    icon={props.icon || ((props) => <span className="text-xl mr-2">🌍</span>)}
    {...props} 
  />
);

export {
  Button,
  IconButton,
  FloatingActionButton,
  ButtonGroup,
  SplitButton,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  SuccessButton,
  GhostButton,
  OutlineButton,
  FarmButton,
  OrganicButton,
  EarthButton
};
