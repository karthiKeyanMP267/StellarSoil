import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import API from '../api/api';

const PurchaseProduce = () => {
  const { farmId, productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError('Error loading product details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      await API.post('/orders', { 
        productId,
        farmId,
        quantity,
        totalPrice: product.price * quantity 
      });
      navigate('/checkout');
    } catch (err) {
      setError('Error processing purchase');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : product && (
          <>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>

            {/* Purchase Form */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="aspect-w-1 aspect-h-1 bg-white rounded-2xl overflow-hidden">
                <img
                  src={product.images?.[0] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8">
                <form onSubmit={handlePurchase} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity ({product.unit})
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                        className="p-2 rounded-full border border-gray-300 hover:border-green-500 transition-all duration-200"
                      >
                        <MinusIcon className="h-5 w-5 text-gray-500" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val > 0 && val <= product.availableQuantity) {
                            setQuantity(val);
                          }
                        }}
                        className="w-20 text-center border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => quantity < product.availableQuantity && setQuantity(q => q + 1)}
                        className="p-2 rounded-full border border-gray-300 hover:border-green-500 transition-all duration-200"
                      >
                        <PlusIcon className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {product.availableQuantity} {product.unit}s available
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600">
                        <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                        <span>Price per {product.unit}</span>
                      </div>
                      <span className="text-xl font-semibold text-gray-900">₹{product.price}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center text-gray-600">
                        <ScaleIcon className="h-5 w-5 mr-1" />
                        <span>Total</span>
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₹{(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <button
                      type="button"
                      onClick={() => navigate('/cart')}
                      className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-green-600 shadow-lg border-2 border-green-600 hover:bg-green-50 transition-all duration-300 flex items-center justify-center"
                    >
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      type="submit"
                      className="w-full rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                    >
                      Purchase Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseProduce;
