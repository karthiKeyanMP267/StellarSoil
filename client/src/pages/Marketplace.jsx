import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    isOrganic: false
  });

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (location) {
      loadNearbyProducts();
    }
  }, [location]);

  const loadNearbyProducts = async () => {
    try {
      const res = await API.get(`/api/products/nearby`, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 10000 // 10km
        }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await API.post('/api/cart/add', { productId: product._id });
      // You can add toast notification here
      console.log('Product added to cart successfully');
    } catch (err) {
      console.error('Error adding product to cart:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await API.get('/api/products/search', { params: filters });
      setProducts(res.data);
    } catch (err) {
      console.error('Error searching products:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 pt-20">
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
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="dairy">Dairy</option>
              <option value="grains">Grains</option>
            </select>
            <div className="flex space-x-2">
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
              className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-green-100">
              <img
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.farm.name}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ₹{product.price}/{product.unit}
                  </span>
                  {product.isOrganic && (
                    <span className="bg-green-100 text-green-600 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
                      Organic
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-6 w-full rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default Marketplace;
