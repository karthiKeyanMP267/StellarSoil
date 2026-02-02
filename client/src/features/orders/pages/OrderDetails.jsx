import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';
import OrderMap from '../components/OrderMap';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (e) {
      setError(e?.response?.data?.msg || 'Failed to load order');
    }
  };

  useEffect(() => {
    fetchOrder();
    const t = setInterval(fetchOrder, 5000);
    return () => clearInterval(t);
  }, [id]);

  if (error) return <div className="pt-24 px-6 text-red-600">{error}</div>;
  if (!order) return <div className="pt-24 px-6">Loading order…</div>;

  return (
    <div className="min-h-screen pt-20 sm:pt-24 px-3 sm:px-4 md:px-6 pb-8 sm:pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Order Details</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Order Information Card */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Order #{order._id.slice(-6)}</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.orderStatus === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                  order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {order.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {order.verificationCode?.code && !order.deliveryVerification?.verified && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-1">COD Verification Code:</p>
                <p className="text-2xl font-mono font-bold text-amber-900">{order.verificationCode.code}</p>
                <p className="text-xs text-amber-600 mt-1">Share this code with delivery person</p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-700">Order Items:</h3>
              {(order.items || []).map((it, idx) => (
                <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="font-semibold text-gray-800">{it.product?.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Quantity: {it.quantity} {it.unit} • ₹{it.price * it.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                <span>Total Amount:</span>
                <span>₹{Math.max(0, (order.totalAmount || 0) - (order.discount || 0))}</span>
              </div>
              {order.discount > 0 && (
                <div className="text-sm text-green-600 mt-1">
                  Discount applied: ₹{order.discount}
                </div>
              )}
            </div>

            {order.deliverySlot?.date && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Delivery Slot:</p>
                <p className="text-sm text-blue-700 mt-1">
                  {new Date(order.deliverySlot.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {order.deliverySlot.timeSlot && ` • ${order.deliverySlot.timeSlot}`}
                </p>
              </div>
            )}
          </div>

          {/* Farm Location Map */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPinIcon className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-800">Farm Location</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Track where your fresh produce is coming from
            </p>
            <OrderMap order={order} viewMode="user" height="400px" />
          </div>
        </div>

        <div className="mt-6">
          <Link 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            to="/orders"
          >
            ← Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
