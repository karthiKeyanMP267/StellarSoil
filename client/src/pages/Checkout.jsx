import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/api';
import PaymentForm from '../components/PaymentForm';
import OrderSummary from '../components/OrderSummary';
import { 
  ShoppingBagIcon, 
  CreditCardIcon, 
  ArrowLeftIcon, 
  ShieldCheckIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [order, setOrder] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await API.get('/cart');
      // Flatten all items from all carts
      const carts = response.data;
      const allItems = carts.flatMap(cart =>
        cart.items.map(item => ({
          cartId: cart._id,
          product: item.product,
          quantity: item.quantity,
          farmName: cart.farm?.name || '',
        }))
      );
      
      // Process cart data
      setCart({
        _id: carts.length > 0 ? carts[0]._id : 'unknown',
        items: allItems,
        total: allItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      });
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.response?.data?.msg || 'Error fetching cart');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (orderData) => {
    setOrder(orderData);
    setOrderCreated(true);
    setShowSummary(true); // Show the order summary modal
    
    // For COD, the modal will show the verification code
    // For other payment methods, we'll still show the summary but set a timeout to navigate after closing
    if (orderData.paymentMethod !== 'cod') {
      // We'll let the user manually close the summary now, instead of auto-navigating
      // They can view order details later from the order history page
    }
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewOrder = () => {
    navigate(`/orders/${order._id}`);
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    // Optional: navigate to order details after closing summary
    if (order && order._id) {
      navigate(`/orders/${order._id}`);
    }
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
            <div className="w-16 h-16 border-4 border-beige-300 border-t-amber-500 rounded-full shadow-lg"></div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ShoppingBagIcon className="w-6 h-6 text-amber-600" />
            </motion.div>
          </motion.div>
          <h3 className="text-lg font-semibold text-amber-700 mb-2">Loading Checkout</h3>
          <p className="text-amber-600">Preparing your order details...</p>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20 flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-red-200 p-8 max-w-lg"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-800">Error</h2>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/cart"
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Return to Cart
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20 flex items-center justify-center"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 max-w-lg"
        >
          <div className="mb-8 flex justify-center">
            <div className="p-6 bg-amber-100 rounded-full">
              <ShoppingBagIcon className="h-16 w-16 text-amber-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-amber-800">Your cart is empty</h2>
          <p className="mb-8 text-amber-700 text-lg">Add some products to your cart before checking out.</p>
          
          <Link
            to="/marketplace"
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg inline-flex items-center"
          >
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            Browse Products
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // Order Success Modal with Order Summary
  if (orderCreated && order) {
    return (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-200 p-8 max-w-lg w-full"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6">
                <motion.svg 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <motion.path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </motion.svg>
              </div>
              
              <h2 className="text-3xl font-bold text-green-800 mb-2">Order Successful!</h2>
              <p className="text-green-700 mb-4">Your order has been placed successfully.</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowSummary(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg"
              >
                View Order Summary
              </button>
              
              <button
                onClick={handleViewOrder}
                className="w-full px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Go to Order Details
              </button>
              
              <Link
                to="/"
                className="w-full px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Return to Home
              </Link>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Order Summary Modal */}
        <AnimatePresence>
          {showSummary && (
            <OrderSummary order={order} onClose={handleCloseSummary} />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-white via-beige-50 to-cream-100 pt-20 pb-20 relative overflow-hidden"
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
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/cart"
            className="inline-flex items-center text-amber-700 hover:text-amber-600 transition-colors font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Cart
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center space-x-6 mb-12"
        >
          <div className="relative group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl shadow-2xl group-hover:shadow-amber-500/30 transition-all duration-500"
            >
              <CreditCardIcon className="h-12 w-12 text-white drop-shadow-lg" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          </div>
          <div className="space-y-3">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent tracking-tight drop-shadow-2xl"
            >
              Checkout
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-amber-600 text-2xl font-semibold tracking-wide drop-shadow-sm"
            >
              Complete your purchase
            </motion.p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 lg:order-2 space-y-8"
          >
            <div className="bg-gradient-to-br from-white/98 to-beige-50/95 backdrop-blur-2xl rounded-3xl shadow-3xl border border-beige-200/50 p-8 hover:shadow-4xl transition-all duration-500 sticky top-28">
              {/* Header Glow Effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-t-3xl"></div>
              
              <h2 className="text-2xl font-bold mb-6 text-amber-800 flex items-center">
                <ShoppingBagIcon className="h-6 w-6 mr-3 text-amber-700" />
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-6 mb-6">
                {cart.items.map((item, index) => (
                  <div key={`${item.cartId}-${item.product._id}`} className="flex items-start space-x-4 pb-4 border-b border-amber-100 last:border-0 last:pb-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image || '/placeholder.jpg'} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-amber-900 font-medium">{item.product.name}</h3>
                      <p className="text-sm text-amber-700">
                        {item.quantity} {item.product.unit} 
                        {item.farmName && <span className="ml-2">from {item.farmName}</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-amber-800">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-3 pt-4 border-t border-amber-200">
                <div className="flex justify-between text-amber-700">
                  <span>Subtotal</span>
                  <span>₹{cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Discount</span>
                  <span>-₹{(cart.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-amber-200 text-amber-900">
                  <span>Total</span>
                  <span>₹{(cart.total * 0.9).toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-amber-200">
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-6 w-6 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TruckIcon className="h-6 w-6 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">Fast Delivery</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                <div className="flex items-start space-x-3">
                  <QuestionMarkCircleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-700">
                      If you choose Cash on Delivery, a verification code will be sent to your phone. 
                      The farmer will verify this code upon delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 lg:order-1"
          >
            <PaymentForm
              cart={cart}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;


