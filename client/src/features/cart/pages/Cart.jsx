import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import {
  TrashIcon,
  ShoppingBagIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  TruckIcon,
  CheckBadgeIcon,
  CreditCardIcon,
  GiftIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Cart = () => {
  const { t } = useTranslation();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchCart();
    
    // Listen for cart update events from the chatbot
    const handleCartUpdate = () => {
      console.log('Cart updated event received, fetching cart...');
      fetchCart();
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  const fetchCart = async () => {
    try {
      const response = await API.get('/cart');
      // Flatten all items from all carts
      const carts = response.data;
      const allItems = carts.flatMap(cart =>
        cart.items.map(item => ({
          cartId: cart._id,
          productId: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price || item.price,
          unit: item.product.unit,
          quantity: item.quantity,
          farmName: cart.farm?.name || '',
        }))
      );
      setCart(allItems);
      setError('');
    } catch (err) {
      console.error('Cart fetch error:', err);
      if (err.message.includes('Network Error') || err.message.includes('Connection refused')) {
        // Use local storage as fallback if API is not available
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            // Transform the saved cart format to match the expected format
            const localCartItems = parsedCart.map(item => ({
              cartId: 'local',
              productId: item.id,
              name: item.name,
              image: item.image || '/images/product-generic.svg',
              price: item.price || 0,
              unit: item.unit || 'kg',
              quantity: item.quantity || 1,
              farmName: item.farmerName || 'Local Farm',
            }));
            setCart(localCartItems);
            setError('Using cached cart data. Server connection unavailable.');
          } catch (parseError) {
            console.error('Error parsing local cart:', parseError);
            setError('Error loading cart. Server unavailable and no cached data found.');
            setCart([]);
          }
        } else {
          setError('Server connection unavailable. No cached cart data found.');
          setCart([]);
        }
      } else {
        setError('Error loading cart: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartId, productId);
      return;
    }

    try {
      // If cartId is 'local', we're working with localStorage data
      if (cartId === 'local') {
        // Update the cart items in state
        setCart(prevCart =>
          prevCart.map(item =>
            item.cartId === cartId && item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        
        // Also update localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            const updatedCart = parsedCart.map(item => 
              item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedCart));
          } catch (error) {
            console.error('Error updating localStorage cart:', error);
          }
        }
      } else {
        // Try to update on the server
        await API.put(`/cart/${cartId}/items/${productId}`, {
          quantity: newQuantity
        });
        setCart(prevCart =>
          prevCart.map(item =>
            item.cartId === cartId && item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      
      // Even if API fails, update the local state
      setCart(prevCart =>
        prevCart.map(item =>
          item.cartId === cartId && item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      
      setError('Server connection error. Changes saved locally.');
    }
  };

  const removeFromCart = async (cartId, productId) => {
    try {
      // If cartId is 'local', we're working with localStorage data
      if (cartId === 'local') {
        // Remove from state
        setCart(prevCart =>
          prevCart.filter(item => !(item.cartId === cartId && item.productId === productId))
        );
        
        // Also update localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            const updatedCart = parsedCart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
          } catch (error) {
            console.error('Error updating localStorage cart:', error);
          }
        }
      } else {
        // Try to remove on the server
        await API.delete(`/cart/${cartId}/items/${productId}`);
        setCart(prevCart =>
          prevCart.filter(item => !(item.cartId === cartId && item.productId === productId))
        );
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      
      // Even if API fails, update the local state
      setCart(prevCart =>
        prevCart.filter(item => !(item.cartId === cartId && item.productId === productId))
      );
      
      setError('Server connection error. Changes saved locally.');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20 flex items-center justify-center"
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="relative mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 border-4 border-beige-300 border-t-sage-500 rounded-full shadow-lg"></div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ShoppingBagIcon className="w-6 h-6 text-beige-600" />
            </motion.div>
          </motion.div>
          <h3 className="text-lg font-semibold text-beige-700 mb-2">{t('cart.loadingCart')}</h3>
          <p className="text-beige-600">{t('cart.gatheringSelections')}</p>
        </motion.div>
      </motion.div>
    );
  }

  // Main render
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-white via-beige-50 to-cream-100 pt-20 relative overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 left-20 w-96 h-96 bg-gradient-to-r from-beige-400/20 to-cream-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-r from-sage-400/20 to-earth-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-60 right-1/3 w-64 h-64 bg-gradient-to-r from-cream-400/20 to-beige-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-white/98 to-beige-50/95 backdrop-blur-2xl rounded-3xl shadow-3xl border border-beige-200/50 p-12 hover:shadow-4xl transition-all duration-500 relative overflow-hidden"
        >
          {/* Header Glow Effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-beige-500 via-cream-500 to-sage-500 rounded-t-3xl"></div>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center space-x-6 mb-16"
          >
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-6 bg-gradient-to-r from-earth-500 to-sage-600 rounded-3xl shadow-2xl group-hover:shadow-earth-500/30 transition-all duration-500"
              >
                <ShoppingBagIcon className="h-12 w-12 text-white drop-shadow-lg" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-earth-500/20 to-sage-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </div>
            <div className="space-y-3">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-earth-700 via-sage-600 to-earth-700 bg-clip-text text-transparent tracking-tight drop-shadow-2xl"
              >
                🛒 {t('cart.title')}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-earth-600 text-2xl font-semibold tracking-wide drop-shadow-sm"
              >
                {t('cart.reviewProduce')}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex items-center space-x-4 text-lg"
              >
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-beige-400/20 to-cream-400/20 text-earth-700 rounded-full border border-beige-300/50 font-semibold">
                  <CheckBadgeIcon className="h-5 w-5 mr-2" />
                  ✅ {t('cart.farmVerified')}
                </span>
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sage-400/20 to-earth-400/20 text-earth-700 rounded-full border border-sage-300/50 font-semibold">
                  <TruckIcon className="h-5 w-5 mr-2" />
                  🚚 {t('cart.freeDelivery')}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                <span className="text-red-700 font-semibold">{error}</span>
              </div>
            </motion.div>
          )}

          {cart.length === 0 ? (
            <div className="text-center py-24">
              <div className="relative mb-12">
                <div className="p-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full w-32 h-32 mx-auto flex items-center justify-center shadow-2xl animate-bounce-gentle">
                  <ShoppingBagIcon className="h-16 w-16 text-white drop-shadow-lg" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-600/30 rounded-full blur-2xl animate-pulse"></div>
              </div>
              <h3 className="text-5xl font-black text-amber-800 mb-6 animate-pulse">🛒 {t('cart.empty')}</h3>
              <p className="text-amber-700 mb-12 max-w-2xl mx-auto text-2xl font-medium leading-relaxed">
                🌱 {t('cart.emptyCartMessage')}
              </p>
              <Link
                to="/marketplace"
                className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black rounded-2xl shadow-2xl hover:from-amber-600 hover:via-orange-600 hover:to-red-600 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2 hover:scale-110 text-xl tracking-wide group"
              >
                <ShoppingBagIcon className="h-8 w-8 mr-4 group-hover:animate-bounce" />
                🌟 {t('cart.exploreProducts')}
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items Section */}
              <div className="space-y-8 mb-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-amber-900">🛍️ {t('cart.yourItems')} ({cart.length})</h2>
                  <div className="flex items-center space-x-3">
                    <GiftIcon className="h-6 w-6 text-purple-600 animate-pulse" />
                    <span className="text-lg font-bold text-purple-600">{t('cart.freeGift')}</span>
                  </div>
                </div>

                {cart.map((item, index) => (
                  <div key={`${item.cartId}-${item.productId}`} className="group bg-gradient-to-br from-white/98 to-white/90 rounded-3xl shadow-xl border border-amber-200/40 p-8 hover:shadow-2xl transition-all duration-500 hover:scale-102 relative overflow-hidden">
                    {/* Premium Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                      ✅ {t('cart.organic')}
                    </div>
                    
                    <div className="flex items-center space-x-8">
                      {/* Enhanced Product Image */}
                      <div className="relative">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-amber-500/30 transition-all duration-500">
                          <img
                            src={item.image || '/images/product-generic.svg'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-500"></div>
                        </div>
                        {/* Stock indicator */}
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white p-2 rounded-full shadow-lg">
                          <CheckBadgeIcon className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-2xl font-black text-amber-900 group-hover:text-amber-800 transition-colors tracking-wide drop-shadow-sm">
                            {item.name}
                          </h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <p className="text-lg text-amber-600 font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3 py-1 rounded-full border border-amber-400/30">
                              🏡 {item.farmName}
                            </p>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIconSolid key={i} className="h-4 w-4 text-yellow-500" />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">(4.9)</span>
                            </div>
                          </div>
                        </div>

                        {/* Price and Savings */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 tracking-tight drop-shadow-lg">
                              ₹{item.price}
                            </span>
                            <span className="text-lg text-gray-500 line-through">₹{Math.round(item.price * 1.2)}</span>
                            <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                              20% OFF
                            </span>
                          </div>
                          <p className="text-amber-700 font-medium">{t('cart.perUnit')} {item.unit}</p>
                          <div className="flex items-center space-x-2 text-sm">
                            <TruckIcon className="h-4 w-4 text-orange-600" />
                            <span className="text-orange-600 font-medium">{t('cart.freeDeliveryArrives')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center space-y-6">
                        <div className="flex items-center space-x-4 bg-gradient-to-r from-amber-100/50 to-orange-100/50 backdrop-blur-lg p-4 rounded-2xl border border-amber-200/50">
                          <button
                            onClick={() => updateQuantity(item.cartId, item.productId, item.quantity - 1)}
                            className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 hover:scale-110 shadow-lg"
                          >
                            <MinusIcon className="h-5 w-5" />
                          </button>
                          <span className="text-2xl font-black text-amber-900 w-12 text-center bg-white px-4 py-2 rounded-xl shadow-inner">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartId, item.productId, item.quantity + 1)}
                            className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 hover:scale-110 shadow-lg"
                          >
                            <PlusIcon className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <button className="p-3 bg-gradient-to-r from-pink-500/20 to-red-500/20 text-pink-700 rounded-xl hover:from-pink-500/30 hover:to-red-500/30 transition-all duration-300 hover:scale-110 border border-pink-400/30">
                            <HeartIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.cartId, item.productId)}
                            className="p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 rounded-xl hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 hover:scale-110 border border-red-400/30"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-center bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-3 rounded-xl border border-amber-400/30">
                          <div className="text-sm text-amber-700 font-medium">{t('cart.itemTotal')}</div>
                          <div className="text-xl font-black text-amber-800">₹{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Cart Summary */}
              <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-xl rounded-3xl p-10 border-2 border-amber-200/50 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-t-3xl"></div>
                
                {/* Summary Header */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-xl">
                    <CreditCardIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-amber-900">💰 {t('cart.orderSummary')}</h3>
                    <p className="text-amber-700 font-medium">{t('cart.reviewTotal')}</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-amber-800 font-medium">{t('cart.subtotal')} ({cart.length} {t('cart.items')})</span>
                    <span className="font-bold text-amber-900">₹{(getTotalPrice() * 1.2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-amber-700 font-medium">{t('cart.savings')}</span>
                    <span className="font-bold text-amber-700">-₹{(getTotalPrice() * 0.2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-orange-700 font-medium">{t('cart.delivery')}</span>
                    <span className="font-bold text-orange-700">{t('cart.shipping')} 🚚</span>
                  </div>
                  <div className="border-t-2 border-amber-300/50 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-black text-amber-800">{t('cart.totalAmount')}</span>
                      <span className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">
                        ₹{getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link
                    to="/marketplace"
                    className="flex items-center justify-center py-5 px-8 bg-gradient-to-r from-amber-400/80 to-orange-500/80 backdrop-blur-lg border border-amber-300/50 text-amber-900 font-black rounded-2xl hover:from-amber-500/80 hover:to-orange-600/80 transition-all duration-300 text-xl tracking-wide hover:scale-105 shadow-xl"
                  >
                    🛍️ {t('cart.continueShopping')}
                  </Link>
                  <Link
                    to="/checkout"
                    className="flex items-center justify-center py-5 px-8 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-black rounded-2xl shadow-2xl hover:from-amber-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 text-xl tracking-wide group"
                  >
                    <CreditCardIcon className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                    🚀 {t('cart.checkout')}
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-amber-300/50">
                  <div className="text-center">
                    <CheckBadgeIcon className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <div className="text-sm font-bold text-amber-800">{t('cart.trustOrganic')}</div>
                  </div>
                  <div className="text-center">
                    <TruckIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm font-bold text-orange-800">{t('cart.trustDelivery')}</div>
                  </div>
                  <div className="text-center">
                    <GiftIcon className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <div className="text-sm font-bold text-amber-800">{t('cart.trustGuarantee')}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
