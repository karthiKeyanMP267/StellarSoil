import React, { useState, lazy, Suspense } from 'react';
import { LoadingState } from '../components/ui/AsyncStates';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  RocketLaunchIcon,
  CubeIcon,
  ShieldCheckIcon,
  MicrophoneIcon,
  UserGroupIcon,
  ChartBarIcon,
  CpuChipIcon,
  PlayIcon,
  StopIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

// Import all the new advanced components
// Heavy / advanced feature modules lazy loaded
const ARCropVisualizer = lazy(() => import('../components/ARCropVisualizer'));
const BlockchainFarmVerification = lazy(() => import('../components/BlockchainFarmVerification'));
const VoiceControlledFarmAssistant = lazy(() => import('../components/VoiceControlledFarmAssistant'));
const SocialCommerceIntegration = lazy(() => import('../components/SocialCommerceIntegration'));
const PredictiveAnalyticsDashboard = lazy(() => import('../components/PredictiveAnalyticsDashboard'));
const IoTFarmMonitoringHub = lazy(() => import('../components/IoTFarmMonitoringHub'));

// Import previous features
import PersonalizedShoppingAssistant from '../components/PersonalizedShoppingAssistant';
import NutritionalTracking from '../components/NutritionalTracking';
import SeasonalSubscriptionBox from '../components/SeasonalSubscriptionBox';
import CropHealthMonitoring from '../components/CropHealthMonitoring';
import MarketDemandForecasting from '../components/MarketDemandForecasting';
const SustainabilityScoreTracker = lazy(() => import('../components/SustainabilityScoreTracker'));
const SmartNotificationSystem = lazy(() => import('../components/SmartNotificationSystem'));
const AIChatbotAssistant = lazy(() => import('../components/AIChatbotAssistant'));
const RealTimeDeliveryTracking = lazy(() => import('../components/RealTimeDeliveryTracking'));

const AdvancedFeaturesShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [featuresCategory, setFeaturesCategory] = useState('all');

  const advancedFeatures = [
    {
      id: 'ar-visualizer',
      title: 'AR Crop Visualizer',
      description: 'See how crops will grow in your space using augmented reality',
      category: 'ar-tech',
      icon: CubeIcon,
      color: 'from-purple-500 to-pink-600',
      component: ARCropVisualizer,
      tags: ['AR', 'Visualization', 'Planning'],
      difficulty: 'Advanced',
      status: 'New'
    },
    {
      id: 'blockchain-verification',
      title: 'Blockchain Farm Verification',
      description: 'Immutable farm credentials and produce tracking on blockchain',
      category: 'blockchain',
      icon: ShieldCheckIcon,
      color: 'from-emerald-500 to-teal-600',
      component: BlockchainFarmVerification,
      tags: ['Blockchain', 'Security', 'Verification'],
      difficulty: 'Expert',
      status: 'Revolutionary'
    },
    {
      id: 'voice-assistant',
      title: 'Voice Farm Assistant',
      description: 'Hands-free farm management with AI voice commands',
      category: 'ai-voice',
      icon: MicrophoneIcon,
      color: 'from-indigo-500 to-purple-600',
      component: VoiceControlledFarmAssistant,
      tags: ['Voice AI', 'Automation', 'Hands-free'],
      difficulty: 'Advanced',
      status: 'Innovative'
    },
    {
      id: 'social-commerce',
      title: 'Social Commerce Hub',
      description: 'Community-driven marketplace with social features',
      category: 'social',
      icon: UserGroupIcon,
      color: 'from-rose-500 to-pink-600',
      component: SocialCommerceIntegration,
      tags: ['Social', 'Community', 'Commerce'],
      difficulty: 'Intermediate',
      status: 'Trending'
    },
    {
      id: 'predictive-analytics',
      title: 'Predictive Analytics',
      description: 'AI-powered insights and farming forecasts',
      category: 'analytics',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-indigo-600',
      component: PredictiveAnalyticsDashboard,
      tags: ['AI Analytics', 'Forecasting', 'Insights'],
      difficulty: 'Expert',
      status: 'Powerful'
    },
    {
      id: 'iot-monitoring',
      title: 'IoT Farm Monitoring',
      description: 'Real-time sensor data and smart automation',
      category: 'iot',
      icon: CpuChipIcon,
      color: 'from-emerald-500 to-cyan-600',
      component: IoTFarmMonitoringHub,
      tags: ['IoT', 'Sensors', 'Automation'],
      difficulty: 'Expert',
      status: 'Smart'
    }
  ];

  const previousFeatures = [
    {
      id: 'shopping-assistant',
      title: 'AI Shopping Assistant',
      description: 'Personalized product recommendations',
      category: 'ai-shopping',
      icon: SparklesIcon,
      color: 'from-yellow-400 to-orange-500',
      component: PersonalizedShoppingAssistant,
      tags: ['AI', 'Shopping', 'Recommendations'],
      difficulty: 'Intermediate',
      status: 'Popular'
    },
    {
      id: 'nutrition-tracking',
      title: 'Nutritional Tracking',
      description: 'Track nutrition and get recipe suggestions',
      category: 'health',
      icon: SparklesIcon,
      color: 'from-green-400 to-emerald-500',
      component: NutritionalTracking,
      tags: ['Health', 'Nutrition', 'Recipes'],
      difficulty: 'Beginner',
      status: 'Healthy'
    },
    {
      id: 'subscription-box',
      title: 'Seasonal Subscription',
      description: 'Curated seasonal produce boxes',
      category: 'subscription',
      icon: SparklesIcon,
      color: 'from-amber-400 to-orange-500',
      component: SeasonalSubscriptionBox,
      tags: ['Subscription', 'Seasonal', 'Curation'],
      difficulty: 'Beginner',
      status: 'Convenient'
    },
    {
      id: 'crop-health',
      title: 'Crop Health Monitor',
      description: 'AI-powered crop disease detection',
      category: 'monitoring',
      icon: SparklesIcon,
      color: 'from-green-500 to-teal-500',
      component: CropHealthMonitoring,
      tags: ['AI', 'Health', 'Detection'],
      difficulty: 'Advanced',
      status: 'Essential'
    },
    {
      id: 'market-forecasting',
      title: 'Market Demand Forecast',
      description: 'Predict market trends and pricing',
      category: 'analytics',
      icon: SparklesIcon,
      color: 'from-blue-400 to-purple-500',
      component: MarketDemandForecasting,
      tags: ['Forecasting', 'Market', 'Trends'],
      difficulty: 'Advanced',
      status: 'Strategic'
    },
    {
      id: 'sustainability-tracker',
      title: 'Sustainability Score',
      description: 'Track and improve your environmental impact',
      category: 'sustainability',
      icon: SparklesIcon,
      color: 'from-green-400 to-emerald-600',
      component: SustainabilityScoreTracker,
      tags: ['Sustainability', 'Environment', 'Impact'],
      difficulty: 'Intermediate',
      status: 'Eco-Friendly'
    }
  ];

  const allFeatures = [...advancedFeatures, ...previousFeatures];

  const categories = [
    { id: 'all', name: 'All Features', count: allFeatures.length },
    { id: 'ar-tech', name: 'AR & Tech', count: advancedFeatures.filter(f => f.category === 'ar-tech').length },
    { id: 'blockchain', name: 'Blockchain', count: advancedFeatures.filter(f => f.category === 'blockchain').length },
    { id: 'ai-voice', name: 'AI & Voice', count: advancedFeatures.filter(f => f.category === 'ai-voice').length },
    { id: 'social', name: 'Social', count: advancedFeatures.filter(f => f.category === 'social').length },
    { id: 'analytics', name: 'Analytics', count: allFeatures.filter(f => f.category === 'analytics').length },
    { id: 'iot', name: 'IoT', count: advancedFeatures.filter(f => f.category === 'iot').length }
  ];

  const filteredFeatures = featuresCategory === 'all' 
    ? allFeatures 
    : allFeatures.filter(feature => feature.category === featuresCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Revolutionary': 'bg-purple-100 text-purple-800',
      'Innovative': 'bg-indigo-100 text-indigo-800',
      'Trending': 'bg-pink-100 text-pink-800',
      'Powerful': 'bg-red-100 text-red-800',
      'Smart': 'bg-teal-100 text-teal-800',
      'Popular': 'bg-yellow-100 text-yellow-800',
      'Healthy': 'bg-green-100 text-green-800',
      'Convenient': 'bg-blue-100 text-blue-800',
      'Essential': 'bg-emerald-100 text-emerald-800',
      'Strategic': 'bg-violet-100 text-violet-800',
      'Eco-Friendly': 'bg-lime-100 text-lime-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg mr-4"
            >
              <RocketLaunchIcon className="h-12 w-12 text-white" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Advanced Features
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Cutting-edge technology for modern farming
              </p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">12+</div>
                <div className="text-gray-600">Advanced Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
                <div className="text-gray-600">Revolutionary Tech</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">AI</div>
                <div className="text-gray-600">Powered Innovation</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFeaturesCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  featuresCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 border border-gray-200 hover:border-purple-300'
                }`}
              >
                {category.name}
                <span className="ml-2 px-2 py-1 bg-black/10 rounded-full text-xs">
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12"
        >
          {filteredFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden cursor-pointer"
                onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              >
                {/* Feature Card Header */}
                <div className={`p-6 bg-gradient-to-r ${feature.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        <p className="text-white/80 text-sm">{feature.description}</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: activeFeature === feature.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeFeature === feature.id ? (
                        <StopIcon className="h-6 w-6" />
                      ) : (
                        <PlayIcon className="h-6 w-6" />
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Feature Card Body */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {feature.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(feature.difficulty)}`}>
                        {feature.difficulty}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(feature.status)}`}>
                        {feature.status}
                      </span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <LightBulbIcon className="h-4 w-4 text-gray-600" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Active Feature Display */}
        <AnimatePresence mode="wait">
          {activeFeature && (
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="mb-12"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                {/* Feature Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                      >
                        <SparklesIcon className="h-8 w-8" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {allFeatures.find(f => f.id === activeFeature)?.title}
                        </h2>
                        <p className="text-gray-300">Live Interactive Demo</p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveFeature(null)}
                      className="p-2 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30"
                    >
                      <StopIcon className="h-6 w-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Feature Component */}
                <div className="p-6">
                  <Suspense fallback={<LoadingState messageKey="common.loadingData" />}> 
                    {(() => {
                      const feature = allFeatures.find(f => f.id === activeFeature);
                      if (feature && feature.component) {
                        const FeatureComponent = feature.component;
                        return <FeatureComponent />;
                      }
                      return null;
                    })()}
                  </Suspense>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <RocketLaunchIcon className="h-16 w-16 mx-auto" />
            </motion.div>
            
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Farm?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Experience the future of farming with our cutting-edge technology suite. 
              From AR visualization to blockchain verification - we've got it all!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-purple-700 text-white font-bold rounded-xl shadow-lg border-2 border-purple-500 hover:bg-purple-800 transition-all duration-300"
              >
                Schedule Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedFeaturesShowcase;
