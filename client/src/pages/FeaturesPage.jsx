import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import FeatureShowcase from '../components/FeatureShowcase';
import {
  SparklesIcon,
  UserGroupIcon,
  CogIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const FeaturesPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { theme } = useTheme();

  const tabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: SparklesIcon,
      description: 'Explore all available features'
    },
    {
      id: 'customer',
      name: 'Customer Features',
      icon: UserGroupIcon,
      description: 'Features designed for customers'
    },
    {
      id: 'farmer',
      name: 'Farmer Features',
      icon: AcademicCapIcon,
      description: 'Features designed for farmers'
    },
    {
      id: 'settings',
      name: 'Personalization',
      icon: CogIcon,
      description: 'Customize your experience'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-8 rounded-2xl backdrop-blur-xl border ${
                theme === 'dark'
                  ? 'bg-gray-800/80 border-gray-700/50'
                  : 'bg-white/80 border-beige-200/50'
              }`}
            >
              <h2 className={`text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-beige-900'
              }`}>
                Welcome to StellarSoil AI Features
              </h2>
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-beige-700'
              }`}>
                Experience the future of agriculture and food commerce with our comprehensive suite of AI-powered features. 
                Whether you're a farmer looking to optimize your crops or a customer seeking the freshest produce, 
                our intelligent platform provides personalized solutions to meet your unique needs.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FeatureShowcase userType="customer" />
              <FeatureShowcase userType="farmer" />
            </div>
          </div>
        );
      
      case 'customer':
        return <FeatureShowcase userType="customer" />;
      
      case 'farmer':
        return <FeatureShowcase userType="farmer" />;
      
      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-2xl backdrop-blur-xl border ${
              theme === 'dark'
                ? 'bg-gray-800/80 border-gray-700/50'
                : 'bg-white/80 border-beige-200/50'
            }`}
          >
            <h2 className={`text-3xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-beige-900'
            }`}>
              Personalization Settings
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-beige-800'
                }`}>
                  Theme Preferences
                </h3>
                <p className={`mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-beige-700'
                }`}>
                  Customize your visual experience with our theme options
                </p>
                {/* Theme toggle would be integrated here */}
              </div>
              
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-beige-800'
                }`}>
                  Notification Preferences
                </h3>
                <p className={`mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-beige-700'
                }`}>
                  Configure how and when you receive notifications
                </p>
                {/* Notification settings would be integrated here */}
              </div>
              
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-beige-800'
                }`}>
                  AI Assistant Settings
                </h3>
                <p className={`mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-beige-700'
                }`}>
                  Personalize your AI chatbot experience and voice preferences
                </p>
                {/* AI settings would be integrated here */}
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 pt-20 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-5xl font-bold mb-4 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-beige-800 to-sage-800 bg-clip-text text-transparent'
          }`}>
            Intelligent Features
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-beige-700'
          }`}>
            Discover powerful AI-driven tools designed to revolutionize your agricultural experience
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.id}
                variants={tabVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-beige-600 to-sage-600 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                      : 'bg-white/50 text-beige-700 hover:bg-white/80 border border-beige-200/50'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span>{tab.name}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeaturesPage;
