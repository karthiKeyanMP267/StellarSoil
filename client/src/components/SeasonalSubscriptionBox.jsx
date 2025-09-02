import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GiftIcon,
  CalendarIcon,
  ClockIcon,
  SparklesIcon,
  TruckIcon,
  HeartIcon,
  StarIcon,
  SparklesIcon as LeafIcon,
  CheckCircleIcon,
  XMarkIcon,
  CreditCardIcon,
  MapPinIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const SeasonalSubscriptionBox = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentBox, setCurrentBox] = useState(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [],
    preferredVeggies: [],
    deliveryFrequency: 'monthly',
    boxSize: 'medium'
  });
  const [showCustomization, setShowCustomization] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = () => {
    // Simulate subscription data
    const mockCurrentBox = {
      id: 'box-sept-2025',
      title: 'September Harvest Delights',
      theme: 'Early Autumn Abundance',
      deliveryDate: '2025-09-15',
      status: 'preparing',
      contents: [
        { name: 'Butternut Squash', quantity: '2 lbs', image: '/api/placeholder/100/100', organic: true, local: true },
        { name: 'Purple Cabbage', quantity: '1 head', image: '/api/placeholder/100/100', organic: true, local: true },
        { name: 'Sweet Potatoes', quantity: '3 lbs', image: '/api/placeholder/100/100', organic: true, local: false },
        { name: 'Brussels Sprouts', quantity: '1 lb', image: '/api/placeholder/100/100', organic: true, local: true },
        { name: 'Honeycrisp Apples', quantity: '2 lbs', image: '/api/placeholder/100/100', organic: true, local: true },
        { name: 'Fresh Thyme', quantity: '1 bunch', image: '/api/placeholder/100/100', organic: true, local: true }
      ],
      recipes: [
        { name: 'Roasted Butternut Squash Soup', difficulty: 'Easy', time: '45 min' },
        { name: 'Purple Cabbage Slaw', difficulty: 'Easy', time: '15 min' },
        { name: 'Honey Glazed Brussels Sprouts', difficulty: 'Medium', time: '30 min' }
      ],
      nutritionalHighlights: [
        'Rich in Vitamin A from sweet potatoes',
        'High fiber content from Brussels sprouts',
        'Antioxidants from purple cabbage',
        'Natural sugars from fresh apples'
      ],
      estimatedValue: 45.99,
      subscriptionPrice: 34.99
    };

    const mockHistory = [
      {
        id: 'box-aug-2025',
        title: 'August Summer Finale',
        deliveryDate: '2025-08-15',
        rating: 5,
        favorite: true,
        contents: ['Heirloom Tomatoes', 'Sweet Corn', 'Zucchini', 'Basil', 'Peaches']
      },
      {
        id: 'box-jul-2025',
        title: 'July Peak Summer',
        deliveryDate: '2025-07-15',
        rating: 4,
        favorite: false,
        contents: ['Cucumbers', 'Bell Peppers', 'Cherry Tomatoes', 'Mint', 'Watermelon']
      }
    ];

    setCurrentBox(mockCurrentBox);
    setSubscriptionHistory(mockHistory);
    setLoading(false);
  };

  const subscriptionPlans = [
    {
      id: 'small',
      name: 'Garden Starter',
      size: 'Small Box',
      price: 24.99,
      items: '4-6 items',
      serves: '1-2 people',
      description: 'Perfect for individuals or couples',
      features: ['Seasonal vegetables', 'Recipe cards', 'Organic options'],
      popular: false
    },
    {
      id: 'medium',
      name: 'Family Harvest',
      size: 'Medium Box',
      price: 34.99,
      items: '6-8 items',
      serves: '3-4 people',
      description: 'Ideal for small families',
      features: ['Seasonal vegetables & fruits', 'Recipe cards', 'Local sourcing', 'Nutritional guides'],
      popular: true
    },
    {
      id: 'large',
      name: 'Abundance Box',
      size: 'Large Box',
      price: 49.99,
      items: '8-12 items',
      serves: '5+ people',
      description: 'Great for large families or meal preppers',
      features: ['Premium seasonal produce', 'Gourmet items', 'Recipe videos', 'Priority selection'],
      popular: false
    }
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto-Friendly', 'Low-Carb', 'Raw Foods'
  ];

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setShowCustomization(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'text-yellow-600 bg-yellow-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
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
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg"
          >
            <GiftIcon className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-earth-700">Seasonal Subscription Box</h2>
            <p className="text-beige-600 font-medium">Curated monthly boxes of seasonal farm-fresh produce</p>
          </div>
        </div>
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200"
        >
          <SparklesIcon className="h-5 w-5 text-green-600" />
          <span className="text-green-700 font-semibold">Always Fresh</span>
        </motion.div>
      </div>

      {/* Current Subscription Status */}
      {currentBox && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-green-700">Your Next Box: {currentBox.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(currentBox.status)}`}>
              {currentBox.status.charAt(0).toUpperCase() + currentBox.status.slice(1)}
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-green-600 mb-2 font-medium">Theme: {currentBox.theme}</p>
              <p className="text-green-600 mb-4 flex items-center">
                <TruckIcon className="h-4 w-4 mr-2" />
                Delivery: {new Date(currentBox.deliveryDate).toLocaleDateString()}
              </p>
              
              <div className="bg-white/60 rounded-xl p-4">
                <h4 className="font-semibold text-green-700 mb-3">Box Contents ({currentBox.contents.length} items)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {currentBox.contents.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <LeafIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-700">{item.name}</p>
                        <p className="text-green-600 text-xs">{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {currentBox.contents.length > 4 && (
                  <p className="text-green-600 text-sm mt-2 text-center">
                    +{currentBox.contents.length - 4} more items
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-white/60 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-green-700 mb-3">Included Recipes</h4>
                <div className="space-y-2">
                  {currentBox.recipes.map((recipe, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-green-700 font-medium">{recipe.name}</span>
                      <span className="text-green-600">{recipe.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/60 rounded-xl p-4">
                <h4 className="font-semibold text-green-700 mb-2">Value Breakdown</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-600">Estimated Retail Value:</span>
                  <span className="text-green-700 font-semibold">${currentBox.estimatedValue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Your Price:</span>
                  <span className="text-green-700 font-bold">${currentBox.subscriptionPrice}</span>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-green-700 font-bold">
                    You Save: ${(currentBox.estimatedValue - currentBox.subscriptionPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Subscription Plans */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-earth-700 mb-6">Choose Your Plan</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                plan.popular 
                  ? 'border-green-300 shadow-green-100 shadow-2xl' 
                  : 'border-beige-200 hover:border-green-200'
              }`}
              onClick={() => handleSubscribe(plan)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl w-fit mx-auto mb-4">
                  <ShoppingBagIcon className="h-12 w-12 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-earth-700 mb-2">{plan.name}</h4>
                <p className="text-beige-600 mb-4">{plan.description}</p>
                <div className="text-center">
                  <span className="text-3xl font-bold text-green-600">${plan.price}</span>
                  <span className="text-beige-600">/month</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-beige-600">Items per box:</span>
                  <span className="font-semibold text-earth-700">{plan.items}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-beige-600">Serves:</span>
                  <span className="font-semibold text-earth-700">{plan.serves}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-earth-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-beige-100 text-earth-700 hover:bg-beige-200'
                }`}
              >
                Choose Plan
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subscription History */}
      {subscriptionHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-beige-200"
        >
          <h3 className="text-xl font-bold text-earth-700 mb-4">Previous Boxes</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {subscriptionHistory.map((box, index) => (
              <motion.div
                key={box.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 rounded-xl p-4 border border-beige-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-earth-700">{box.title}</h4>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, starIndex) => (
                      <StarIconSolid
                        key={starIndex}
                        className={`h-4 w-4 ${
                          starIndex < box.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-beige-600 text-sm mb-2">
                  Delivered: {new Date(box.deliveryDate).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {box.contents.slice(0, 3).map((item, itemIndex) => (
                    <span
                      key={itemIndex}
                      className="bg-beige-100 text-earth-600 text-xs px-2 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                  {box.contents.length > 3 && (
                    <span className="text-beige-600 text-xs">+{box.contents.length - 3} more</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button className="text-green-600 text-sm font-semibold hover:text-green-700">
                    Reorder Box
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1"
                  >
                    {box.favorite ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Customization Modal */}
      <AnimatePresence>
        {showCustomization && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCustomization(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-earth-700">Customize Your {selectedPlan.name}</h3>
                <button
                  onClick={() => setShowCustomization(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Dietary Preferences */}
                <div>
                  <h4 className="text-lg font-semibold text-earth-700 mb-3">Dietary Preferences</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {dietaryOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.dietaryRestrictions.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPreferences(prev => ({
                                ...prev,
                                dietaryRestrictions: [...prev.dietaryRestrictions, option]
                              }));
                            } else {
                              setPreferences(prev => ({
                                ...prev,
                                dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== option)
                              }));
                            }
                          }}
                          className="rounded border-beige-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-earth-600 text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Delivery Frequency */}
                <div>
                  <h4 className="text-lg font-semibold text-earth-700 mb-3">Delivery Frequency</h4>
                  <div className="flex space-x-4">
                    {['weekly', 'biweekly', 'monthly'].map((freq) => (
                      <label key={freq} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="frequency"
                          value={freq}
                          checked={preferences.deliveryFrequency === freq}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            deliveryFrequency: e.target.value
                          }))}
                          className="border-beige-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-earth-600 capitalize">{freq}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCustomization(false)}
                    className="flex-1 py-3 px-6 bg-beige-100 text-earth-700 rounded-xl font-semibold hover:bg-beige-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Subscribe Now - ${selectedPlan.price}/month
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SeasonalSubscriptionBox;
