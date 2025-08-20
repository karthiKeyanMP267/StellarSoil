import { useEffect, useState } from 'react';
import API from '../api/api';
import { HeartIcon } from '@heroicons/react/24/outline';

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
      setError('Error loading favorites');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <HeartIcon className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
        <p className="text-gray-500">You haven't added any products to your favorites.</p>
      </div>
    );
  }

  const handleRemoveFavorite = async (productId) => {
    try {
      await API.post('/favorites/remove', { productId });
      setFavorites(favorites.filter(item => item._id !== productId));
    } catch (err) {
      setError('Error removing favorite');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Favorites</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-24 h-24 object-cover rounded mb-2" />
              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{item.category}</p>
              <span className="text-green-600 font-bold">₹{item.price}</span>
              <button
                onClick={() => handleRemoveFavorite(item._id)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
              >
                Remove Favorite
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
