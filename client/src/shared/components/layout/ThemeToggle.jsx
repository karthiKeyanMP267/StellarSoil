import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ variant = 'button' }) => {
  const { 
    theme, 
    systemTheme, 
    toggleTheme, 
    setLightTheme, 
    setDarkTheme, 
    useSystemTheme, 
    isDark 
  } = useTheme();
  
  const [isOpen, setIsOpen] = React.useState(false);

  const themes = [
    {
      id: 'light',
      name: 'Light',
      icon: SunIcon,
      description: 'Clean and bright interface',
      action: setLightTheme
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: MoonIcon,
      description: 'Easy on the eyes',
      action: setDarkTheme
    },
    {
      id: 'system',
      name: 'System',
      icon: ComputerDesktopIcon,
      description: `Follow system (${systemTheme})`,
      action: useSystemTheme
    }
  ];

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  if (variant === 'simple') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className={`p-2 rounded-xl shadow-organic transition-all duration-300 focus:outline-none focus:ring-0 ${
          isDark 
            ? 'bg-slate-800/80 text-amber-400 hover:bg-slate-700/90 border border-slate-600/50' 
            : 'bg-white/80 text-slate-600 hover:bg-green-50/80 border border-green-200/50'
        }`}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <SunIcon className="h-5 w-5" />
              <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-gentle-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <MoonIcon className="h-5 w-5" />
              <div className="absolute inset-0 bg-slate-600/20 rounded-full animate-gentle-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className={`p-1.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-0 ${
          isDark 
            ? 'text-amber-400 hover:bg-slate-700/50' 
            : 'text-slate-600 hover:bg-green-50/50'
        }`}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SunIcon className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MoonIcon className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <div className="relative">
      {/* Theme Selector Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-lg transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700' 
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <currentTheme.icon className="h-6 w-6" />
        <span className="font-medium text-lg">{currentTheme.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="h-5 w-5" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
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

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-full mt-2 right-0 w-72 rounded-2xl shadow-2xl border z-50 overflow-hidden ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className={`p-2 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-semibold px-3 py-2 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Theme Preferences
                </h3>
              </div>

              <div className="p-2 space-y-1">
                {themes.map((themeOption) => (
                  <motion.button
                    key={themeOption.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      themeOption.action();
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                      theme === themeOption.id
                        ? isDark
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : isDark
                          ? 'hover:bg-gray-700 text-gray-200'
                          : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      theme === themeOption.id
                        ? 'bg-white/20'
                        : isDark
                          ? 'bg-gray-600'
                          : 'bg-gray-200'
                    }`}>
                      <themeOption.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{themeOption.name}</span>
                        {theme === themeOption.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-current rounded-full"
                          />
                        )}
                      </div>
                      <p className={`text-sm ${
                        theme === themeOption.id
                          ? 'text-white/80'
                          : isDark
                            ? 'text-gray-400'
                            : 'text-gray-500'
                      }`}>
                        {themeOption.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Theme Preview */}
              <div className={`p-4 border-t ${
                isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Theme Preview
                </h4>
                
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((previewTheme) => (
                    <motion.div
                      key={`preview-${previewTheme.id}`}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        previewTheme.action();
                        setIsOpen(false);
                      }}
                      className={`relative h-12 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        theme === previewTheme.id
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : isDark
                            ? 'border-gray-600 hover:border-gray-500'
                            : 'border-gray-300 hover:border-gray-400'
                      } ${
                        previewTheme.id === 'dark'
                          ? 'bg-gray-900'
                          : 'bg-white'
                      }`}
                    >
                      {/* Preview content */}
                      <div className={`absolute inset-1 rounded ${
                        previewTheme.id === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                      }`}>
                        <div className={`h-2 rounded-t ${
                          previewTheme.id === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`} />
                        <div className={`flex items-center justify-center h-6 ${
                          previewTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <previewTheme.icon className="h-3 w-3" />
                        </div>
                      </div>
                      
                      {theme === previewTheme.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
