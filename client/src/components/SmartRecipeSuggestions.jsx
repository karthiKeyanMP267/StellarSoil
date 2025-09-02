import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  ClockIcon,
  UserGroupIcon,
  ChefHatIcon,
  HeartIcon,
  BookmarkIcon,
  PlayIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const SmartRecipeSuggestions = ({ userPurchases = [] }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterTime, setFilterTime] = useState('all');

  useEffect(() => {
    generateRecipeSuggestions();
  }, [userPurchases]);

  const generateRecipeSuggestions = () => {
    // Simulate AI-powered recipe generation based on user purchases
    const sampleRecipes = [
      {
        id: 1,
        title: "Farm-Fresh Veggie Stir Fry",
        description: "A colorful medley of seasonal vegetables with aromatic herbs",
        difficulty: "Easy",
        cookTime: 20,
        servings: 4,
        rating: 4.8,
        image: "/api/placeholder/300/200",
        ingredients: ["Tomatoes", "Bell Peppers", "Onions", "Garlic", "Fresh Herbs"],
        nutritionalBenefits: ["High in Vitamin C", "Rich in Antioxidants", "Low Calorie"],
        tags: ["Vegan", "Gluten-Free", "Quick"],
        instructions: [
          "Heat oil in a large pan over medium-high heat",
          "Add onions and garlic, sauté for 2 minutes",
          "Add bell peppers and cook for 3 minutes",
          "Add tomatoes and herbs, cook for 5 minutes",
          "Season with salt and pepper, serve hot"
        ],
        videoUrl: "#",
        aiMatch: 95
      },
      {
        id: 2,
        title: "Organic Garden Salad Bowl",
        description: "Crisp greens with seasonal vegetables and homemade dressing",
        difficulty: "Easy",
        cookTime: 15,
        servings: 2,
        rating: 4.6,
        image: "/api/placeholder/300/200",
        ingredients: ["Mixed Greens", "Cucumbers", "Carrots", "Cherry Tomatoes"],
        nutritionalBenefits: ["Rich in Fiber", "High in Vitamins", "Hydrating"],
        tags: ["Raw", "Vegan", "Refreshing"],
        instructions: [
          "Wash and dry all vegetables thoroughly",
          "Chop vegetables into bite-sized pieces",
          "Arrange greens in a large bowl",
          "Top with chopped vegetables",
          "Drizzle with dressing and serve"
        ],
        videoUrl: "#",
        aiMatch: 88
      },
      {
        id: 3,
        title: "Roasted Root Vegetable Medley",
        description: "Caramelized seasonal root vegetables with fresh herbs",
        difficulty: "Medium",
        cookTime: 45,
        servings: 6,
        rating: 4.9,
        image: "/api/placeholder/300/200",
        ingredients: ["Carrots", "Potatoes", "Beets", "Onions", "Rosemary"],
        nutritionalBenefits: ["High in Fiber", "Rich in Potassium", "Antioxidant Rich"],
        tags: ["Vegetarian", "Comfort Food", "Seasonal"],
        instructions: [
          "Preheat oven to 425°F (220°C)",
          "Chop all vegetables into similar-sized pieces",
          "Toss with olive oil, salt, and herbs",
          "Spread on baking sheet in single layer",
          "Roast for 35-45 minutes until tender"
        ],
        videoUrl: "#",
        aiMatch: 92
      }
    ];
    
    setRecipes(sampleRecipes);
    setLoading(false);
  };

  const toggleFavorite = (recipeId) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const difficultyMatch = filterDifficulty === 'all' || recipe.difficulty.toLowerCase() === filterDifficulty;
    const timeMatch = filterTime === 'all' || 
      (filterTime === 'quick' && recipe.cookTime <= 30) ||
      (filterTime === 'medium' && recipe.cookTime > 30 && recipe.cookTime <= 60) ||
      (filterTime === 'long' && recipe.cookTime > 60);
    
    return difficultyMatch && timeMatch;
  });

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
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-gradient-to-r from-earth-500 to-sage-600 rounded-2xl shadow-lg"
          >
            <ChefHatIcon className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-earth-700">Smart Recipe Suggestions</h2>
            <p className="text-beige-600 font-medium">AI-powered recipes based on your fresh produce</p>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center space-x-2 bg-gradient-to-r from-sage-100 to-earth-100 px-4 py-2 rounded-full"
        >
          <SparklesIcon className="h-5 w-5 text-earth-600" />
          <span className="text-earth-700 font-semibold">AI Powered</span>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white/60 rounded-2xl border border-beige-200">
        <div className="flex items-center space-x-2">
          <label className="text-earth-600 font-medium">Difficulty:</label>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl border border-beige-200 text-earth-700 focus:outline-none focus:ring-2 focus:ring-earth-500"
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-earth-600 font-medium">Cook Time:</label>
          <select
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl border border-beige-200 text-earth-700 focus:outline-none focus:ring-2 focus:ring-earth-500"
          >
            <option value="all">Any Time</option>
            <option value="quick">Quick (≤30 min)</option>
            <option value="medium">Medium (30-60 min)</option>
            <option value="long">Long (>60 min)</option>
          </select>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-beige-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedRecipe(recipe)}
            >
              {/* Recipe Image */}
              <div className="relative h-48 bg-gradient-to-br from-beige-100 to-cream-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ChefHatIcon className="h-16 w-16 text-beige-400" />
                </div>
                
                {/* AI Match Score */}
                <div className="absolute top-3 left-3 flex items-center space-x-1 bg-gradient-to-r from-sage-500 to-earth-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  <SparklesIcon className="h-4 w-4" />
                  <span>{recipe.aiMatch}% Match</span>
                </div>

                {/* Favorite Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(recipe.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
                >
                  {favorites.includes(recipe.id) ? (
                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  )}
                </motion.button>
              </div>

              {/* Recipe Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-earth-700 line-clamp-2">{recipe.title}</h3>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <StarIconSolid className="h-4 w-4" />
                    <span className="text-sm font-medium text-earth-600">{recipe.rating}</span>
                  </div>
                </div>

                <p className="text-beige-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>

                {/* Recipe Meta */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-earth-500" />
                    <span className="text-earth-600">{recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="h-4 w-4 text-earth-500" />
                    <span className="text-earth-600">{recipe.servings} servings</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gradient-to-r from-beige-100 to-cream-100 text-earth-600 text-xs font-medium rounded-full border border-beige-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gradient-to-r from-earth-500 to-sage-600 text-white py-2 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300"
                  >
                    View Recipe
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-beige-100 hover:bg-beige-200 text-earth-600 rounded-xl transition-all duration-300"
                  >
                    <BookmarkIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-earth-700 mb-2">{selectedRecipe.title}</h2>
                  <p className="text-beige-600">{selectedRecipe.description}</p>
                </div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Instructions */}
                <div>
                  <h3 className="text-xl font-bold text-earth-700 mb-4">Instructions</h3>
                  <div className="space-y-3">
                    {selectedRecipe.instructions.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-earth-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <p className="text-earth-600">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingredients & Benefits */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-earth-700 mb-4">Ingredients</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-beige-50 rounded-lg">
                          <div className="w-2 h-2 bg-earth-500 rounded-full"></div>
                          <span className="text-earth-600 text-sm">{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-earth-700 mb-4">Nutritional Benefits</h3>
                    <div className="space-y-2">
                      {selectedRecipe.nutritionalBenefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                          <HeartIcon className="h-4 w-4 text-green-600" />
                          <span className="text-green-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
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

export default SmartRecipeSuggestions;
