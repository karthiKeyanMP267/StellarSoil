import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import {
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import RealTimeDeliveryTracking from '../components/RealTimeDeliveryTracking';

const orderStatuses = {
  'placed': { color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: ClockIcon },
  'confirmed': { color: 'text-amber-600', bgColor: 'bg-amber-50', icon: ClockIcon },
  'processing': { color: 'text-amber-600', bgColor: 'bg-amber-50', icon: TruckIcon },
  'ready': { color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircleIcon },
  'out_for_delivery': { color: 'text-orange-600', bgColor: 'bg-orange-50', icon: TruckIcon },
  'delivered': { color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircleIcon },
  'cancelled': { color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircleIcon }
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackingOrder, setTrackingOrder] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders/my-orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-amber-200 rounded w-1/4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-amber-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/20 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text text-transparent">
                Order History
              </h1>
              <p className="text-amber-700 mt-1">Track your purchase history and order status</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-center shadow-sm">
              <XCircleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <TruckIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-amber-800 mb-3">No orders yet</h3>
              <p className="text-amber-700 mb-8 max-w-md mx-auto">Start shopping to create your first order and discover fresh, locally sourced produce.</p>
              <Link
                to="/marketplace"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <TruckIcon className="h-5 w-5 mr-2" />
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const status = orderStatuses[order.orderStatus] || orderStatuses['placed'];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-medium">{order._id}</p>
                        </div>
                        <div className={`flex items-center ${status.color} ${status.bgColor} px-3 py-1 rounded-full`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium capitalize">{order.orderStatus.replace('_', ' ')}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div key={item._id || index} className="flex items-center space-x-4">
                            <img
                              src={item.product?.image || '/placeholder.jpg'}
                              alt={item.product?.name || 'Product'}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h3>
                              <p className="text-sm text-gray-500">{order.farm?.name || 'Farm'}</p>
                              <div className="mt-1 text-sm">
                                <span className="text-gray-500">Quantity: {item.quantity} {item.unit}</span>
                                <span className="mx-2">·</span>
                                <span className="text-green-600 font-medium">₹{item.price * item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center space-x-4">
                            {['processing', 'ready', 'out_for_delivery'].includes(order.orderStatus) && (
                              <button
                                onClick={() => setTrackingOrder(order)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                <TruckIcon className="h-4 w-4 mr-2 inline" />
                                Track Order
                              </button>
                            )}
                            <div className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                              Total: ₹{order.totalAmount}
                            </div>
                          </div>
                        </div>
                        
                        {order.deliveryAddress && (
                          <div className="mt-4 text-sm text-gray-600">
                            <p className="font-medium">Delivery Address:</p>
                            <p>{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                            <p>{order.deliveryAddress.state} - {order.deliveryAddress.zipCode}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-500">Payment:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                              order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.deliveryType === 'delivery' ? '🚚 Home Delivery' : '🏪 Store Pickup'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Real-time Delivery Tracking Modal */}
        {trackingOrder && (
          <RealTimeDeliveryTracking
            order={trackingOrder}
            onClose={() => setTrackingOrder(null)}
          />
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
