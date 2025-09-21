import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import { 
  HeartIcon,
  ShoppingBagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await API.get('/favorites');
      setFavorites(response.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Error loading favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await API.post('/favorites/remove', { productId });
      // Filter out the removed product based on its ID
      setFavorites(favorites.filter(fav => fav._id !== productId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Error removing from favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20">
        <div className="flex justify-center items-center p-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
            <SparklesIcon className="absolute inset-0 h-6 w-6 m-auto text-amber-600 animate-pulse" />
          </div>
          <span className="ml-4 text-amber-800 font-medium">Loading favorites...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/20 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-lg">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text text-transparent">
                My Favorites
              </h1>
              <p className="text-amber-700 mt-1">Your saved products for easy shopping</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl flex items-center shadow-sm">
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          )}

          {!favorites || favorites.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <HeartIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-amber-800 mb-3">No favorites yet</h3>
              <p className="text-amber-700 mb-8 max-w-md mx-auto">You haven't added any products to your favorites. Start exploring and save products you love!</p>
              <Link
                to="/marketplace"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite) => (
                <div key={favorite._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group">
                  <div className="relative">
                    <img
                      src={favorite.image || '/images/product-generic.svg'}
                      alt={favorite.name || 'Product'}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemoveFavorite(favorite._id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <HeartIcon className="h-5 w-5 text-red-500 fill-current" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{favorite.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{favorite.farm?.name}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-amber-600">
                        ₹{favorite.price}/{favorite.unit}
                      </div>
                      <Link
                        to={`/purchase/${favorite.farm?._id}/${favorite._id}`}
                        className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
