import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PhoneIcon,
  CurrencyDollarIcon,  // Replacing CashIcon with CurrencyDollarIcon
  CreditCardIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import API from '../api/api';

const OrderTracker = ({ orderId, refreshInterval = 60000 }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    fetchOrder();

    // Set up periodic refresh
    const intervalId = setInterval(fetchOrder, refreshInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [orderId, refreshInterval]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/orders/${orderId}`);
      setOrder(data);
      
      // Calculate remaining time for delivery if applicable
      if (data.deliverySlot) {
        const deliveryTime = new Date(data.deliverySlot).getTime();
        const now = new Date().getTime();
        const diff = deliveryTime - now;
        
        if (diff > 0) {
          setRemainingTime(diff);
        } else {
          setRemainingTime(null);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Could not load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatRemainingTime = () => {
    if (!remainingTime) return '';
    
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getStatusStep = () => {
    if (!order) return 0;
    
    switch (order.orderStatus) {
      case 'placed': return 1;
      case 'processing': return 2;
      case 'packed': return 3;
      case 'ready': return 4;
      case 'out_for_delivery': return 5;
      case 'delivered': return 6;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading && !order) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md">
        <div className="flex items-center space-x-3 text-red-600">
          <ExclamationTriangleIcon className="h-6 w-6" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/98 to-beige-50/95 backdrop-blur-2xl rounded-3xl shadow-xl border border-beige-200/50 p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-amber-800">Order #{order._id.toString().slice(-6)}</h2>
          <p className="text-amber-600">Placed on {formatDate(order.createdAt)}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-4 py-2 rounded-full font-medium ${
            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : 
            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            {order.orderStatus === 'placed' ? 'Order Placed' :
             order.orderStatus === 'processing' ? 'Processing' :
             order.orderStatus === 'packed' ? 'Packed' :
             order.orderStatus === 'ready' ? 'Ready for Delivery' :
             order.orderStatus === 'out_for_delivery' ? 'Out for Delivery' :
             order.orderStatus === 'delivered' ? 'Delivered' :
             order.orderStatus === 'cancelled' ? 'Cancelled' : 'Unknown'}
          </div>
          
          <div className={`px-4 py-2 rounded-full font-medium ${
            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
          </div>
        </div>
      </div>

      {/* Cash on Delivery Verification Code Section */}
      {order.paymentMethod === 'cod' && order.verificationCode && !order.deliveryVerification?.verified && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-800">Cash on Delivery Verification</h3>
              <p className="text-amber-700">Show this code to the delivery person when you receive your order</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-amber-300 mb-4">
            <h4 className="text-center text-amber-700 font-medium mb-2">Your Verification Code</h4>
            <div className="flex items-center justify-center">
              <span className="text-3xl font-mono font-bold tracking-widest text-amber-900">
                {order.verificationCode.code}
              </span>
            </div>
          </div>
          
          <div className="text-sm text-amber-700">
            <p>• This code will also be sent to your phone via SMS</p>
            <p>• The code is valid until delivery is completed</p>
            <p>• If you lose this code, you can regenerate it from your order details</p>
          </div>
        </motion.div>
      )}
      
      {/* Order Timeline/Tracker */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-amber-800 mb-6">Order Progress</h3>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-7 top-0 bottom-0 w-1 bg-gray-200 z-0"></div>
          
          {/* Status Steps */}
          <div className="space-y-8 relative z-10">
            {/* Order Placed */}
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                getStatusStep() >= 1 ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold ${
                  getStatusStep() >= 1 ? 'text-green-600' : 'text-gray-500'
                }`}>Order Placed</h4>
                <p className="text-sm text-gray-500">
                  {order.statusHistory.find(h => h.status === 'placed')?.date 
                    ? formatDate(order.statusHistory.find(h => h.status === 'placed').date)
                    : formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            
            {/* Processing */}
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                getStatusStep() >= 2 ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold ${
                  getStatusStep() >= 2 ? 'text-green-600' : 'text-gray-500'
                }`}>Processing</h4>
                <p className="text-sm text-gray-500">
                  {order.statusHistory.find(h => h.status === 'processing')?.date 
                    ? formatDate(order.statusHistory.find(h => h.status === 'processing').date)
                    : getStatusStep() >= 2 ? 'In progress' : 'Pending'}
                </p>
              </div>
            </div>
            
            {/* Ready for Delivery */}
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                getStatusStep() >= 4 ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                <MapPinIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold ${
                  getStatusStep() >= 4 ? 'text-green-600' : 'text-gray-500'
                }`}>Ready for Delivery</h4>
                <p className="text-sm text-gray-500">
                  {order.statusHistory.find(h => h.status === 'ready')?.date 
                    ? formatDate(order.statusHistory.find(h => h.status === 'ready').date)
                    : getStatusStep() >= 4 ? 'Product ready' : 'Pending'}
                </p>
              </div>
            </div>
            
            {/* Out for Delivery */}
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                getStatusStep() >= 5 ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                <TruckIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold ${
                  getStatusStep() >= 5 ? 'text-green-600' : 'text-gray-500'
                }`}>Out for Delivery</h4>
                <p className="text-sm text-gray-500">
                  {order.statusHistory.find(h => h.status === 'out_for_delivery')?.date 
                    ? formatDate(order.statusHistory.find(h => h.status === 'out_for_delivery').date)
                    : getStatusStep() >= 5 ? 'On the way' : 'Pending'}
                </p>
                {remainingTime && getStatusStep() >= 5 && getStatusStep() < 6 && (
                  <div className="mt-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs inline-flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    Estimated arrival in {formatRemainingTime()}
                  </div>
                )}
              </div>
            </div>
            
            {/* Delivered */}
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                getStatusStep() >= 6 ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold ${
                  getStatusStep() >= 6 ? 'text-green-600' : 'text-gray-500'
                }`}>Delivered</h4>
                <p className="text-sm text-gray-500">
                  {order.statusHistory.find(h => h.status === 'delivered')?.date 
                    ? formatDate(order.statusHistory.find(h => h.status === 'delivered').date)
                    : 'Pending'}
                </p>
                {order.deliveryVerification?.verified && (
                  <div className="mt-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs inline-flex items-center">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Verified with code
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Information */}
        <div className="p-6 bg-white/80 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            {order.paymentMethod === 'cod' ? (
              <CurrencyDollarIcon className="h-5 w-5 text-amber-600" />
            ) : (
              <CreditCardIcon className="h-5 w-5 text-amber-600" />
            )}
            <h3 className="text-lg font-semibold text-amber-800">Payment Information</h3>
          </div>
          
          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium">Method:</span> {
              order.paymentMethod === 'cod' ? 'Cash on Delivery' :
              order.paymentMethod === 'card' ? 'Credit/Debit Card' :
              order.paymentMethod === 'upi' ? 'UPI' : order.paymentMethod
            }</p>
            <p><span className="font-medium">Status:</span> {
              order.paymentStatus === 'paid' ? 'Paid' : 'Pending'
            }</p>
            <p><span className="font-medium">Total Amount:</span> ₹{order.totalAmount}</p>
            {order.discount > 0 && (
              <p><span className="font-medium">Discount:</span> ₹{order.discount}</p>
            )}
          </div>
        </div>
        
        {/* Delivery Information */}
        <div className="p-6 bg-white/80 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <TruckIcon className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-800">Delivery Information</h3>
          </div>
          
          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium">Type:</span> {
              order.deliveryType === 'delivery' ? 'Home Delivery' :
              order.deliveryType === 'pickup' ? 'Farm Pickup' : order.deliveryType
            }</p>
            <p><span className="font-medium">Address:</span> {order.deliveryAddress}</p>
            {order.deliverySlot && (
              <p><span className="font-medium">Scheduled for:</span> {formatDate(order.deliverySlot)}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Contact Support */}
      <div className="mt-8 flex justify-center">
        <button className="flex items-center px-6 py-3 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 transition-colors duration-300">
          <PhoneIcon className="h-5 w-5 mr-2" />
          Contact Support
        </button>
      </div>
    </motion.div>
  );
};

export default OrderTracker;