import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,  // Replacing CashIcon with CurrencyDollarIcon
  CreditCardIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import API from './api/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed', 'cancelled'

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/orders/my-orders');
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Could not load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    };
    
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'active':
        return orders.filter(order => 
          !['delivered', 'cancelled'].includes(order.orderStatus)
        );
      case 'completed':
        return orders.filter(order => order.orderStatus === 'delivered');
      case 'cancelled':
        return orders.filter(order => order.orderStatus === 'cancelled');
      default:
        return orders;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Placed
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Processing
          </span>
        );
      case 'packed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <ShoppingBagIcon className="h-3 w-3 mr-1" />
            Packed
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Ready
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <TruckIcon className="h-3 w-3 mr-1" />
            Out for Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
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
          <h3 className="text-lg font-semibold text-amber-700 mb-2">Loading Orders</h3>
          <p className="text-amber-600">Retrieving your order history...</p>
        </motion.div>
      </motion.div>
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
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center space-x-6 mb-12"
        >
          <div className="relative group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl shadow-2xl group-hover:shadow-amber-500/30 transition-all duration-500"
            >
              <ShoppingBagIcon className="h-12 w-12 text-white drop-shadow-lg" />
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
              My Orders
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-amber-600 text-2xl font-semibold tracking-wide drop-shadow-sm"
            >
              Track and manage your purchases
            </motion.p>
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
        
        {/* Order Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 border-b border-amber-200"
        >
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('all')}
              className={`pb-4 px-2 text-lg font-medium relative ${
                activeTab === 'all' ? 'text-amber-700' : 'text-gray-500 hover:text-amber-600'
              }`}
            >
              All Orders
              {activeTab === 'all' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-t-md"
                />
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab('active')}
              className={`pb-4 px-2 text-lg font-medium relative ${
                activeTab === 'active' ? 'text-amber-700' : 'text-gray-500 hover:text-amber-600'
              }`}
            >
              Active
              {activeTab === 'active' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-t-md"
                />
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab('completed')}
              className={`pb-4 px-2 text-lg font-medium relative ${
                activeTab === 'completed' ? 'text-amber-700' : 'text-gray-500 hover:text-amber-600'
              }`}
            >
              Completed
              {activeTab === 'completed' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-t-md"
                />
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab('cancelled')}
              className={`pb-4 px-2 text-lg font-medium relative ${
                activeTab === 'cancelled' ? 'text-amber-700' : 'text-gray-500 hover:text-amber-600'
              }`}
            >
              Cancelled
              {activeTab === 'cancelled' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-t-md"
                />
              )}
            </button>
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {getFilteredOrders().length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBagIcon className="h-16 w-16 text-amber-400 mx-auto mb-4 opacity-60" />
              <h3 className="text-2xl font-bold text-amber-800 mb-2">No orders found</h3>
              <p className="text-amber-600 mb-8">
                {activeTab === 'all' ? "You haven't placed any orders yet." :
                 activeTab === 'active' ? "You don't have any active orders." :
                 activeTab === 'completed' ? "You don't have any completed orders." :
                 "You don't have any cancelled orders."}
              </p>
              <Link
                to="/marketplace"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg inline-flex items-center"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {getFilteredOrders().map(order => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-br from-white/98 to-beige-50/95 backdrop-blur-2xl rounded-3xl shadow-xl border border-beige-200/50 p-6 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-lg font-bold text-amber-800 mr-3">
                          Order #{order._id.toString().slice(-6)}
                        </span>
                        {getStatusBadge(order.orderStatus)}
                      </div>
                      <div className="flex flex-wrap items-center text-sm text-gray-600 gap-3">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="flex items-center">
                          {order.paymentMethod === 'cod' ? (
                            <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          ) : (
                            <CreditCardIcon className="h-4 w-4 mr-1" />
                          )}
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                           order.paymentMethod === 'card' ? 'Card' :
                           order.paymentMethod === 'upi' ? 'UPI' : order.paymentMethod}
                        </div>
                        {order.paymentMethod === 'cod' && order.verificationCode && !order.deliveryVerification?.verified && (
                          <div className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-md">
                            Verification Required
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Link
                      to={`/orders/${order._id}`}
                      className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg text-sm font-medium"
                    >
                      Track Order
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Order Items Summary */}
                    <div className="md:col-span-2 flex flex-col">
                      <h3 className="text-sm font-medium text-amber-700 mb-3">Items</h3>
                      <div className="flex-1 space-y-2">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                              {item.product.image ? (
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ShoppingBagIcon className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{item.product.name}</p>
                              <p className="text-xs text-gray-500">{item.quantity} {item.unit || 'pcs'}</p>
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-sm text-amber-700">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Order Total */}
                    <div className="bg-amber-50 rounded-xl p-4 flex flex-col justify-between">
                      <h3 className="text-sm font-medium text-amber-700 mb-3">Summary</h3>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-800">₹{order.totalAmount + (order.discount || 0)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Discount</span>
                            <span className="text-green-600">-₹{order.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium text-amber-800 mt-2 pt-2 border-t border-amber-200">
                          <span>Total</span>
                          <span>₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrdersPage;