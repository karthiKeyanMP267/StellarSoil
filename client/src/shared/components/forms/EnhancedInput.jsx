import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const EnhancedInput = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    setHasInteracted(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const isPassword = type === 'password';
  const currentType = isPassword && showPassword ? 'text' : type;

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  // Variant styles
  const variantClasses = {
    default: 'border-gray-300 focus:border-sage-500 focus:ring-sage-500',
    filled: 'bg-gray-50 border-gray-200 focus:bg-white focus:border-sage-500 focus:ring-sage-500',
    underlined: 'border-0 border-b-2 border-gray-300 focus:border-sage-500 bg-transparent rounded-none px-0'
  };

  // State styles
  const getStateClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    return variantClasses[variant];
  };

  const baseInputClasses = `
    block w-full rounded-lg border transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${getStateClasses()}
    ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${isPassword ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <motion.label
          className={`block text-sm font-medium transition-colors duration-200 ${
            focused ? 'text-sage-700' : error ? 'text-red-700' : success ? 'text-green-700' : 'text-gray-700'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <motion.div
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              focused ? 'text-sage-600' : error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-400'
            }`}
            animate={{
              scale: focused ? 1.1 : 1,
              rotate: focused ? [0, -5, 5, 0] : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        )}

        {/* Input Field */}
        <motion.input
          ref={ref}
          type={currentType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={baseInputClasses}
          whileFocus={{
            scale: 1.01,
            transition: { duration: 0.2 }
          }}
          style={{ 
            outline: 'none !important',
            boxShadow: focused ? `0 0 0 2px ${error ? '#ef4444' : success ? '#10b981' : '#84cc16'}40` : 'none'
          }}
          tabIndex="-1"
          onFocus={(e) => {
            e.target.style.outline = 'none';
            handleFocus(e);
          }}
          {...props}
        />

        {/* Right Icon */}
        {Icon && iconPosition === 'right' && !isPassword && (
          <motion.div
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              focused ? 'text-sage-600' : error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-400'
            }`}
            animate={{
              scale: focused ? 1.1 : 1,
              rotate: focused ? [0, -5, 5, 0] : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        )}

        {/* Password Toggle */}
        {isPassword && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
            <AnimatePresence mode="wait">
              {showPassword ? (
                <motion.div
                  key="hide"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <EyeSlashIcon className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="show"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <EyeIcon className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}

        {/* Status Icon */}
        {hasInteracted && (error || success) && (
          <motion.div
            className={`absolute ${isPassword || (Icon && iconPosition === 'right') ? 'right-10' : 'right-3'} top-1/2 transform -translate-y-1/2 ${
              error ? 'text-red-500' : 'text-green-500'
            }`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          >
            {error ? (
              <ExclamationCircleIcon className="h-5 w-5" />
            ) : (
              <CheckCircleIcon className="h-5 w-5" />
            )}
          </motion.div>
        )}

        {/* Focus Ring Animation */}
        <AnimatePresence>
          {focused && (
            <motion.div
              className={`absolute inset-0 rounded-lg border-2 pointer-events-none ${
                error ? 'border-red-400' : success ? 'border-green-400' : 'border-sage-400'
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Helper Text / Error Message */}
      <AnimatePresence>
        {(error || success || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`text-sm flex items-center space-x-1 ${
              error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {error && <ExclamationCircleIcon className="h-4 w-4" />}
            {success && <CheckCircleIcon className="h-4 w-4" />}
            <span>{error || success || helperText}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

EnhancedInput.displayName = 'EnhancedInput';

// Textarea variant
export const EnhancedTextarea = forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  rows = 3,
  resize = true,
  className = '',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    setHasInteracted(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const getStateClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    return 'border-gray-300 focus:border-sage-500 focus:ring-sage-500';
  };

  const textareaClasses = `
    block w-full px-4 py-3 text-base rounded-lg border transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${resize ? 'resize-y' : 'resize-none'}
    ${getStateClasses()}
    ${className}
  `;

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <motion.label
          className={`block text-sm font-medium transition-colors duration-200 ${
            focused ? 'text-sage-700' : error ? 'text-red-700' : success ? 'text-green-700' : 'text-gray-700'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Textarea Container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.textarea
          ref={ref}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={textareaClasses}
          whileFocus={{
            scale: 1.01,
            transition: { duration: 0.2 }
          }}
          style={{ 
            outline: 'none !important',
            boxShadow: focused ? `0 0 0 2px ${error ? '#ef4444' : success ? '#10b981' : '#84cc16'}40` : 'none'
          }}
          tabIndex="-1"
          onFocus={(e) => {
            e.target.style.outline = 'none';
            handleFocus(e);
          }}
          {...props}
        />

        {/* Status Icon */}
        {hasInteracted && (error || success) && (
          <motion.div
            className={`absolute top-3 right-3 ${error ? 'text-red-500' : 'text-green-500'}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          >
            {error ? (
              <ExclamationCircleIcon className="h-5 w-5" />
            ) : (
              <CheckCircleIcon className="h-5 w-5" />
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Helper Text / Error Message */}
      <AnimatePresence>
        {(error || success || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`text-sm flex items-center space-x-1 ${
              error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {error && <ExclamationCircleIcon className="h-4 w-4" />}
            {success && <CheckCircleIcon className="h-4 w-4" />}
            <span>{error || success || helperText}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

EnhancedTextarea.displayName = 'EnhancedTextarea';

export default EnhancedInput;
