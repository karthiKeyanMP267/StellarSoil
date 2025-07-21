import React, { useState, useEffect } from 'react';
import API from '../api/api';

const PaymentForm = ({ cart, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: '',
    type: 'delivery',
    slot: ''
  });

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!deliveryDetails.address.trim() || !deliveryDetails.slot.trim()) {
      if (onError) onError('Please fill in all delivery details');
      return;
    }

    setLoading(true);
    try {
      // Initialize payment
      const { data } = await API.post('/api/payments/initialize', {
        cartId: cart._id
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'StellarSoil',
        description: 'Farm Fresh Products',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            // Verify payment and create order
            const orderResponse = await API.post('/api/payments/verify', {
              cartId: cart._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              deliveryAddress: deliveryDetails.address,
              deliveryType: deliveryDetails.type,
              deliverySlot: deliveryDetails.slot
            });

            if (onSuccess) onSuccess(orderResponse.data);
          } catch (err) {
            if (onError) onError(err.response?.data?.msg || 'Payment verification failed');
          }
        },
        prefill: {
          name: cart.user?.name || '',
          email: cart.user?.email || ''
        },
        theme: {
          color: '#4F46E5'
        }
      };

      const razorpayLoaded = await loadRazorpay();
      if (razorpayLoaded) {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        throw new Error('Razorpay SDK failed to load');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Payment initialization failed';
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        if (onError) onError('Please log in to continue');
        // Redirect to login if needed
        window.location.href = '/login?redirect=/checkout';
      } else if (err.response?.status === 403) {
        if (onError) onError('Only buyers can make payments');
      } else {
        if (onError) onError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUPIPayment = async () => {
    // Implement UPI payment flow
  };

  return (
    <div className="space-y-6">
      {/* Delivery Details Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Delivery Details</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Type
          </label>
          <select
            value={deliveryDetails.type}
            onChange={(e) => setDeliveryDetails(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="delivery">Home Delivery</option>
            <option value="pickup">Farm Pickup</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {deliveryDetails.type === 'delivery' ? 'Delivery Address' : 'Pickup Address'}
          </label>
          <textarea
            value={deliveryDetails.address}
            onChange={(e) => setDeliveryDetails(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {deliveryDetails.type === 'delivery' ? 'Delivery Slot' : 'Pickup Slot'}
          </label>
          <input
            type="datetime-local"
            value={deliveryDetails.slot}
            onChange={(e) => setDeliveryDetails(prev => ({ ...prev, slot: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Payment Buttons */}
      <div className="space-y-4">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          {loading ? 'Processing...' : 'Pay with Card'}
        </button>

        <button
          onClick={handleUPIPayment}
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          Pay with UPI
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
