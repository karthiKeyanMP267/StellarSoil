import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  SparklesIcon,
  HeartIcon,
  ChartBarIcon,
  CubeIcon,
  BeakerIcon,
  TruckIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BellAlertIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';

// Import all the new feature components
import PersonalizedShoppingAssistant from './PersonalizedShoppingAssistant';
import NutritionalTracking from './NutritionalTracking';
import SeasonalSubscriptionBox from './SeasonalSubscriptionBox';
import CropHealthMonitoring from './CropHealthMonitoring';
import MarketDemandForecasting from './MarketDemandForecasting';
import SustainabilityScoreTracker from './SustainabilityScoreTracker';
import SmartNotificationSystem from './SmartNotificationSystem';
import AIChatbotAssistant from './AIChatbotAssistant';
import RealTimeDeliveryTracking from './RealTimeDeliveryTracking';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const FeatureShowcase = ({ userType = 'customer' }) => {
  const [activeFeature, setActiveFeature] = useState(null);
  const { theme } = useTheme();

  const customerFeatures = [
    {
      id: 'shopping-assistant',
      name: 'AI Shopping Assistant',
      description: 'Get personalized produce recommendations based on your preferences and dietary needs',
      icon: SparklesIcon,
      color: 'from-purple-500 to-pink-500',
      component: PersonalizedShoppingAssistant
    },
    {
      id: 'nutrition-tracking',
      name: 'Nutritional Tracking',
      description: 'Track your daily nutrition intake and get insights on your health goals',
      icon: HeartIcon,
      color: 'from-green-500 to-emerald-500',
      component: NutritionalTracking
    },
    {
      id: 'subscription-box',
      name: 'Seasonal Subscription',
      description: 'Curated seasonal produce boxes delivered to your doorstep',
      icon: CubeIcon,
      color: 'from-orange-500 to-red-500',
      component: SeasonalSubscriptionBox
    },
    {
      id: 'sustainability-tracker',
      name: 'Sustainability Score',
      description: 'Track your environmental impact and earn sustainability rewards',
      icon: BeakerIcon,
      color: 'from-teal-500 to-cyan-500',
      component: SustainabilityScoreTracker
    },
    {
      id: 'delivery-tracking',
      name: 'Real-time Delivery',
      description: 'Track your orders in real-time with live driver updates',
      icon: TruckIcon,
      color: 'from-blue-500 to-indigo-500',
      component: RealTimeDeliveryTracking
    }
  ];

  const farmerFeatures = [
    {
      id: 'crop-monitoring',
      name: 'Crop Health Monitoring',
      description: 'AI-powered crop analysis and health recommendations for optimal yield',
      icon: BeakerIcon,
      color: 'from-green-500 to-lime-500',
      component: CropHealthMonitoring
    },
    {
      id: 'market-forecasting',
      name: 'Market Demand Forecasting',
      description: 'Predict market trends and optimize your crop planning for maximum profit',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-cyan-500',
      component: MarketDemandForecasting
    },
    {
      id: 'sustainability-tracker',
      name: 'Sustainability Score',
      description: 'Monitor your farm\'s environmental impact and sustainable practices',
      icon: BeakerIcon,
      color: 'from-teal-500 to-emerald-500',
      component: SustainabilityScoreTracker
    }
  ];

  const universalFeatures = [
    {
      id: 'smart-notifications',
      name: 'Smart Notifications',
      description: 'Intelligent notification system with real-time updates and filtering',
      icon: BellAlertIcon,
      color: 'from-yellow-500 to-orange-500',
      component: SmartNotificationSystem
    },
    {
      id: 'ai-chatbot',
      name: 'AI Assistant',
      description: 'Voice-enabled AI chatbot for instant help and guidance',
      icon: ChatBubbleOvalLeftEllipsisIcon,
      color: 'from-indigo-500 to-purple-500',
      component: AIChatbotAssistant
    },
    {
      id: 'theme-customization',
      name: 'Theme Customization',
      description: 'Personalize your experience with light, dark, or system themes',
      icon: PaintBrushIcon,
      color: 'from-pink-500 to-rose-500',
      component: ThemeToggle
    }
  ];

  const features = userType === 'farmer' 
    ? [...farmerFeatures, ...universalFeatures]
    : [...customerFeatures, ...universalFeatures];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
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
            AI-Powered Features
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-beige-700'
          }`}>
            Experience the future of {userType === 'farmer' ? 'farming' : 'shopping'} with our 
            cutting-edge AI features designed to enhance your productivity and experience.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-2xl backdrop-blur-xl border shadow-xl cursor-pointer transform-gpu transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800/80 border-gray-700/50 hover:bg-gray-700/80'
                    : 'bg-white/80 border-beige-200/50 hover:bg-white/90'
                }`}
                onClick={() => setActiveFeature(feature)}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`} />
                
                <div className="relative p-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-beige-900'
                  }`}>
                    {feature.name}
                  </h3>
                  
                  <p className={`text-lg leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-beige-700'
                  }`}>
                    {feature.description}
                  </p>
                  
                  <div className={`mt-6 inline-flex items-center text-sm font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    Explore Feature
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Feature Demo Modal */}
        {activeFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-6 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-beige-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${activeFeature.color}`}>
                      <activeFeature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-beige-900'
                      }`}>
                        {activeFeature.name}
                      </h2>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-beige-700'}>
                        {activeFeature.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveFeature(null)}
                    className={`p-2 rounded-full transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                        : 'hover:bg-beige-100 text-beige-600 hover:text-beige-900'
                    }`}
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <activeFeature.component />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`text-center p-8 rounded-2xl backdrop-blur-xl border ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-white/80 border-beige-200/50'
          }`}
        >
          <h2 className={`text-3xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-beige-900'
          }`}>
            Ready to Experience the Future?
          </h2>
          <p className={`text-lg mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-beige-700'
          }`}>
            Start exploring these powerful AI features and transform your {userType === 'farmer' ? 'farming' : 'shopping'} experience today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-beige-600 to-sage-600 text-white font-semibold rounded-xl shadow-lg hover:from-beige-700 hover:to-sage-700 transition-all duration-300"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
