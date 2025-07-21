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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} {item.product.unit}
                </p>
              </div>
              <p className="font-medium">
                ₹{item.product.price * item.quantity}
              </p>
            </div>
          ))}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-semibold">
              <p>Total Amount</p>
              <p>₹{cart.items.reduce(
                (sum, item) => sum + (item.product.price * item.quantity),
                0
              )}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <PaymentForm
          cart={cart}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    </div>
  );
};

export default Checkout;
