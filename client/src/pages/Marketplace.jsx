import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import API from '../api/api';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  EyeIcon,
  FireIcon,
  TruckIcon,
  CheckBadgeIcon,
  GiftIcon,
  SparklesIcon,
  BoltIcon,
  SunIcon,
  AdjustmentsHorizontalIcon,
  ViewColumnsIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ query: '', category: '', minPrice: '', maxPrice: '', sortBy: 'featured' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [showQuickView, setShowQuickView] = useState(null);
  const [cartItems, setCartItems] = useState(new Set());
  const [quickAddAnimation, setQuickAddAnimation] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllProducts();
    fetchFavorites();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/products/search');
      setProducts(res.data);
    } catch (err) {
      setError(t('products.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await API.get('/favorites');
      setFavorites(new Set(res.data.map(fav => fav.productId)));
    } catch (err) {
      console.error('Error fetching favorites');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { query, category, minPrice, maxPrice, sortBy } = filters;
      const res = await API.get('/products/search', { 
        params: { query, category, minPrice, maxPrice, sortBy } 
      });
      setProducts(res.data);
    } catch (err) {
      setError(t('products.errorSearching'));
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      await API.post('/cart/add', { productId, quantity: 1 });
      setCartItems(prev => new Set([...prev, productId]));
      setQuickAddAnimation(productId);
      setTimeout(() => setQuickAddAnimation(null), 1000);
      showToastMessage('Added to cart! 🛒');
    } catch (err) {
      showToastMessage('Error adding to cart');
    }
  };

  const toggleFavorite = async (productId) => {
    try {
      if (favorites.has(productId)) {
        await API.delete(`/favorites/${productId}`);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(productId);
          return newFavorites;
        });
        showToastMessage('Removed from favorites ❤️');
      } else {
        await API.post('/favorites/add', { productId });
        setFavorites(prev => new Set([...prev, productId]));
        showToastMessage('Added to favorites! ❤️');
      }
    } catch (err) {
      showToastMessage('Error updating favorites');
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredAndSortedProducts = () => {
    let filtered = products.filter(product => {
      const matchesQuery = product.name.toLowerCase().includes(filters.query.toLowerCase()) ||
                          product.description.toLowerCase().includes(filters.query.toLowerCase());
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesPrice = (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
                          (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));
      return matchesQuery && matchesCategory && matchesPrice;
    });

    switch (filters.sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return filtered;
    }
  };

  const categories = [
    { value: '', label: t('products.allCategories'), icon: '🌿' },
    { value: 'vegetables', label: t('products.vegetables'), icon: '🥕' },
    { value: 'fruits', label: t('products.fruits'), icon: '🍓' },
    { value: 'grains', label: t('products.grains'), icon: '🌾' },
    { value: 'herbs', label: t('products.herbs'), icon: '🌿' },
    { value: 'dairy', label: t('products.dairy'), icon: '🧀' },
    { value: 'meat', label: t('products.meat'), icon: '🐄' }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-beige-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 -left-10 w-72 h-72 bg-gradient-to-r from-beige-300/20 to-sage-300/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 -right-10 w-96 h-96 bg-gradient-to-r from-cream-300/20 to-earth-300/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {['🌾', '🍃', '🌱', '💚', '🌿', '✨'][i]}
          </motion.div>
        ))}
      </div>

      {/* Enhanced Header */}
      <motion.div 
        className="relative z-10 bg-gradient-to-r from-beige-100/90 to-sage-100/90 backdrop-blur-xl border-b border-beige-200/50 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.h1 
                className="text-5xl lg:text-6xl font-black tracking-tight mb-4"
                animate={{ 
                  backgroundImage: [
                    "linear-gradient(45deg, #b08d46, #4a734a)",
                    "linear-gradient(45deg, #4a734a, #6f4e3d)",
                    "linear-gradient(45deg, #6f4e3d, #b08d46)",
                    "linear-gradient(45deg, #b08d46, #4a734a)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                🌾 {t('products.title')}
              </motion.h1>
              
              <motion.p 
                className="text-xl text-earth-700 font-medium max-w-3xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {t('products.subtitle')}
              </motion.p>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { icon: '🌱', count: '500+', label: t('products.freshProducts') },
              { icon: '🚚', count: '24h', label: t('products.fastDelivery') },
              { icon: '🌿', count: '100%', label: t('products.organic') },
              { icon: '⭐', count: '4.9', label: t('products.rating') }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-beige-200/50 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-earth-800">{stat.count}</div>
                <div className="text-sm text-earth-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* View Mode Toggle */}
          <motion.div 
            className="flex justify-end mb-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-beige-200/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-beige-500 text-white shadow-lg' 
                    : 'text-beige-600 hover:bg-beige-200'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-beige-500 text-white shadow-lg' 
                    : 'text-beige-600 hover:bg-beige-200'
                }`}
              >
                <ViewColumnsIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          {/* Enhanced Search Form */}
          <motion.form 
            onSubmit={handleSearch} 
            className="space-y-8 relative z-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {/* Enhanced Search Input */}
              <div className="md:col-span-3 relative group">
                <MagnifyingGlassIcon className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-beige-600 group-focus-within:text-beige-800 transition-colors" />
                <input
                  type="text"
                  placeholder={t('products.searchProducts')}
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-beige-200/50 rounded-2xl text-earth-800 placeholder-earth-500 focus:outline-none focus:ring-2 focus:ring-beige-400 focus:border-transparent transition-all duration-300 shadow-lg"
                />
              </div>

              {/* Category Filter */}
              <div className="md:col-span-2">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-beige-200/50 rounded-2xl text-earth-800 focus:outline-none focus:ring-2 focus:ring-beige-400 focus:border-transparent transition-all duration-300 shadow-lg"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="md:col-span-1">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-beige-200/50 rounded-2xl text-earth-800 focus:outline-none focus:ring-2 focus:ring-beige-400 focus:border-transparent transition-all duration-300 shadow-lg"
                >
                  <option value="featured">✨ {t('products.featured')}</option>
                  <option value="price-low">💰 {t('products.priceLowToHigh')}</option>
                  <option value="price-high">💎 {t('products.priceHighToLow')}</option>
                  <option value="name">📝 {t('products.nameAZ')}</option>
                  <option value="rating">⭐ {t('products.highestRated')}</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="number"
                  placeholder={t('products.minPrice')}
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-beige-200/50 rounded-xl text-earth-800 placeholder-earth-500 focus:outline-none focus:ring-2 focus:ring-beige-400 focus:border-transparent transition-all duration-300 shadow-md"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder={t('products.maxPrice')}
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-beige-200/50 rounded-xl text-earth-800 placeholder-earth-500 focus:outline-none focus:ring-2 focus:ring-beige-400 focus:border-transparent transition-all duration-300 shadow-md"
                />
              </div>
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-beige-500 to-sage-500 text-white font-bold py-3 px-8 rounded-xl hover:from-beige-600 hover:to-sage-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                🔍 {t('products.searchProducts')}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {loading ? (
          <motion.div 
            className="flex justify-center items-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                className="w-16 h-16 border-4 border-beige-300 border-t-beige-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-earth-600 font-medium">{t('products.loading')}</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-8 inline-block shadow-lg">
              <div className="text-6xl mb-4">😔</div>
              <p className="text-red-600 font-medium text-lg">{error}</p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Results Count */}
            <motion.div 
              className="mb-8 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-earth-600 font-medium">
                {t('products.found')} <span className="text-beige-600 font-bold">{filteredAndSortedProducts().length}</span> {t('products.premiumProducts')}
              </p>
            </motion.div>

            {/* Products Grid */}
            <motion.div 
              className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}
              layout
            >
              <AnimatePresence>
                {filteredAndSortedProducts().map((product, index) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`group relative ${
                      viewMode === 'list' ? 'flex space-x-6' : ''
                    }`}
                  >
                    <div className={`bg-white/80 backdrop-blur-sm rounded-3xl border border-beige-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                      viewMode === 'list' ? 'flex-1 flex' : ''
                    }`}>
                      {/* Product Image */}
                      <div className={`relative overflow-hidden ${
                        viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'
                      }`}>
                        <motion.img
                          src={product.image || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        
                        {/* Floating Badges */}
                        <motion.div 
                          className="absolute top-4 left-4 space-y-2"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {product.isOrganic && (
                            <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              🌿 Organic
                            </div>
                          )}
                          {product.isFresh && (
                            <div className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              ✨ Fresh
                            </div>
                          )}
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div 
                          className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ x: 10, opacity: 0 }}
                          animate={{ x: 0, opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <motion.button
                            onClick={() => toggleFavorite(product._id)}
                            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {favorites.has(product._id) ? (
                              <HeartIconSolid className="h-5 w-5 text-red-500" />
                            ) : (
                              <HeartIcon className="h-5 w-5 text-gray-600" />
                            )}
                          </motion.button>
                          
                          <motion.button
                            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowQuickView(product)}
                          >
                            <EyeIcon className="h-5 w-5 text-gray-600" />
                          </motion.button>
                        </motion.div>

                        {/* Quick Add to Cart Button */}
                        <motion.div 
                          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <motion.button
                            onClick={() => addToCart(product._id)}
                            className="bg-gradient-to-r from-beige-500 to-sage-500 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:from-beige-600 hover:to-sage-600 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={quickAddAnimation === product._id ? { scale: [1, 1.2, 1] } : {}}
                          >
                            <ShoppingCartIcon className="h-5 w-5 inline mr-2" />
                            {t('products.quickAdd')}
                          </motion.button>
                        </motion.div>
                      </div>

                      {/* Product Info */}
                      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-3">
                          <motion.h3 
                            className="text-lg font-bold text-earth-800 group-hover:text-beige-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            {product.name}
                          </motion.h3>
                          
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <StarIconSolid className="h-4 w-4" />
                            <span className="text-sm font-medium text-earth-600">
                              {product.rating || '4.5'}
                            </span>
                          </div>
                        </div>

                        <p className="text-earth-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-black text-beige-600">
                            ₹{product.price}
                            <span className="text-sm font-normal text-earth-500">/kg</span>
                          </div>
                          
                          {product.stock > 0 ? (
                            <div className="text-green-600 text-sm font-medium">
                              ✅ {t('products.inStock')} ({product.stock})
                            </div>
                          ) : (
                            <div className="text-red-600 text-sm font-medium">
                              ❌ {t('products.outOfStock')}
                            </div>
                          )}
                        </div>

                        {/* Farm Info */}
                        <div className="flex items-center space-x-2 mb-4 p-3 bg-gradient-to-r from-beige-50/50 to-sage-50/50 rounded-xl border border-beige-200/30">
                          <div className="text-sm">
                            <span className="font-medium text-earth-700">🚜 {product.farmer?.name || t('products.freshFarm')}</span>
                            <div className="text-xs text-earth-600">{product.farmer?.location || t('products.localFarm')}</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <motion.button
                            onClick={() => addToCart(product._id)}
                            disabled={product.stock === 0}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                              product.stock > 0
                                ? 'bg-gradient-to-r from-beige-500 to-sage-500 text-white hover:from-beige-600 hover:to-sage-600 shadow-lg hover:shadow-xl'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            whileHover={product.stock > 0 ? { scale: 1.02, y: -1 } : {}}
                            whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
                          >
                            <ShoppingCartIcon className="h-5 w-5 inline mr-2" />
                            {cartItems.has(product._id) ? t('products.inCart') : t('products.addToCart')}
                          </motion.button>
                          
                          <motion.button
                            onClick={() => toggleFavorite(product._id)}
                            className="p-3 rounded-xl border border-beige-300 hover:border-beige-400 hover:bg-beige-50 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {favorites.has(product._id) ? (
                              <HeartIconSolid className="h-5 w-5 text-red-500" />
                            ) : (
                              <HeartIcon className="h-5 w-5 text-gray-600" />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* No Products Found */}
            {filteredAndSortedProducts().length === 0 && (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-beige-50/80 backdrop-blur-sm border border-beige-200 rounded-3xl p-12 inline-block shadow-lg">
                  <div className="text-8xl mb-6">🌾</div>
                  <h3 className="text-2xl font-bold text-earth-800 mb-4">{t('products.noProductsFound')}</h3>
                  <p className="text-earth-600 mb-6">{t('products.tryAdjustingFilters')}</p>
                  <motion.button
                    onClick={() => setFilters({ query: '', category: '', minPrice: '', maxPrice: '', sortBy: 'featured' })}
                    className="bg-gradient-to-r from-beige-500 to-sage-500 text-white font-bold py-3 px-8 rounded-xl hover:from-beige-600 hover:to-sage-600 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🔄 {t('products.resetFilters')}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-xl border border-beige-200 rounded-2xl px-6 py-4 shadow-2xl z-50"
          >
            <p className="text-earth-800 font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowQuickView(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-earth-800">{showQuickView.name}</h2>
                  <button
                    onClick={() => setShowQuickView(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <img
                    src={showQuickView.image || '/api/placeholder/400/400'}
                    alt={showQuickView.name}
                    className="w-full aspect-square object-cover rounded-2xl"
                  />
                  
                  <div>
                    <p className="text-earth-600 mb-4">{showQuickView.description}</p>
                    <div className="text-3xl font-black text-beige-600 mb-4">
                      ₹{showQuickView.price}
                      <span className="text-lg font-normal text-earth-500">/kg</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-earth-600">Stock:</span>
                        <span className="font-medium">{showQuickView.stock} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-earth-600">Category:</span>
                        <span className="font-medium capitalize">{showQuickView.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-earth-600">Farm:</span>
                        <span className="font-medium">{showQuickView.farmer?.name || 'Fresh Farm'}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => {
                        addToCart(showQuickView._id);
                        setShowQuickView(null);
                      }}
                      disabled={showQuickView.stock === 0}
                      className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                        showQuickView.stock > 0
                          ? 'bg-gradient-to-r from-beige-500 to-sage-500 text-white hover:from-beige-600 hover:to-sage-600 shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={showQuickView.stock > 0 ? { scale: 1.02 } : {}}
                      whileTap={showQuickView.stock > 0 ? { scale: 0.98 } : {}}
                    >
                      <ShoppingCartIcon className="h-5 w-5 inline mr-2" />
                      {showQuickView.stock > 0 ? t('products.addToCart') : t('products.outOfStock')}
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
}

export default Marketplace;
