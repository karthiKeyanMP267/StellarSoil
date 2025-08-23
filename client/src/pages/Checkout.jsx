import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import PaymentForm from '../components/PaymentForm';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await API.get('/api/cart');
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error fetching cart');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (order) => {
    // Navigate to order confirmation page
    navigate(`/orders/${order._id}`);
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4 text-amber-800">Your cart is empty</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-colors duration-200"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-amber-800">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-amber-200/20 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-amber-800">Order Summary</h2>
          
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-amber-900">{item.product.name}</p>
                  <p className="text-sm text-amber-700">
                    Quantity: {item.quantity} {item.product.unit}
                  </p>
                </div>
                <p className="font-medium text-amber-800">
                  ₹{item.product.price * item.quantity}
                </p>
              </div>
            ))}

            <div className="border-t border-amber-200 pt-4">
              <div className="flex justify-between items-center font-semibold">
                <p className="text-amber-800">Total Amount</p>
                <p className="text-amber-800">₹{cart.items.reduce(
                  (sum, item) => sum + (item.product.price * item.quantity),
                  0
                )}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-amber-200/20 p-6">
          <h2 className="text-xl font-semibold mb-4 text-amber-800">Payment Details</h2>
          <PaymentForm
            cart={cart}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
