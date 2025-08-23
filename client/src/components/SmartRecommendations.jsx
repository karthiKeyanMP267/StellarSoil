import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPinIcon, ClockIcon, FireIcon, SparklesIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const SmartRecommendations = () => {
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [marketPrices, setMarketPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.warning('Location access denied. Recommendations may be less accurate.');
        }
      );
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
      fetchMarketPrices();
    }
  }, [user, userLocation]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (userLocation) {
        params.append('lat', userLocation.lat);
        params.append('lng', userLocation.lng);
      }
      params.append('limit', '20');

      const response = await fetch(`/api/market/recommendations?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations);
        groupRecommendationsByType(data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.message);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketPrices = async () => {
    try {
      const response = await fetch('/api/market/market-prices');
      if (!response.ok) {
        throw new Error('Failed to fetch market prices');
      }
      
      const data = await response.json();
      if (data.success) {
        setMarketPrices(data.prices);
      }
    } catch (error) {
      console.error('Error fetching market prices:', error);
    }
  };

  const groupRecommendationsByType = (recs) => {
    const grouped = {
      frequent: recs.filter(r => r.types?.includes('frequent') || r.type === 'frequent'),
      nearby: recs.filter(r => r.types?.includes('nearby') || r.type === 'nearby'),
      popular: recs.filter(r => r.types?.includes('popular') || r.type === 'popular' || r.type === 'commonly_bought'),
      collaborative: recs.filter(r => r.types?.includes('collaborative') || r.type === 'collaborative')
    };
    
    // If no specific categories, distribute evenly
    if (Object.values(grouped).every(arr => arr.length === 0)) {
      const perCategory = Math.ceil(recs.length / 4);
      grouped.frequent = recs.slice(0, perCategory);
      grouped.nearby = recs.slice(perCategory, perCategory * 2);
      grouped.popular = recs.slice(perCategory * 2, perCategory * 3);
      grouped.collaborative = recs.slice(perCategory * 3);
    }

    return grouped;
  };

  const RecommendationCard = ({ item }) => {
    const marketPrice = marketPrices[item.item?.toLowerCase()];
    const displayName = item.metadata?.displayName || 
                       item.item?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 
                       'Unknown Item';
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-green-500">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">{displayName}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
            {getTypeLabel(item.type)}
          </span>
        </div>
        
        {marketPrice && (
          <div className="mb-3">
            <div className="flex items-center text-green-600 font-medium text-sm mb-1">
              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
              ₹{marketPrice.current}/kg
            </div>
            <div className="text-xs text-gray-500">
              Range: ₹{marketPrice.min} - ₹{marketPrice.max}
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {Array.isArray(item.reasons) ? item.reasons[0] : item.reason}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Score: {item.score?.toFixed(2)}
          </div>
          <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    );
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'frequent': return 'bg-amber-100 text-amber-800';
      case 'nearby': return 'bg-green-100 text-green-800';
      case 'popular': return 'bg-orange-100 text-orange-800';
      case 'collaborative': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'frequent': return 'Your Favorite';
      case 'nearby': return 'Nearby';
      case 'popular': return 'Popular';
      case 'collaborative': return 'Recommended';
      case 'commonly_bought': return 'Common';
      default: return 'Suggested';
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="flex items-center justify-center py-12 text-red-600">
      <span>{message}</span>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const grouped = groupRecommendationsByType(recommendations);

  return (
    <div className="space-y-8">
      {/* Market Prices Summary */}
      {Object.keys(marketPrices).length > 0 && (
        <section className="bg-green-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-600" />
            Today's Market Prices
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(marketPrices).slice(0, 12).map(([commodity, price]) => (
              <div key={commodity} className="bg-white rounded p-3 text-center">
                <div className="font-medium text-sm text-gray-800 capitalize">
                  {commodity.replace(/_/g, ' ')}
                </div>
                <div className="text-green-600 font-semibold">₹{price.current}/kg</div>
                <div className="text-xs text-gray-500">₹{price.min}-₹{price.max}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Your Frequent Items */}
      {grouped.frequent.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <ClockIcon className="h-6 w-6 mr-2 text-amber-600" />
            Your Frequent Purchases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {grouped.frequent.slice(0, 8).map((item, index) => (
              <RecommendationCard key={`frequent-${index}`} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Nearby Recommendations */}
      {grouped.nearby.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPinIcon className="h-6 w-6 mr-2 text-green-600" />
            Available Nearby
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {grouped.nearby.slice(0, 8).map((item, index) => (
              <RecommendationCard key={`nearby-${index}`} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Items */}
      {grouped.popular.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <FireIcon className="h-6 w-6 mr-2 text-red-600" />
            Popular This Week
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {grouped.popular.slice(0, 8).map((item, index) => (
              <RecommendationCard key={`popular-${index}`} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Collaborative Recommendations */}
      {grouped.collaborative.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <SparklesIcon className="h-6 w-6 mr-2 text-orange-600" />
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {grouped.collaborative.slice(0, 8).map((item, index) => (
              <RecommendationCard key={`collaborative-${index}`} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* No recommendations fallback */}
      {recommendations.length === 0 && (
        <div className="text-center py-12">
          <SparklesIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-500">Start shopping to get personalized recommendations!</p>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;
