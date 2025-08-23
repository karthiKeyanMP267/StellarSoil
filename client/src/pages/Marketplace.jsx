import React, { useState, useEffect } from 'react';
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
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showQuickView, setShowQuickView] = useState(null);
  const [cartItems, setCartItems] = useState(new Set());
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
      setProducts(res.data);
    } catch (err) {
      setError('Error loading products');
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

  const showToastMessage = (message, duration = 2000) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), duration);
  };

  const handleAddToCart = async (product) => {
    try {
      setQuickAddAnimation(product._id);
      await API.post('/cart/add', { productId: product._id, quantity: 1 });
      setCartItems(prev => new Set([...prev, product._id]));
      showToastMessage('🎉 Added to cart successfully! 🛒');
      setTimeout(() => setQuickAddAnimation(null), 1000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToastMessage('❌ Failed to add to cart. Please try again.');
      setQuickAddAnimation(null);
    }
  };

  const quickAddToCart = async (product, event) => {
    event.stopPropagation();
    await handleAddToCart(product);
  };

  const handleToggleFavorite = async (product) => {
    try {
      if (favorites.has(product._id)) {
        await API.delete(`/favorites/remove/${product._id}`);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(product._id);
          return newSet;
        });
        showToastMessage('Removed from favorites');
      } else {
        await API.post('/favorites/add', { productId: product._id });
        setFavorites(prev => new Set([...prev, product._id]));
        showToastMessage('Added to favorites! ❤️');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      showToastMessage('Failed to update favorites');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/products/search', { params: filters });
      setProducts(res.data);
    } catch (err) {
      setError('Error searching products');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ query: '', category: '', minPrice: '', maxPrice: '' });
    fetchAllProducts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-50 pt-20 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 text-white px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 animate-bounce backdrop-blur-sm border border-amber-200/30 max-w-sm">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-6 w-6 animate-spin" />
            <span className="font-bold text-lg">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Enhanced Header with Animation */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <SunIcon className="h-32 w-32 text-yellow-300/20 animate-spin-slow" />
          </div>
          <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-amber-700 to-orange-600 mb-8 tracking-tight drop-shadow-2xl relative z-10 animate-pulse">
            🌾 Farm Fresh Marketplace 🌾
          </h1>
          <p className="text-2xl text-amber-800 max-w-4xl mx-auto font-bold tracking-wide leading-relaxed mb-8 relative z-10">
            ✨ Premium organic produce from certified local farms ✨
          </p>
          
          {/* Stats Bar */}
          <div className="flex justify-center space-x-12 mb-8">
            <div className="text-center">
              <div className="text-3xl font-black text-amber-700">500+</div>
              <div className="text-sm font-medium text-amber-600">Fresh Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-amber-700">50+</div>
              <div className="text-sm font-medium text-amber-600">Local Farms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-amber-700">10K+</div>
              <div className="text-sm font-medium text-amber-600">Happy Customers</div>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="flex justify-center flex-wrap gap-4 mb-8">
            <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-400/20 to-orange-400/20 backdrop-blur-lg border border-amber-400/30 text-amber-800 rounded-full font-bold shadow-xl">
              <CheckBadgeIcon className="h-5 w-5 mr-2" />
              Certified Organic
            </span>
            <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 backdrop-blur-lg border border-orange-400/30 text-orange-800 rounded-full font-bold shadow-xl">
              <TruckIcon className="h-5 w-5 mr-2" />
              Same Day Delivery
            </span>
            <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-lg border border-amber-400/30 text-amber-800 rounded-full font-bold shadow-xl">
              <GiftIcon className="h-5 w-5 mr-2" />
              Best Price Guarantee
            </span>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-yellow-200/50 p-12 mb-16 hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-amber-500/5"></div>
          
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center space-x-4">
              <AdjustmentsHorizontalIcon className="h-8 w-8 text-amber-600" />
              <h3 className="text-2xl font-black text-amber-900 tracking-wide">Find Your Perfect Produce</h3>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-amber-100/50 p-2 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-amber-500 text-white shadow-lg' : 'text-amber-600 hover:bg-amber-200'}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-amber-500 text-white shadow-lg' : 'text-amber-600 hover:bg-amber-200'}`}
              >
                <ViewColumnsIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {/* Enhanced Search Input */}
              <div className="md:col-span-3 relative group">
                <MagnifyingGlassIcon className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 group-focus-within:text-amber-800 transition-colors" />
                <input
                  type="text"
                  placeholder="🔍 Search for organic vegetables, fresh fruits..."
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-900 placeholder-amber-600 focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-lg font-medium shadow-inner"
                />
              </div>

              {/* Category Filter */}
              <div className="relative group">
                <FunnelIcon className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 group-focus-within:text-amber-800 transition-colors z-10" />
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-900 focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 appearance-none transition-all text-lg font-medium shadow-inner"
                >
                  <option value="">🌱 All Categories</option>
                  <option value="Vegetables">🥕 Vegetables</option>
                  <option value="Fruits">🍎 Fresh Fruits</option>
                  <option value="Leafy Vegetables">🥬 Leafy Greens</option>
                  <option value="Dairy">🥛 Dairy Products</option>
                  <option value="Grains">🌾 Organic Grains</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-900 focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 appearance-none transition-all text-lg font-medium shadow-inner"
                >
                  <option value="featured">✨ Featured</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💎 Price: High to Low</option>
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="newest">🆕 Newest First</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="relative">
                <input
                  type="number"
                  placeholder="₹ Min Price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-900 placeholder-amber-600 focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-lg font-medium shadow-inner"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-6 justify-center">
              <button
                type="submit"
                className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 text-white font-black rounded-2xl hover:from-yellow-700 hover:via-amber-700 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 focus:ring-offset-2 transition-all duration-300 hover:scale-110 shadow-2xl tracking-wide drop-shadow-lg text-xl group"
              >
                <BoltIcon className="h-7 w-7 mr-4 drop-shadow-md group-hover:animate-pulse" />
                🚀 Search Products
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center px-10 py-5 bg-white/90 backdrop-blur-lg border-2 border-amber-300/50 text-amber-800 font-black rounded-2xl hover:bg-white/95 hover:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/50 focus:ring-offset-2 transition-all duration-300 shadow-xl tracking-wide hover:scale-110 text-xl"
              >
                ✨ Clear All Filters
              </button>
            </div>
          </form>
        </div>

        {/* Enhanced Products Section */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-8 border-amber-200 border-t-amber-600 shadow-2xl"></div>
              <ShoppingCartIcon className="absolute inset-0 h-12 w-12 m-auto text-amber-600 animate-pulse" />
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black text-amber-800 animate-pulse">🌾 Loading Fresh Products...</h3>
              <p className="text-lg text-amber-600 font-medium">Fetching the best organic produce just for you!</p>
              <div className="flex space-x-2 justify-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center bg-gradient-to-br from-red-50/90 to-red-100/90 backdrop-blur-sm border-2 border-red-300/50 rounded-3xl p-16 shadow-2xl">
            <div className="p-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-2xl">
              <ShoppingCartIcon className="h-16 w-16 text-white drop-shadow-lg" />
            </div>
            <h3 className="text-3xl font-black text-red-800 mb-6">⚠️ Oops! Something went wrong</h3>
            <p className="text-xl text-red-700 mb-8 font-medium">{error}</p>
            <p className="text-lg text-red-600 mb-8">Don't worry! Let's try loading those fresh products again.</p>
            <button
              onClick={fetchAllProducts}
              className="px-10 py-5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:scale-110 font-black text-xl shadow-2xl"
            >
              🔄 Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-2 border-amber-200/30 rounded-3xl p-16 shadow-2xl">
            <div className="relative mb-8">
              <ShoppingCartIcon className="h-32 w-32 text-amber-600 mx-auto opacity-50" />
              <SparklesIcon className="h-12 w-12 text-yellow-500 absolute -top-2 -right-2 animate-ping" />
            </div>
            <h3 className="text-3xl font-black text-amber-800 mb-6">🔍 No products found</h3>
            <p className="text-xl text-amber-700 mb-8 font-medium">We couldn't find any products matching your criteria.</p>
            <p className="text-lg text-amber-600 mb-8">Try adjusting your filters or check back later for fresh arrivals!</p>
            <button
              onClick={clearFilters}
              className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-110 font-black text-xl shadow-2xl"
            >
              🌟 Show All Products
            </button>
          </div>
        ) : (
          <>
            {/* Products Count and Sorting */}
            <div className="flex justify-between items-center mb-8 bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-amber-200/30">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-black text-amber-900">
                  🌾 {products.length} Fresh Products Found
                </span>
                <span className="bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-800 px-4 py-2 rounded-full text-sm font-bold border border-amber-400/30">
                  ✅ All Verified Organic
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FireIcon className="h-6 w-6 text-orange-500 animate-pulse" />
                <span className="text-lg font-bold text-orange-600">Trending Now!</span>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10' : 'space-y-8'}`}>
              {products.map((product) => (
                <div key={product._id} className={`group relative bg-gradient-to-br from-white/98 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/40 hover:shadow-3xl transition-all duration-700 hover:scale-105 overflow-hidden transform ${quickAddAnimation === product._id ? 'animate-pulse ring-4 ring-amber-400' : ''}`}>
                  {/* Premium Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                      ✅ ORGANIC
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100/30 to-gray-200/30 rounded-t-3xl overflow-hidden group-hover:bg-gradient-to-br group-hover:from-yellow-100/30 group-hover:to-amber-100/30 transition-all duration-500">
                    <img 
                      src={product.images?.[0] || '/placeholder.jpg'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/30"></div>
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 backdrop-blur-sm">
                      <div className="flex space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowQuickView(product);
                          }}
                          className="p-4 bg-white/90 backdrop-blur-lg text-amber-700 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-2xl"
                        >
                          <EyeIcon className="h-6 w-6" />
                        </button>
                        <button
                          onClick={(e) => quickAddToCart(product, e)}
                          className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full hover:from-amber-600 hover:to-orange-700 hover:scale-110 transition-all duration-300 shadow-2xl"
                        >
                          <ShoppingCartIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => handleToggleFavorite(product)}
                      className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 backdrop-blur-lg shadow-2xl z-20 ${
                        favorites.has(product._id) 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white scale-110 animate-pulse' 
                          : 'bg-white/95 border-2 border-amber-200 text-amber-600 hover:bg-red-50 hover:text-red-500 hover:border-red-300 hover:scale-110'
                      }`}
                    >
                      {favorites.has(product._id) ? (
                        <HeartIconSolid className="h-6 w-6 drop-shadow-md" />
                      ) : (
                        <HeartIcon className="h-6 w-6 drop-shadow-md" />
                      )}
                    </button>

                    {/* Discount Badge */}
                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-black shadow-lg">
                      🔥 15% OFF
                    </div>
                  </div>

                  {/* Enhanced Product Info */}
                  <div className="p-8 space-y-6">
                    <div>
                      <h3 className="font-black text-amber-900 text-2xl mb-2 group-hover:text-amber-800 transition-colors tracking-wide drop-shadow-sm line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="inline-block bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-lg border border-amber-400/40 text-amber-800 text-sm px-4 py-2 rounded-full font-bold tracking-wide shadow-lg">
                          {product.category}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">Farm Fresh</span>
                      </div>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-gradient-to-r from-yellow-400/30 to-orange-400/30 backdrop-blur-lg px-3 py-2 rounded-full shadow-xl">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid key={i} className="h-4 w-4 text-yellow-500" />
                          ))}
                        </div>
                        <span className="text-amber-800 font-bold tracking-wide">4.9</span>
                        <span className="text-gray-600 text-sm">(234 reviews)</span>
                      </div>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 tracking-tight drop-shadow-lg">
                            ₹{product.price}
                          </span>
                          <span className="text-lg text-gray-500 line-through">₹{Math.round(product.price * 1.15)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-amber-700 font-bold">In Stock</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">Per kg</div>
                        <div className="flex items-center space-x-1">
                          <TruckIcon className="h-4 w-4 text-orange-600" />
                          <span className="text-xs text-orange-600 font-medium">Free Delivery</span>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={quickAddAnimation === product._id}
                      className={`w-full flex items-center justify-center px-8 py-5 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 text-white font-black rounded-2xl hover:from-amber-700 hover:via-yellow-700 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-amber-500/50 focus:ring-offset-2 transition-all duration-300 hover:scale-105 shadow-2xl group-hover:shadow-amber-500/40 tracking-wide drop-shadow-lg text-lg ${quickAddAnimation === product._id ? 'animate-pulse' : ''}`}
                    >
                      {quickAddAnimation === product._id ? (
                        <>
                          <SparklesIcon className="h-7 w-7 mr-3 animate-spin" />
                          ✨ Adding to Cart...
                        </>
                      ) : (
                        <>
                          <ShoppingCartIcon className="h-7 w-7 mr-3 drop-shadow-md group-hover:animate-bounce" />
                          🛒 Add to Cart
                        </>
                      )}
                    </button>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-200/50">
                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-1">Origin</div>
                        <div className="text-sm font-bold text-amber-800">Local Farm</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-1">Harvest</div>
                        <div className="text-sm font-bold text-amber-800">Fresh Today</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Marketplace;