import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import API from '../api/api';
import OrderTracker from '../components/OrderTracker';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regeneratingCode, setRegeneratingCode] = useState(false);
  const [regenerateSuccess, setRegenerateSuccess] = useState(false);
  const [newCode, setNewCode] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/api/orders/${orderId}`);
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.msg || 'Could not load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (order?.verificationCode?.code) {
      navigator.clipboard.writeText(order.verificationCode.code)
        .then(() => {
          // Show copy success notification
          alert('Verification code copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy code:', err);
        });
    }
  };

  const handleRegenerateCode = async () => {
    try {
      setRegeneratingCode(true);
      const { data } = await API.post(`/api/orders/${orderId}/regenerate-code`);
      
      if (data.success) {
        setRegenerateSuccess(true);
        if (data.code) {
          setNewCode(data.code);
        }
        // Refresh order after a brief delay
        setTimeout(() => {
          fetchOrder();
          setRegenerateSuccess(false);
          setNewCode('');
        }, 3000);
      }
    } catch (err) {
      console.error('Error regenerating code:', err);
      setError(err.response?.data?.msg || 'Could not regenerate verification code');
    } finally {
      setRegeneratingCode(false);
    }
  };

  if (loading && !order) {
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
          <h3 className="text-lg font-semibold text-amber-700 mb-2">Loading Order</h3>
          <p className="text-amber-600">Retrieving your order details...</p>
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
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/orders"
            className="inline-flex items-center text-amber-700 hover:text-amber-600 transition-colors font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Orders
          </Link>
        </motion.div>

        {error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-red-200 p-8 max-w-lg mx-auto"
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
              <button
                onClick={fetchOrder}
                className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Try Again
              </button>
              
              <Link
                to="/orders"
                className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Orders
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
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
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent tracking-tight drop-shadow-2xl"
                >
                  Order #{orderId.slice(-6)}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-amber-600 text-xl font-semibold tracking-wide drop-shadow-sm"
                >
                  Track your order status
                </motion.p>
              </div>
            </motion.div>

            {/* COD Verification Code Regenerate Section */}
            {order?.paymentMethod === 'cod' && 
             order?.verificationCode && 
             !order?.deliveryVerification?.verified && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200/50 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <BellAlertIcon className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-800">Verification Code</h3>
                      <p className="text-amber-700">
                        {order.verificationCode.code}
                        <button 
                          onClick={handleCopyCode} 
                          className="ml-2 inline-flex items-center p-1 hover:bg-amber-100 rounded-full transition-colors"
                          title="Copy to clipboard"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4 text-amber-600" />
                        </button>
                      </p>
                    </div>
                  </div>
                  
                  {regenerateSuccess ? (
                    <div className="p-3 bg-green-100 text-green-800 rounded-xl flex items-center">
                      <span>New code generated: {newCode}</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegenerateCode}
                      disabled={regeneratingCode}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                      {regeneratingCode ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowPathIcon className="h-5 w-5 mr-2" />
                          Regenerate Code
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Order Tracker Component */}
            <OrderTracker orderId={orderId} />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default OrderDetail;