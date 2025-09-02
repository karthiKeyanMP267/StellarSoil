import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

const LanguageSelector = ({ variant = 'default' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      setIsOpen(false);
      
      // Optional: Call Google Translate API for real-time translation
      if (window.gtranslateSettings && window.gtranslateSettings.default_language !== languageCode) {
        // This would integrate with Google Translate if configured
        console.log(`Switching to ${languageCode}`);
      }
    } catch (error) {
      console.error('Language change failed:', error);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1.5 px-2 py-1.5 rounded-lg hover:bg-green-50/50 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="text-xs font-medium text-earth-700 hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-organic border border-green-200/50 py-2 z-50"
            >
              <div className="max-h-64 overflow-y-auto">
                {languages.map((language) => (
                  <motion.button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-green-50 transition-colors duration-300 ${
                      currentLanguage.code === language.code ? 'bg-green-100/50 text-green-800 font-medium' : 'text-gray-700'
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm">{language.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-50/80 to-emerald-50/80 hover:from-green-100/80 hover:to-emerald-100/80 transition-all duration-300 border border-green-200/50 shadow-organic-soft"
        whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(34, 197, 94, 0.15)' }}
        whileTap={{ scale: 0.98 }}
      >
        <GlobeAltIcon className="h-5 w-5 text-green-700" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-green-800 hidden sm:block">{currentLanguage.name}</span>
        <ChevronDownIcon className={`h-4 w-4 text-green-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-organic-strong border border-green-200/50 py-2 z-50 backdrop-blur-sm"
            >
              <div className="px-4 py-2 border-b border-green-100/50">
                <p className="text-sm font-semibold text-green-800 flex items-center">
                  <GlobeAltIcon className="h-4 w-4 mr-2" />
                  Select Language
                </p>
              </div>
              
              <div className="max-h-80 overflow-y-auto py-2">
                {languages.map((language, index) => (
                  <motion.button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-green-50 transition-all duration-300 ${
                      currentLanguage.code === language.code 
                        ? 'bg-gradient-to-r from-green-100/60 to-emerald-100/60 text-green-900 border-r-4 border-green-500' 
                        : 'text-gray-700'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 8, backgroundColor: 'rgba(239, 195, 115, 0.1)' }}
                  >
                    <span className="text-xl">{language.flag}</span>
                    <div className="flex-1">
                      <span className="text-sm font-medium block">{language.name}</span>
                      <span className="text-xs text-gray-500">{language.code.toUpperCase()}</span>
                    </div>
                    {currentLanguage.code === language.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-beige-500 rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              
              <div className="px-4 py-2 border-t border-beige-100">
                <p className="text-xs text-gray-500 text-center">
                  Powered by AI Translation
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
