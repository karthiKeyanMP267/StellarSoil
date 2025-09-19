import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useNotification } from '../components/ui/Notification';
import API from '../api/api';
import StaticMapView from './StaticMapView';
import AddressDisplay from './AddressDisplay';
import {
  ShoppingBagIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const OrderStatus = ({ status }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'placed':
        return { color: 'bg-blue-100 text-blue-700', icon: ClockIcon };
      case 'confirmed':
        return { color: 'bg-indigo-100 text-indigo-700', icon: CheckCircleIcon };
      case 'processing':
        return { color: 'bg-yellow-100 text-yellow-700', icon: ClockIcon };
      case 'ready':
        return { color: 'bg-green-100 text-green-700', icon: CheckCircleIcon };
      case 'out_for_delivery':
        return { color: 'bg-purple-100 text-purple-700', icon: TruckIcon };
      case 'delivered':
        return { color: 'bg-green-100 text-green-700', icon: CheckCircleIcon };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-700', icon: ExclamationCircleIcon };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: ClockIcon };
    }
  };

  const { color, icon: Icon } = getStatusDetails();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.replace('_', ' ')}
    </span>
  );
};

const FarmerOrderManagement = () => {
  const { success, error } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderStatusUpdating, setOrderStatusUpdating] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get('/orders/farmer-orders');
      setOrders(response.data);
    } catch (err) {
      error('Error', 'Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setOrderStatusUpdating(orderId);
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      
      // Update local state
      const updatedOrders = orders.map(order => {
        if (order._id === orderId) {
          return { 
            ...order, 
            orderStatus: newStatus,
            statusHistory: [...order.statusHistory, { status: newStatus, timestamp: new Date() }]
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      success('Updated', `Order status changed to ${newStatus}`);
    } catch (err) {
      error('Error', 'Failed to update order status');
      console.error(err);
    } finally {
      setOrderStatusUpdating(null);
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleVerifyDelivery = async (orderId, verificationCode) => {
    try {
      setOrderStatusUpdating(orderId);
      await API.post('/orders/verify-delivery', { 
        orderId, 
        verificationCode 
      });
      
      // Update local state
      const updatedOrders = orders.map(order => {
        if (order._id === orderId) {
          return { 
            ...order, 
            orderStatus: 'delivered',
            deliveryVerification: {
              ...order.deliveryVerification,
              verified: true,
              verifiedAt: new Date()
            },
            statusHistory: [...order.statusHistory, { status: 'delivered', timestamp: new Date() }]
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      success('Verified', 'Order delivery verified successfully');
    } catch (err) {
      error('Error', err.response?.data?.msg || 'Failed to verify delivery');
      console.error(err);
    } finally {
      setOrderStatusUpdating(null);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => {
        if (filter === 'pending') {
          return !['delivered', 'cancelled'].includes(order.orderStatus);
        } else {
          return order.orderStatus === filter;
        }
      });

  const renderOrderItems = (items) => {
    return (
      <div className="space-y-2 mb-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-beige-100">
            <div className="flex items-center">
              {item.product.image && (
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="w-10 h-10 object-cover rounded-md mr-3"
                />
              )}
              <div>
                <p className="font-medium text-beige-800">{item.product.name}</p>
                <p className="text-sm text-beige-500">
                  {item.quantity} {item.unit} × ₹{item.price}
                </p>
              </div>
            </div>
            <p className="font-medium text-beige-800">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderDeliveryAddress = (address, orderId, deliveryType) => {
    if (!address) return <p className="text-amber-600">No address provided</p>;
    return <AddressDisplay address={address} deliveryType={deliveryType} />;
  };

  const renderVerificationSection = (order) => {
    if (order.paymentMethod !== 'cod' || !order.verificationCode) {
      return null;
    }

    const isReadyForVerification = ['out_for_delivery', 'ready'].includes(order.orderStatus);
    const isVerified = order.deliveryVerification?.verified;

    if (isVerified) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">
              Delivery verified on {new Date(order.deliveryVerification.verifiedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      );
    }

    if (!isReadyForVerification) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-700">
              Verification will be available when the order is ready for delivery
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-beige-50 border border-beige-200 rounded-lg p-4 mt-4">
        <h4 className="text-beige-800 font-medium mb-2">Verify Delivery</h4>
        <p className="text-sm text-beige-600 mb-3">
          Ask the customer for their verification code to complete delivery
        </p>
        
        <div className="flex">
          <input 
            type="text" 
            placeholder="Enter verification code" 
            id={`verification-code-${order._id}`}
            className="flex-1 py-2 px-3 border border-beige-300 rounded-l-lg focus:ring-2 focus:ring-beige-500 focus:border-transparent"
          />
          <button
            onClick={() => {
              const code = document.getElementById(`verification-code-${order._id}`).value;
              if (code) {
                handleVerifyDelivery(order._id, code);
              } else {
                error('Error', 'Please enter verification code');
              }
            }}
            disabled={orderStatusUpdating === order._id}
            className="bg-beige-600 hover:bg-beige-700 text-white px-4 rounded-r-lg"
          >
            {orderStatusUpdating === order._id ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>
    );
  };

  const renderStatusUpdateOptions = (order) => {
    // Don't show status update options if order is cancelled or delivered
    if (['cancelled', 'delivered'].includes(order.orderStatus)) {
      return null;
    }

    const nextStatus = {
      placed: 'confirmed',
      confirmed: 'processing',
      processing: 'ready',
      ready: 'out_for_delivery'
    };

    const currentStatus = order.orderStatus;
    const nextStatusValue = nextStatus[currentStatus];

    if (!nextStatusValue) return null;

    const statusLabels = {
      confirmed: 'Confirm Order',
      processing: 'Start Processing',
      ready: 'Mark as Ready',
      out_for_delivery: 'Out for Delivery'
    };

    return (
      <div className="mt-4 border-t border-beige-200 pt-4">
        <h4 className="text-beige-800 font-medium mb-2">Update Status</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleUpdateStatus(order._id, nextStatusValue)}
            disabled={orderStatusUpdating === order._id}
            className="bg-beige-600 hover:bg-beige-700 text-white py-2 px-4 rounded-lg flex items-center"
          >
            {orderStatusUpdating === order._id ? (
              <><ArrowPathIcon className="animate-spin h-4 w-4 mr-2" /> Updating...</>
            ) : (
              <>{statusLabels[nextStatusValue]}</>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-beige-50 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-beige-800">Orders Management</h2>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-beige-300 rounded-lg py-2 px-3 text-beige-700 focus:ring-2 focus:ring-beige-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending Orders</option>
            <option value="placed">Newly Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={loadOrders}
            className="p-2 bg-beige-100 hover:bg-beige-200 rounded-lg"
            title="Refresh orders"
          >
            <ArrowPathIcon className="w-5 h-5 text-beige-700" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-beige-700"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-beige-400" />
          <h3 className="mt-2 text-lg font-medium text-beige-800">No orders found</h3>
          <p className="mt-1 text-beige-500">
            {filter === 'all' 
              ? "You haven't received any orders yet." 
              : `You don't have any ${filter} orders.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              layout
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-beige-50 transition-colors"
                onClick={() => toggleOrderExpand(order._id)}
              >
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-beige-100 p-2 rounded-lg">
                      <ShoppingBagIcon className="h-5 w-5 text-beige-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-beige-800">
                        Order #{order._id.substring(order._id.length - 6)}
                      </h3>
                      <p className="text-sm text-beige-500">
                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-beige-800 font-semibold">₹{order.totalAmount}</p>
                      <p className="text-sm text-beige-500">
                        {order.items.reduce((total, item) => total + item.quantity, 0)} items
                      </p>
                    </div>
                    <OrderStatus status={order.orderStatus} />
                    {expandedOrder === order._id ? (
                      <ChevronUpIcon className="w-5 h-5 text-beige-600" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-beige-600" />
                    )}
                  </div>
                </div>
              </div>
              
              {expandedOrder === order._id && (
                <div className="p-4 bg-beige-50 border-t border-beige-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="text-lg font-medium text-beige-800 mb-2">Order Items</h4>
                      {renderOrderItems(order.items)}

                      <div className="space-y-1 py-2">
                        <div className="flex justify-between items-center">
                          <span className="text-beige-600">Subtotal</span>
                          <span className="text-beige-800">₹{order.totalAmount}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-green-600">Discount</span>
                            <span className="text-green-600">-₹{order.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center font-medium">
                          <span className="text-beige-800">Total</span>
                          <span className="text-beige-800 text-lg">₹{order.totalAmount - (order.discount || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Delivery Info */}
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="text-lg font-medium text-beige-800 mb-2">Customer Information</h4>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="font-medium text-beige-800">{order.buyer.name}</p>
                          {order.buyer.phone && (
                            <p className="text-beige-600 flex items-center mt-1">
                              <PhoneIcon className="w-4 h-4 mr-1" /> {order.buyer.phone}
                            </p>
                          )}
                          {order.buyer.email && (
                            <p className="text-beige-600 mt-1">{order.buyer.email}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Delivery Info */}
                      <div>
                        <h4 className="text-lg font-medium text-beige-800 mb-2">
                          {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'} Information
                        </h4>
                        <div className="bg-white rounded-lg">
                          {order.deliveryType === 'delivery' ? (
                            <StaticMapView 
                              address={order.deliveryAddress} 
                              title="Delivery Location"
                            />
                          ) : (
                            <div className="p-3">
                              <AddressDisplay 
                                address={order.deliveryAddress} 
                                deliveryType="pickup" 
                              />
                            </div>
                          )}

                          {order.deliverySlot && (
                            <div className="mt-3 pt-3 border-t border-beige-100 p-3">
                              <div className="flex items-center">
                                <ClockIcon className="w-4 h-4 text-beige-500 mr-2" />
                                <div>
                                  <p className="text-beige-700">
                                    {new Date(order.deliverySlot.date).toLocaleDateString()}
                                  </p>
                                  <p className="text-beige-600 text-sm">{order.deliverySlot.timeSlot}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Payment Method */}
                      <div>
                        <h4 className="text-lg font-medium text-beige-800 mb-2">Payment Information</h4>
                        <div className="bg-white p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="text-beige-700">
                              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                               order.paymentMethod === 'upi' ? 'UPI Payment' : 'Card Payment'}
                            </p>
                            <p className="text-sm text-beige-500">
                              {order.paymentStatus === 'paid' ? 'Payment completed' : 
                               order.paymentStatus === 'pending' ? 'Payment pending' : 'Payment failed'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium 
                            ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                              order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                      
                      {/* Status Update */}
                      {renderStatusUpdateOptions(order)}
                      
                      {/* Verification Section for COD */}
                      {renderVerificationSection(order)}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerOrderManagement;