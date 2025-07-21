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

const orderStatuses = {
  'pending': { color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: ClockIcon },
  'processing': { color: 'text-blue-600', bgColor: 'bg-blue-50', icon: TruckIcon },
  'completed': { color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircleIcon },
  'cancelled': { color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircleIcon }
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-8">
            Order History
          </h1>

          {error && (
            <div className="text-center text-red-600 mb-8">{error}</div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="mt-2 text-gray-500">Start shopping to create your first order.</p>
              <Link
                to="/marketplace"
                className="mt-6 inline-block rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const status = orderStatuses[order.status];
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
                          <span className="text-sm font-medium capitalize">{order.status}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex items-center space-x-4">
                            <img
                              src={item.image || '/placeholder.jpg'}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500">{item.farmName}</p>
                              <div className="mt-1 text-sm">
                                <span className="text-gray-500">Quantity: {item.quantity}</span>
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
                          <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Total: ₹{order.totalAmount}
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
      </div>
    </div>
  );
};

export default OrderHistory;
