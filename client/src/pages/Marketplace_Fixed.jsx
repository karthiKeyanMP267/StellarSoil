import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
  XMarkIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [showQuickView, setShowQuickView] = useState(null);
  const [quickAddAnimation, setQuickAddAnimation] = useState(null);

  useEffect(() => {
    fetchAllProducts();
    fetchFavorites();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/products/search');
      setProducts(res.data || []);
    } catch (err) {
      setError('Error loading products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await API.get('/favorites');
      setFavorites(new Set(res.data.map(fav => fav.product._id)));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const handleAddToCart = async (product) => {
    setQuickAddAnimation(product._id);
    try {
      await API.post('/cart/add', { productId: product._id, quantity: 1 });
      setToastMessage(`${product.name} added to cart!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMessage('Error adding to cart');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setTimeout(() => setQuickAddAnimation(null), 500);
    }
  };

  const quickAddToCart = async (product, e) => {
    e.stopPropagation();
    await handleAddToCart(product);
  };

  const handleToggleFavorite = async (product) => {
    try {
      if (favorites.has(product._id)) {
        await API.delete(`/favorites/${product._id}`);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(product._id);
          return newFavorites;
        });
        setToastMessage('Removed from favorites');
      } else {
        await API.post('/favorites/add', { productId: product._id });
        setFavorites(prev => new Set([...prev, product._id]));
        setToastMessage('Added to favorites');
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMessage('Error updating favorites');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 4.5) - (a.rating || 4.5);
      case 'popularity':
        return (b.popularity || 0) - (a.popularity || 0);
      default:
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-beige-50 to-sage-50 pt-20 relative overflow-hidden">
      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-beige-400/20 to-cream-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-sage-400/20 to-earth-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Enhanced Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-gradient-to-r from-sage-500 to-earth-500 text-white px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm border border-sage-300/30 max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <CheckBadgeIcon className="h-6 w-6" />
              <span className="font-semibold">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative"
        >
          {/* Floating elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/4 text-4xl opacity-20"
          >
            🌿
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-10 right-1/4 text-3xl opacity-20"
          >
            🥕
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-beige-700 via-earth-600 to-sage-700 mb-6 tracking-tight relative z-10"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              animate={{ 
                textShadow: [
                  '0 0 0px rgba(239,195,115,0)',
                  '0 0 20px rgba(239,195,115,0.3)',
                  '0 0 0px rgba(239,195,115,0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🌾 Farm Fresh Marketplace
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-earth-700 max-w-4xl mx-auto font-semibold tracking-wide leading-relaxed mb-8 relative z-10"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Premium organic produce from certified local farms
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Enhanced Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-beige-200/50 p-12 mb-16 hover:shadow-3xl transition-all duration-500 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-beige-500/5 to-cream-500/5"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
            {/* Enhanced Search Bar */}
            <div className="lg:col-span-6 relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <MagnifyingGlassIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-7 w-7 text-beige-500 z-10" />
                <input
                  type="text"
                  placeholder="🔍 Search premium organic products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-8 py-6 text-lg font-semibold bg-white/90 backdrop-blur-lg border-2 border-beige-200/70 rounded-3xl 
                           focus:outline-none focus:border-beige-400 focus:bg-white focus:shadow-2xl
                           placeholder-beige-400 text-earth-700 shadow-xl
                           transition-all duration-300 hover:shadow-2xl hover:border-beige-300"
                />
              </motion.div>
            </div>

            {/* Enhanced Category Filter */}
            <div className="lg:col-span-3 relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <FunnelIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-sage-500 z-10" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-16 pr-12 py-6 text-lg font-semibold bg-white/90 backdrop-blur-lg border-2 border-sage-200/70 rounded-3xl 
                           focus:outline-none focus:border-sage-400 focus:bg-white
                           text-earth-700 shadow-xl appearance-none cursor-pointer
                           transition-all duration-300 hover:shadow-2xl hover:border-sage-300"
                >
                  <option value="">🌾 All Categories</option>
                  <option value="Vegetables">🥕 Fresh Vegetables</option>
                  <option value="Fruits">🍎 Seasonal Fruits</option>
                  <option value="Grains">🌾 Organic Grains</option>
                  <option value="Herbs">🌿 Fresh Herbs</option>
                  <option value="Dairy">🥛 Farm Dairy</option>
                </select>
                <ChevronDownIcon className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-sage-500 pointer-events-none" />
              </motion.div>
            </div>

            {/* Enhanced Sort Filter */}
            <div className="lg:col-span-3 relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <ArrowsUpDownIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-cream-600 z-10" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-16 pr-12 py-6 text-lg font-semibold bg-white/90 backdrop-blur-lg border-2 border-cream-200/70 rounded-3xl 
                           focus:outline-none focus:border-cream-400 focus:bg-white
                           text-earth-700 shadow-xl appearance-none cursor-pointer
                           transition-all duration-300 hover:shadow-2xl hover:border-cream-300"
                >
                  <option value="newest">⭐ Newest First</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💎 Price: High to Low</option>
                  <option value="rating">🏆 Highest Rated</option>
                  <option value="popularity">🔥 Most Popular</option>
                </select>
                <ChevronDownIcon className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-cream-600 pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Products Section */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col justify-center items-center py-32 space-y-8"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-8 border-beige-200 border-t-earth-600 shadow-2xl"></div>
              <ShoppingCartIcon className="absolute inset-0 h-12 w-12 m-auto text-earth-600 animate-pulse" />
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-earth-700 animate-pulse">🌾 Loading Fresh Products...</h3>
              <p className="text-lg text-beige-600 font-medium">Fetching the best organic produce just for you!</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-gradient-to-br from-red-50/90 to-red-100/90 backdrop-blur-sm border-2 border-red-300/50 rounded-3xl p-16 shadow-2xl"
          >
            <h3 className="text-3xl font-bold text-red-700 mb-6">⚠️ Oops! Something went wrong</h3>
            <p className="text-xl text-red-600 mb-8 font-medium">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAllProducts}
              className="px-10 py-5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-bold text-xl shadow-2xl"
            >
              🔄 Try Again
            </motion.button>
          </motion.div>
        ) : sortedProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-gradient-to-br from-white/90 to-beige-50/70 backdrop-blur-sm border-2 border-beige-200/30 rounded-3xl p-16 shadow-2xl"
          >
            <h3 className="text-3xl font-bold text-earth-700 mb-6">🔍 No products found</h3>
            <p className="text-xl text-earth-600 mb-8 font-medium">We couldn't find any products matching your criteria.</p>
          </motion.div>
        ) : (
          <>
            {/* Enhanced Products Count */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-beige-200/50"
            >
              <span className="text-2xl font-bold text-earth-700">
                🌾 {sortedProducts.length} Fresh Products Found
              </span>
            </motion.div>

            {/* Enhanced Products Grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
            >
              {sortedProducts.map((product, index) => (
                <motion.div 
                  key={product._id} 
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -15, 
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative bg-gradient-to-br from-white/98 to-beige-50/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-beige-200/60 hover:shadow-3xl hover:border-beige-300/80 transition-all duration-700 overflow-hidden"
                >
                  {/* Enhanced Premium Badge */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                    className="absolute top-4 left-4 z-20"
                  >
                    <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg border border-green-400/50 backdrop-blur-sm">
                      <span className="flex items-center space-x-1">
                        <span>✅</span>
                        <span>ORGANIC</span>
                      </span>
                    </div>
                  </motion.div>

                  {/* Enhanced Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100/30 to-beige-100/30 rounded-t-3xl overflow-hidden">
                    <motion.img 
                      src={product.images?.[0] || '/placeholder.jpg'} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.15
                      }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                    
                    {/* Enhanced Favorite Button */}
                    <motion.button
                      onClick={() => handleToggleFavorite(product)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 backdrop-blur-lg shadow-2xl z-20 border-2 ${
                        favorites.has(product._id) 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-400/50' 
                          : 'bg-white/95 border-amber-200/70 text-amber-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      {favorites.has(product._id) ? (
                        <HeartIconSolid className="h-6 w-6" />
                      ) : (
                        <HeartIcon className="h-6 w-6" />
                      )}
                    </motion.button>

                    {/* Enhanced Quick Actions Overlay */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 backdrop-blur-sm"
                    >
                      <motion.button
                        onClick={(e) => quickAddToCart(product, e)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full hover:from-amber-600 hover:to-orange-700 hover:shadow-2xl transition-all duration-300"
                      >
                        <ShoppingCartIcon className="h-6 w-6" />
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Enhanced Product Info */}
                  <motion.div 
                    className="p-8 space-y-6 relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <div className="relative z-10">
                      <motion.h3 
                        className="font-black text-earth-800 text-2xl mb-3 line-clamp-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        {product.name}
                      </motion.h3>
                      
                      <div className="flex items-center space-x-3 mb-6">
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center bg-gradient-to-r from-sage-400/30 to-earth-400/30 backdrop-blur-lg border border-sage-400/40 text-earth-800 text-sm px-4 py-2 rounded-full font-bold shadow-lg"
                        >
                          🌿 {product.category}
                        </motion.span>
                      </div>
                    </div>

                    {/* Enhanced Rating */}
                    <motion.div 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                    >
                      <div className="flex items-center bg-gradient-to-r from-yellow-400/30 to-orange-400/30 backdrop-blur-lg px-4 py-2 rounded-full shadow-xl">
                        {[...Array(5)].map((_, i) => (
                          <StarIconSolid key={i} className="h-4 w-4 text-yellow-500" />
                        ))}
                      </div>
                      <span className="text-earth-800 font-black text-lg">4.9</span>
                    </motion.div>

                    {/* Enhanced Price */}
                    <motion.div 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.8 }}
                    >
                      <div className="space-y-2">
                        <motion.span 
                          className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600"
                          whileHover={{ scale: 1.05 }}
                        >
                          ₹{product.price}
                        </motion.span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
                          <span className="text-sm text-green-700 font-bold">✅ In Stock</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Enhanced Add to Cart Button */}
                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      disabled={quickAddAnimation === product._id}
                      whileHover={{ scale: 1.02, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center px-8 py-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black rounded-2xl hover:from-amber-600 hover:via-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl text-lg"
                    >
                      {quickAddAnimation === product._id ? (
                        <div className="flex items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <SparklesIcon className="h-7 w-7 mr-3" />
                          </motion.div>
                          ✨ Adding...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <ShoppingCartIcon className="h-7 w-7 mr-3" />
                          🛒 Add to Cart
                        </div>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default Marketplace;
