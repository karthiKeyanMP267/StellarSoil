
import React, { useState, useEffect } from 'react';
import API from '../api/api';

const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Leafy Vegetables',
  // Add more categories as needed
];



function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ query: '', category: '', minPrice: '', maxPrice: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError('');
    try {
  const res = await API.get('/products/search');
      setProducts(res.data);
    } catch (err) {
      setError('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await API.post('/cart/add', { productId: product._id, quantity: 1 });
      setToastMessage('Product added to cart!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      console.log('Product added to cart successfully');
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/products/search', { params: filters });
      setProducts(res.data);
    } catch (err) {
      setError('Error searching products');
    } finally {
      setLoading(false);
    }
  };


  // Add to favorites handler
  const handleAddToFavorites = async (product) => {
    try {
      await API.post('/favorites/add', { productId: product._id });
      setToastMessage('Product added to favorites!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      console.log('Product added to favorites successfully');
    } catch (err) {
      let errorMsg = 'Error adding to favorites';
      if (err.response && err.response.data && err.response.data.msg) {
        errorMsg = err.response.data.msg;
      } else if (err.message) {
        errorMsg = err.message;
      }
      setToastMessage(errorMsg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      console.error('Error adding to favorites:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 pt-20">
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all animate-bounce-in">
          {toastMessage}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Fresh from the Farm
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Browse fresh, locally sourced produce from farms near you
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-green-100">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                className="w-full rounded-full px-4 py-2 border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full rounded-full px-4 py-2 border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Categories</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Leafy Vegetables">Leafy Vegetables</option>
                <option value="Dairy">Dairy</option>
                <option value="Grains">Grains</option>
              </select>
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full rounded-full px-4 py-2 border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full rounded-full px-4 py-2 border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="mt-2 px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all"
            >
              Search
            </button>
          </form>
        </div>

  {/* Category Buttons removed as per user request */}

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="w-24 h-24 object-cover rounded mb-2" />
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                <span className="text-green-600 font-bold">₹{product.price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToFavorites(product)}
                  className="mt-2 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all"
                  title="Add to Favorite"
                >
                  ♥ Add to Favorite
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Marketplace;
