import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  ChartBarIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  BellIcon,
  GiftIcon,
  TrophyIcon,
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const PersonalizedShoppingAssistant = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReason, setSelectedReason] = useState('all');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadPersonalizedRecommendations();
    loadUserPreferences();
  }, [userId]);

  useEffect(() => {
    filterRecommendations();
  }, [recommendations, searchTerm, selectedCategory, selectedReason]);

  const loadPersonalizedRecommendations = () => {
    // Simulate AI-powered shopping recommendations based on user behavior
    const mockRecommendations = [
      {
        id: 1,
        title: 'Organic Rainbow Carrots',
        description: 'Perfect for your healthy meal prep routine based on your recent vegetable purchases',
        farmer: 'Sunset Valley Farm',
        price: 4.50,
        originalPrice: 5.25,
        discount: 14,
        category: 'vegetables',
        reason: 'health_goals',
        aiConfidence: 95,
        image: '/api/placeholder/300/200',
        benefits: [
          'High in beta-carotene and antioxidants',
          'Supports your weight management goals',
          'Perfect for batch cooking and meal prep'
        ],
        whyRecommended: 'Based on your preference for colorful vegetables and healthy eating patterns',
        inStock: 45,
        sustainabilityScore: 92,
        tags: ['organic', 'local', 'nutrient-dense'],
        estimatedDelivery: '2-3 days',
        rating: 4.8,
        reviews: 127
      },
      {
        id: 2,
        title: 'Artisan Sourdough Bread',
        description: 'Freshly baked daily - matches your preference for artisanal baked goods',
        farmer: 'Heritage Bakery',
        price: 6.75,
        originalPrice: 7.50,
        discount: 10,
        category: 'bakery',
        reason: 'purchase_history',
        aiConfidence: 88,
        image: '/api/placeholder/300/200',
        benefits: [
          'Natural fermentation for better digestion',
          'No artificial preservatives',
          'Traditional baking methods'
        ],
        whyRecommended: 'You\'ve purchased similar artisan breads 3 times this month',
        inStock: 12,
        sustainabilityScore: 85,
        tags: ['artisan', 'traditional', 'preservative-free'],
        estimatedDelivery: 'Same day',
        rating: 4.9,
        reviews: 89
      },
      {
        id: 3,
        title: 'Premium Mixed Greens',
        description: 'Nutrient-dense salad mix perfect for your daily salad routine',
        farmer: 'Green Meadow Farm',
        price: 5.25,
        originalPrice: 6.00,
        discount: 13,
        category: 'vegetables',
        reason: 'routine_purchase',
        aiConfidence: 92,
        image: '/api/placeholder/300/200',
        benefits: [
          'High in vitamins A, C, and K',
          'Supports immune system',
          'Ready-to-eat convenience'
        ],
        whyRecommended: 'You typically buy salad greens every Tuesday - don\'t forget!',
        inStock: 28,
        sustainabilityScore: 90,
        tags: ['organic', 'ready-to-eat', 'vitamin-rich'],
        estimatedDelivery: '1-2 days',
        rating: 4.7,
        reviews: 156
      },
      {
        id: 4,
        title: 'Local Honey (Raw)',
        description: 'Pure, unfiltered honey that complements your natural lifestyle choices',
        farmer: 'Wildflower Apiaries',
        price: 12.00,
        originalPrice: 12.00,
        discount: 0,
        category: 'pantry',
        reason: 'lifestyle_match',
        aiConfidence: 85,
        image: '/api/placeholder/300/200',
        benefits: [
          'Natural antibacterial properties',
          'Supports local bee populations',
          'Rich in antioxidants'
        ],
        whyRecommended: 'Matches your preference for natural, unprocessed foods',
        inStock: 8,
        sustainabilityScore: 88,
        tags: ['raw', 'local', 'unfiltered'],
        estimatedDelivery: '3-4 days',
        rating: 4.9,
        reviews: 203
      },
      {
        id: 5,
        title: 'Seasonal Berry Mix',
        description: 'Fresh strawberries, blueberries, and raspberries - perfect for smoothies',
        farmer: 'Berry Patch Farm',
        price: 8.50,
        originalPrice: 10.00,
        discount: 15,
        category: 'fruits',
        reason: 'seasonal_trending',
        aiConfidence: 90,
        image: '/api/placeholder/300/200',
        benefits: [
          'Peak seasonal freshness',
          'High in antioxidants and fiber',
          'Perfect for smoothie bowls'
        ],
        whyRecommended: 'Peak berry season + your morning smoothie habit = perfect match!',
        inStock: 22,
        sustainabilityScore: 87,
        tags: ['seasonal', 'antioxidant-rich', 'smoothie-perfect'],
        estimatedDelivery: '1-2 days',
        rating: 4.8,
        reviews: 94
      },
      {
        id: 6,
        title: 'Grass-Fed Beef (Ground)',
        description: 'Premium quality meat from pasture-raised cattle',
        farmer: 'Meadowbrook Ranch',
        price: 18.75,
        originalPrice: 22.00,
        discount: 15,
        category: 'meat',
        reason: 'quality_preference',
        aiConfidence: 87,
        image: '/api/placeholder/300/200',
        benefits: [
          'Higher omega-3 fatty acids',
          'No hormones or antibiotics',
          'Humanely raised'
        ],
        whyRecommended: 'You consistently choose high-quality, ethically sourced proteins',
        inStock: 15,
        sustainabilityScore: 82,
        tags: ['grass-fed', 'hormone-free', 'ethical'],
        estimatedDelivery: '2-3 days',
        rating: 4.9,
        reviews: 167
      }
    ];

    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
  };

  const loadUserPreferences = () => {
    const mockPreferences = {
      dietaryRestrictions: ['vegetarian-friendly'],
      healthGoals: ['weight-management', 'immune-support'],
      preferredCategories: ['vegetables', 'fruits', 'bakery'],
      budgetRange: 'medium',
      sustainabilityImportance: 'high',
      deliveryPreference: 'fast'
    };
    setUserPreferences(mockPreferences);
  };

  const filterRecommendations = () => {
    let filtered = recommendations;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedReason !== 'all') {
      filtered = filtered.filter(item => item.reason === selectedReason);
    }

    setFilteredRecommendations(filtered);
  };

  const categories = [
    { id: 'all', name: 'All Categories', icon: SparklesIcon },
    { id: 'vegetables', name: 'Vegetables', icon: SparklesIcon },
    { id: 'fruits', name: 'Fruits', icon: HeartIcon },
    { id: 'bakery', name: 'Bakery', icon: GiftIcon },
    { id: 'meat', name: 'Meat', icon: StarIcon },
    { id: 'pantry', name: 'Pantry', icon: ShoppingCartIcon }
  ];

  const reasons = [
    { id: 'all', name: 'All Reasons' },
    { id: 'health_goals', name: 'Health Goals' },
    { id: 'purchase_history', name: 'Purchase History' },
    { id: 'routine_purchase', name: 'Routine Purchase' },
    { id: 'lifestyle_match', name: 'Lifestyle Match' },
    { id: 'seasonal_trending', name: 'Seasonal Trending' },
    { id: 'quality_preference', name: 'Quality Preference' }
  ];

  const getReasonColor = (reason) => {
    const colors = {
      health_goals: 'bg-green-100 text-green-800 border-green-200',
      purchase_history: 'bg-blue-100 text-blue-800 border-blue-200',
      routine_purchase: 'bg-purple-100 text-purple-800 border-purple-200',
      lifestyle_match: 'bg-orange-100 text-orange-800 border-orange-200',
      seasonal_trending: 'bg-pink-100 text-pink-800 border-pink-200',
      quality_preference: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[reason] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const addToCart = (item) => {
    setCart(prev => [...prev, item]);
    // Show success animation or notification
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-beige-200"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-beige-200 rounded w-1/2"></div>
          <div className="h-4 bg-beige-100 rounded w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-beige-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-beige-200/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg"
          >
            <SparklesIcon className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-earth-700">Smart Shopping Assistant</h2>
            <p className="text-beige-600 font-medium">AI-powered recommendations tailored just for you</p>
          </div>
        </div>
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full border border-blue-200"
        >
          <TrophyIcon className="h-5 w-5 text-blue-600" />
          <span className="text-blue-700 font-semibold">AI Powered</span>
        </motion.div>
      </div>

      {/* User Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 mb-8"
      >
        <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
          <UserIcon className="h-5 w-5 mr-2" />
          Your Shopping Profile
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/60 p-4 rounded-xl">
            <h4 className="font-semibold text-blue-700 mb-2">Health Goals</h4>
            <div className="flex flex-wrap gap-2">
              {userPreferences.healthGoals?.map(goal => (
                <span key={goal} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {goal.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white/60 p-4 rounded-xl">
            <h4 className="font-semibold text-blue-700 mb-2">Favorite Categories</h4>
            <div className="flex flex-wrap gap-2">
              {userPreferences.preferredCategories?.map(category => (
                <span key={category} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white/60 p-4 rounded-xl">
            <h4 className="font-semibold text-blue-700 mb-2">Sustainability Focus</h4>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-4 w-4 text-green-600" />
              <span className="text-green-700 font-semibold capitalize">{userPreferences.sustainabilityImportance}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-beige-400" />
          <input
            type="text"
            placeholder="Search recommendations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className="px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
        >
          {reasons.map(reason => (
            <option key={reason.id} value={reason.id}>{reason.name}</option>
          ))}
        </select>
      </div>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-beige-200 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-beige-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              
              {/* AI Confidence Badge */}
              <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {item.aiConfidence}% match
              </div>
              
              {/* Discount Badge */}
              {item.discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  -{item.discount}%
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-6">
              {/* Title and Farmer */}
              <div className="mb-3">
                <h3 className="text-lg font-bold text-earth-700 mb-1">{item.title}</h3>
                <p className="text-beige-600 text-sm font-medium">{item.farmer}</p>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center mb-3">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarSolidIcon
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-beige-600 ml-2">
                  {item.rating} ({item.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl font-bold text-green-600">${item.price}</span>
                {item.originalPrice > item.price && (
                  <span className="text-sm text-beige-400 line-through">${item.originalPrice}</span>
                )}
              </div>

              {/* Reason Badge */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getReasonColor(item.reason)}`}>
                  {reasons.find(r => r.id === item.reason)?.name || item.reason}
                </span>
              </div>

              {/* Description */}
              <p className="text-beige-600 text-sm mb-4">{item.description}</p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4 text-beige-500" />
                  <span className="text-beige-600">{item.estimatedDelivery}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="h-4 w-4 text-beige-500" />
                  <span className="text-beige-600">{item.inStock} in stock</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(item)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300"
                >
                  Add to Cart
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRecommendation(item)}
                  className="px-4 py-2 border border-beige-300 rounded-xl text-beige-600 hover:bg-beige-50 transition-all duration-300"
                >
                  Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendation Details Modal */}
      <AnimatePresence>
        {selectedRecommendation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRecommendation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-earth-700">{selectedRecommendation.title}</h3>
                <button
                  onClick={() => setSelectedRecommendation(null)}
                  className="p-2 hover:bg-beige-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-beige-600" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedRecommendation.image}
                    alt={selectedRecommendation.title}
                    className="w-full h-64 object-cover rounded-xl mb-4"
                  />
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-earth-700 mb-2">Why Recommended:</h4>
                      <p className="text-beige-600 text-sm">{selectedRecommendation.whyRecommended}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-earth-700 mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {selectedRecommendation.benefits.map((benefit, index) => (
                          <li key={index} className="text-beige-600 text-sm flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-4">
                    <div className="bg-beige-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-earth-700 mb-2">Product Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-beige-600">Farmer:</span>
                          <span className="font-semibold text-earth-700">{selectedRecommendation.farmer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-beige-600">Price:</span>
                          <span className="font-semibold text-green-600">${selectedRecommendation.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-beige-600">Sustainability Score:</span>
                          <span className="font-semibold text-green-600">{selectedRecommendation.sustainabilityScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-beige-600">In Stock:</span>
                          <span className="font-semibold text-earth-700">{selectedRecommendation.inStock} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-beige-600">Delivery:</span>
                          <span className="font-semibold text-earth-700">{selectedRecommendation.estimatedDelivery}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-earth-700 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecommendation.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        addToCart(selectedRecommendation);
                        setSelectedRecommendation(null);
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PersonalizedShoppingAssistant;
