import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  PhoneIcon,
  CalendarIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'text-green-600 bg-green-100';
    case 'in transit':
      return 'text-amber-600 bg-amber-100';
    case 'processing':
      return 'text-amber-600 bg-amber-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return CheckCircleIcon;
    case 'in transit':
      return TruckIcon;
    case 'processing':
      return ClockIcon;
    default:
      return MapPinIcon;
  }
};

function DeliveryTracking() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await API.get(`/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Order not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find the order you're looking for.
          </p>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
            Track Order #{order.orderNumber}
          </h1>
          <p className="mt-2 text-gray-600">Monitor your order's journey in real-time</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-green-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${getStatusColor(order.status)}`}>
                <StatusIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {order.items.length} items • ₹{order.total.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-500">Ordered on {new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-gray-200"></div>
              </div>
              <div className="relative flex justify-between">
                {['Order Placed', 'Processing', 'In Transit', 'Delivered'].map(
                  (step, index) => {
                    const isCompleted =
                      index <=
                      ['Order Placed', 'Processing', 'In Transit', 'Delivered'].indexOf(
                        order.status
                      );
                    return (
                      <div
                        key={step}
                        className={`flex flex-col items-center ${
                          isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <div
                          className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            isCompleted
                              ? 'border-green-600 bg-green-100'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isCompleted && (
                            <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </div>
                        <p
                          className={`mt-2 text-xs ${
                            isCompleted ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Estimated Delivery</p>
                <p className="mt-1 text-sm text-gray-500">{order.estimatedDelivery}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <HomeIcon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Shipping Address</p>
                <p className="mt-1 text-sm text-gray-500">{order.shippingAddress}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <PhoneIcon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Contact</p>
                <p className="mt-1 text-sm text-gray-500">{order.contact}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Order Details</p>
                <p className="mt-1 text-sm text-gray-500">
                  {order.items.map(item => item.name).join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Updates */}
        <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-green-100">
          <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
            Tracking Updates
          </h3>
          <div className="space-y-6">
            {order.trackingUpdates?.map((update, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${getStatusColor(update.status)}`}>
                    {getStatusIcon(update.status)({ className: "h-5 w-5" })}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{update.status}</p>
                  <p className="text-sm text-gray-500">{update.location}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(update.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryTracking;
