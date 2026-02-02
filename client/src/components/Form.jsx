import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const Input = forwardRef(({ 
  type = 'text',
  label,
  placeholder,
  error,
  success,
  icon: Icon,
  rightIcon: RightIcon,
  className = '',
  variant = 'default',
  size = 'medium',
  animation = true,
  required = false,
  disabled = false,
  helpText,
  onRightIconClick,
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const baseClasses = "w-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: `bg-white border border-beige-200 rounded-xl ${
      error ? 'border-red-300' : 
      success ? 'border-green-300' : ''
    }`,
    filled: `bg-beige-50 border border-transparent rounded-xl ${
      error ? 'bg-red-50' : 
      success ? 'bg-green-50' : ''
    }`,
    outlined: `bg-transparent border-2 border-beige-300 rounded-xl ${
      error ? 'border-red-300' : 
      success ? 'border-green-300' : ''
    }`,
    minimal: `bg-transparent border-0 border-b-2 border-beige-200 rounded-none ${
      error ? 'border-red-300' : 
      success ? 'border-green-300' : ''
    }`
  };
  
  const sizes = {
    small: `px-3 py-2 text-sm ${Icon ? 'pl-10' : ''} ${RightIcon || type === 'password' ? 'pr-10' : ''}`,
    medium: `px-4 py-3 ${Icon ? 'pl-12' : ''} ${RightIcon || type === 'password' ? 'pr-12' : ''}`,
    large: `px-5 py-4 text-lg ${Icon ? 'pl-14' : ''} ${RightIcon || type === 'password' ? 'pr-14' : ''}`
  };
  
  const iconSizes = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6'
  };
  
  const inputClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <motion.label 
          className={`block text-sm font-semibold transition-colors ${
            error ? 'text-red-600' : 
            success ? 'text-green-600' : 
            focused ? 'text-beige-700' : 'text-beige-600'
          }`}
          animate={animation ? { 
            scale: focused ? 1.02 : 1,
            color: focused ? '#8f7138' : '#a68b5b'
          } : {}}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <motion.div 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-beige-400 ${
              focused ? 'text-beige-600' : ''
            }`}
            animate={animation ? { 
              scale: focused ? 1.1 : 1,
              color: focused ? '#8f7138' : '#d4b896'
            } : {}}
          >
            <Icon className={iconSizes[size]} />
          </motion.div>
        )}
        
        {/* Input Field */}
        <motion.input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          animate={animation ? {
            scale: focused ? 1.01 : 1
          } : {}}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {/* Right Icon / Password Toggle */}
        {(RightIcon || type === 'password') && (
          <motion.button
            type="button"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-beige-400 hover:text-beige-600 ${
              onRightIconClick || type === 'password' ? 'cursor-pointer' : 'cursor-default'
            }`}
            onClick={type === 'password' ? handlePasswordToggle : onRightIconClick}
            whileHover={animation ? { scale: 1.1 } : {}}
            whileTap={animation ? { scale: 0.95 } : {}}
          >
            {type === 'password' ? (
              showPassword ? 
                <EyeSlashIcon className={iconSizes[size]} /> : 
                <EyeIcon className={iconSizes[size]} />
            ) : (
              RightIcon && <RightIcon className={iconSizes[size]} />
            )}
          </motion.button>
        )}
        
        {/* Status Icons */}
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute ${RightIcon || type === 'password' ? 'right-12' : 'right-3'} top-1/2 transform -translate-y-1/2`}
          >
            {error ? (
              <ExclamationCircleIcon className={`${iconSizes[size]} text-red-500`} />
            ) : (
              <CheckCircleIcon className={`${iconSizes[size]} text-green-500`} />
            )}
          </motion.div>
        )}
      </div>
      
      {/* Help Text / Error Message */}
      <AnimatePresence>
        {(helpText || error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-sm ${
              error ? 'text-red-600' : 
              success ? 'text-green-600' : 
              'text-beige-500'
            }`}
          >
            {error || success || helpText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const TextArea = forwardRef(({ 
  label,
  placeholder,
  error,
  success,
  className = '',
  variant = 'default',
  rows = 4,
  maxLength,
  showCounter = false,
  required = false,
  disabled = false,
  helpText,
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(props.value || props.defaultValue || '');
  
  const baseClasses = "w-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed resize-none";
  
  const variants = {
    default: `bg-white border border-beige-200 rounded-xl ${
      error ? 'border-red-300' : 
      success ? 'border-green-300' : ''
    }`,
    filled: `bg-beige-50 border border-transparent rounded-xl ${
      error ? 'bg-red-50' : 
      success ? 'bg-green-50' : ''
    }`,
    outlined: `bg-transparent border-2 border-beige-300 rounded-xl ${
      error ? 'border-red-300' : 
      success ? 'border-green-300' : ''
    }`
  };
  
  const textareaClasses = `${baseClasses} ${variants[variant]} px-4 py-3 ${className}`;
  
  const handleChange = (e) => {
    setValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };
  
  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <motion.label 
          className={`block text-sm font-semibold transition-colors ${
            error ? 'text-red-600' : 
            success ? 'text-green-600' : 
            focused ? 'text-beige-700' : 'text-beige-600'
          }`}
          animate={{ 
            scale: focused ? 1.02 : 1,
            color: focused ? '#8f7138' : '#a68b5b'
          }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      {/* TextArea */}
      <motion.textarea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        animate={{
          scale: focused ? 1.01 : 1
        }}
        transition={{ duration: 0.2 }}
        {...props}
      />
      
      {/* Counter and Help Text */}
      <div className="flex justify-between items-center">
        <AnimatePresence>
          {(helpText || error || success) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-sm ${
                error ? 'text-red-600' : 
                success ? 'text-green-600' : 
                'text-beige-500'
              }`}
            >
              {error || success || helpText}
            </motion.div>
          )}
        </AnimatePresence>
        
        {showCounter && maxLength && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm ${
              value.length > maxLength * 0.9 ? 'text-orange-500' :
              value.length === maxLength ? 'text-red-500' : 'text-beige-400'
            }`}
          >
            {value.length}/{maxLength}
          </motion.div>
        )}
      </div>
    </div>
  );
});

const Select = forwardRef(({ 
  label,
  options = [],
  placeholder = "Select an option",
  error,
  success,
  className = '',
  variant = 'default',
  size = 'medium',
  required = false,
  disabled = false,
  helpText,
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  
  const baseClasses = "w-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none";
  
  const variants = {
    default: `bg-white border border-beige-200 rounded-xl focus:border-beige-400 focus:ring-4 focus:ring-beige-100 ${
      error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 
      success ? 'border-green-300 focus:border-green-400 focus:ring-green-100' : ''
    }`,
    filled: `bg-beige-50 border border-transparent rounded-xl focus:bg-white focus:border-beige-400 focus:ring-4 focus:ring-beige-100 ${
      error ? 'bg-red-50 focus:border-red-400 focus:ring-red-100' : 
      success ? 'bg-green-50 focus:border-green-400 focus:ring-green-100' : ''
    }`,
    outlined: `bg-transparent border-2 border-beige-300 rounded-xl focus:border-beige-500 ${
      error ? 'border-red-300 focus:border-red-500' : 
      success ? 'border-green-300 focus:border-green-500' : ''
    }`
  };
  
  const sizes = {
    small: 'px-3 py-2 pr-8 text-sm',
    medium: 'px-4 py-3 pr-10',
    large: 'px-5 py-4 pr-12 text-lg'
  };
  
  const selectClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <motion.label 
          className={`block text-sm font-semibold transition-colors ${
            error ? 'text-red-600' : 
            success ? 'text-green-600' : 
            focused ? 'text-beige-700' : 'text-beige-600'
          }`}
          animate={{ 
            scale: focused ? 1.02 : 1,
            color: focused ? '#8f7138' : '#a68b5b'
          }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      {/* Select Container */}
      <div className="relative">
        <motion.select
          ref={ref}
          className={selectClasses}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          animate={{
            scale: focused ? 1.01 : 1
          }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </motion.select>
        
        {/* Dropdown Arrow */}
        <motion.div
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
            focused ? 'text-beige-600' : 'text-beige-400'
          }`}
          animate={{
            rotate: focused ? 180 : 0,
            color: focused ? '#8f7138' : '#d4b896'
          }}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
        
        {/* Status Icons */}
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-10 top-1/2 transform -translate-y-1/2"
          >
            {error ? (
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            )}
          </motion.div>
        )}
      </div>
      
      {/* Help Text / Error Message */}
      <AnimatePresence>
        {(helpText || error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-sm ${
              error ? 'text-red-600' : 
              success ? 'text-green-600' : 
              'text-beige-500'
            }`}
          >
            {error || success || helpText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const FileUpload = ({ 
  label,
  accept,
  multiple = false,
  error,
  success,
  className = '',
  dragActive = true,
  maxSize,
  onFileSelect,
  required = false,
  helpText,
  ...props 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    if (dragActive) setDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (dragActive) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    }
  };
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };
  
  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      if (maxSize && file.size > maxSize) {
        return false;
      }
      return true;
    });
    
    setFiles(multiple ? [...files, ...validFiles] : validFiles);
    if (onFileSelect) {
      onFileSelect(multiple ? [...files, ...validFiles] : validFiles);
    }
  };
  
  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFileSelect) {
      onFileSelect(newFiles);
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <label className={`block text-sm font-semibold ${
          error ? 'text-red-600' : 'text-beige-600'
        }`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragOver ? 'border-beige-400 bg-beige-50' :
          error ? 'border-red-300 bg-red-50' :
          'border-beige-200 bg-beige-25 hover:border-beige-300 hover:bg-beige-50'
        } ${className}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: dragOver ? 1.02 : 1,
          borderColor: dragOver ? '#d4b896' : '#e8dcc6'
        }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...props}
        />
        
        <motion.div
          animate={{
            y: dragOver ? -5 : 0
          }}
        >
          <motion.div
            className="mx-auto w-16 h-16 bg-gradient-to-r from-beige-400 to-cream-400 rounded-2xl flex items-center justify-center mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </motion.div>
          
          <h3 className="text-lg font-semibold text-beige-700 mb-2">
            {dragOver ? 'Drop files here' : 'Upload files'}
          </h3>
          
          <p className="text-beige-500 mb-4">
            Drag and drop files here, or click to browse
          </p>
          
          {maxSize && (
            <p className="text-sm text-beige-400">
              Max file size: {formatFileSize(maxSize)}
            </p>
          )}
        </motion.div>
      </motion.div>
      
      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-white border border-beige-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-beige-100 rounded-lg flex items-center justify-center">
                    <svg className="h-4 w-4 text-beige-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-beige-800">{file.name}</p>
                    <p className="text-xs text-beige-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Help Text / Error Message */}
      <AnimatePresence>
        {(helpText || error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-sm ${
              error ? 'text-red-600' : 
              success ? 'text-green-600' : 
              'text-beige-500'
            }`}
          >
            {error || success || helpText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Pre-configured input variants for common use cases
const SearchInput = (props) => (
  <Input 
    type="text" 
    icon={MagnifyingGlassIcon} 
    placeholder="Search..." 
    variant="filled"
    {...props} 
  />
);

const EmailInput = (props) => (
  <Input 
    type="email" 
    icon={EnvelopeIcon} 
    placeholder="Enter your email"
    {...props} 
  />
);

const PhoneInput = (props) => (
  <Input 
    type="tel" 
    icon={PhoneIcon} 
    placeholder="Enter your phone number"
    {...props} 
  />
);

const PasswordInput = (props) => (
  <Input 
    type="password" 
    icon={LockClosedIcon} 
    placeholder="Enter your password"
    {...props} 
  />
);

const DateInput = (props) => (
  <Input 
    type="date" 
    icon={CalendarIcon}
    {...props} 
  />
);

const UserInput = (props) => (
  <Input 
    type="text" 
    icon={UserIcon} 
    placeholder="Enter your name"
    {...props} 
  />
);

export {
  Input,
  TextArea,
  Select,
  FileUpload,
  SearchInput,
  EmailInput,
  PhoneInput,
  PasswordInput,
  DateInput,
  UserInput
};
