import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

const EnhancedLanguageSelector = ({ variant = 'default', className = '' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      rtl: false
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇮🇳',
      rtl: false
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      rtl: false
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      rtl: false
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      rtl: false
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      rtl: false
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      rtl: false
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      rtl: true
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇧🇷',
      rtl: false
    },
    {
      code: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      flag: '🇷🇺',
      rtl: false
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      setIsOpen(false);
      // Update document direction for RTL languages
      const newLanguage = languages.find(lang => lang.code === languageCode);
      document.documentElement.dir = newLanguage.rtl ? 'rtl' : 'ltr';
    } catch (error) {
      console.error('Language change failed:', error);
    }
  };

  if (variant === 'compact') {
    return (
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
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
        <div className="flex items-center space-x-1">
          <span className="text-sm">{currentLanguage.flag}</span>
          <LanguageIcon className="h-4 w-4" />
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 max-h-60 overflow-y-auto"
              >
                {languages.map((language, index) => (
                  <motion.button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`
                      flex items-center space-x-2 w-full px-3 py-2 text-sm
                      hover:bg-gray-50 transition-colors duration-200
                      ${i18n.language === language.code ? 'text-sage-600 bg-sage-50' : 'text-gray-700'}
                    `}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    style={{ 
                      outline: 'none !important', 
                      boxShadow: 'none !important'
                    }}
                    tabIndex="-1"
                  >
                    <span>{language.flag}</span>
                    <span className="flex-1 text-left">{language.name}</span>
                    {i18n.language === language.code && (
                      <CheckIcon className="h-4 w-4 text-sage-600" />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
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
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="text-sm">{currentLanguage.name}</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-40 overflow-y-auto"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    flex items-center space-x-2 w-full px-3 py-2 text-sm whitespace-nowrap
                    hover:bg-gray-50 transition-colors duration-200
                    ${i18n.language === language.code ? 'text-sage-600 bg-sage-50' : 'text-gray-700'}
                  `}
                  style={{ 
                    outline: 'none !important', 
                    boxShadow: 'none !important'
                  }}
                  tabIndex="-1"
                >
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
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
          key={i18n.language}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-2"
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          <div className="text-left">
            <div className="text-sm font-medium">{currentLanguage.name}</div>
            <div className="text-xs text-gray-500">{currentLanguage.nativeName}</div>
          </div>
        </motion.div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </motion.div>
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
            
            {/* Language Selector */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 py-2 z-50 max-h-96 overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Choose Language</h3>
                <p className="text-xs text-gray-500">Select your preferred language</p>
              </div>
              
              <div className="py-2 max-h-72 overflow-y-auto">
                {languages.map((language, index) => (
                  <motion.button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`
                      flex items-center space-x-3 w-full px-3 py-3 
                      hover:bg-gray-50 transition-all duration-200
                      ${i18n.language === language.code ? 'bg-sage-50 border-r-2 border-sage-600' : ''}
                    `}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 4 }}
                    style={{ 
                      outline: 'none !important', 
                      boxShadow: 'none !important'
                    }}
                    tabIndex="-1"
                  >
                    <motion.span
                      className="text-2xl"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {language.flag}
                    </motion.span>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-medium ${i18n.language === language.code ? 'text-sage-700' : 'text-gray-700'}`}>
                        {language.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {language.nativeName}
                      </div>
                    </div>
                    {i18n.language === language.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-sage-600"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              
              <div className="px-3 py-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Language changes will be applied immediately
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedLanguageSelector;
