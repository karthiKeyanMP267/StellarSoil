import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const EnhancedThemeToggle = ({ variant = 'default', className = '' }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'system';
    }
    return 'system';
  });
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      name: 'Light',
      value: 'light',
      icon: SunIcon,
      gradient: 'from-yellow-400 to-orange-400',
      description: 'Bright and clean'
    },
    {
      name: 'Dark',
      value: 'dark',
      icon: MoonIcon,
      gradient: 'from-indigo-600 to-purple-600',
      description: 'Easy on the eyes'
    },
    {
      name: 'System',
      value: 'system',
      icon: ComputerDesktopIcon,
      gradient: 'from-gray-500 to-gray-600',
      description: 'Match device setting'
    }
  ];

  const currentTheme = themes.find(t => t.value === theme);

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <motion.button
        onClick={() => {
          const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
          setTheme(nextTheme);
        }}
        className={`
          p-2 rounded-lg text-gray-600 hover:text-sage-700 
          hover:bg-sage-50/70 transition-all duration-300 relative
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <currentTheme.icon className="h-5 w-5" />
        </motion.div>
      </motion.button>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-sage-700 hover:bg-sage-50/70 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ 
            outline: 'none !important', 
            boxShadow: 'none !important'
          }}
          tabIndex="-1"
        >
          <currentTheme.icon className="h-4 w-4" />
          <span className="text-sm">{currentTheme.name}</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              {themes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => handleThemeChange(themeOption.value)}
                  className={`
                    flex items-center space-x-2 w-full px-3 py-2 text-sm
                    hover:bg-gray-50 transition-colors duration-200
                    ${theme === themeOption.value ? 'text-sage-600 bg-sage-50' : 'text-gray-700'}
                  `}
                  style={{ 
                    outline: 'none !important', 
                    boxShadow: 'none !important'
                  }}
                  tabIndex="-1"
                >
                  <themeOption.icon className="h-4 w-4" />
                  <span>{themeOption.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant - full featured
  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-sage-700 hover:bg-sage-50/70 transition-all duration-300 border border-gray-200/50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`p-1 rounded-md bg-gradient-to-r ${currentTheme.gradient}`}
        >
          <currentTheme.icon className="h-4 w-4 text-white" />
        </motion.div>
        <span className="text-sm font-medium">{currentTheme.name}</span>
        <motion.svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Theme Selector */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200/50 py-2 z-50"
            >
              <div className="px-3 py-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Choose Theme</h3>
                <p className="text-xs text-gray-500">Select your preferred theme</p>
              </div>
              
              <div className="py-2">
                {themes.map((themeOption, index) => (
                  <motion.button
                    key={themeOption.value}
                    onClick={() => handleThemeChange(themeOption.value)}
                    className={`
                      flex items-center space-x-3 w-full px-3 py-3 
                      hover:bg-gray-50 transition-all duration-200
                      ${theme === themeOption.value ? 'bg-sage-50 border-r-2 border-sage-600' : ''}
                    `}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    style={{ 
                      outline: 'none !important', 
                      boxShadow: 'none !important'
                    }}
                    tabIndex="-1"
                  >
                    <motion.div
                      className={`p-2 rounded-lg bg-gradient-to-r ${themeOption.gradient}`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <themeOption.icon className="h-5 w-5 text-white" />
                    </motion.div>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-medium ${theme === themeOption.value ? 'text-sage-700' : 'text-gray-700'}`}>
                        {themeOption.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {themeOption.description}
                      </div>
                    </div>
                    {theme === themeOption.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-sage-600 rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              
              <div className="px-3 py-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  System theme matches your device settings
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedThemeToggle;
