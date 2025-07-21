import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import {
  TrashIcon,
  ShoppingBagIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await API.get('/cart');
      setCart(response.data);
    } catch (err) {
      setError('Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await API.put(`/cart/${productId}`, { quantity: newQuantity });
      fetchCart();
    } catch (err) {
      setError('Error updating quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      fetchCart();
    } catch (err) {
      setError('Error removing item');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-8">
            Shopping Cart
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-2 text-gray-500">Start shopping to add items to your cart.</p>
              <Link
                to="/marketplace"
                className="mt-6 inline-block rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-200 pb-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.farmName}</p>
                        <p className="text-sm font-medium text-green-600">₹{item.price}/{item.unit}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => item.quantity > 1 && updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 rounded-full border border-gray-300 hover:border-green-500 transition-all duration-200"
                        >
                          <MinusIcon className="h-4 w-4 text-gray-500" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 rounded-full border border-gray-300 hover:border-green-500 transition-all duration-200"
                        >
                          <PlusIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-600 transition-colors duration-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-center text-lg font-medium">
                  <span>Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="mt-8 space-y-4">
                  <Link
                    to="/marketplace"
                    className="block text-center rounded-full bg-white px-8 py-4 text-base font-semibold text-green-600 shadow-lg border-2 border-green-600 hover:bg-green-50 transition-all duration-300"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/checkout"
                    className="block text-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
