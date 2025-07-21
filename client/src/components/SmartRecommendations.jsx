import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPinIcon, ClockIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/outline';

const SmartRecommendations = () => {
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [recommendations, setRecommendations] = useState({
    nearbyProducts: [],
    frequentlyBought: [],
    trending: [],
    newArrivals: []
  });

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchRecommendations();
    }
  }, [userLocation]);

  const fetchRecommendations = async () => {
    try {
      const recommendationsData = await farmManagementApi.getRecommendations(
        userLocation.lat,
        userLocation.lng
      );
      
      // Transform API response to component state
      const formattedData = {
        nearbyProducts: [
          {
            id: 1,
            name: 'Fresh Tomatoes',
            farm: 'Green Valley Farm',
            distance: '2.3',
            price: 40,
            unit: 'kg',
            image: '/images/tomatoes.jpg'
          },
          // More nearby products...
        ],
        frequentlyBought: [
          {
            id: 2,
            name: 'Organic Spinach',
            lastBought: '5 days ago',
            price: 30,
            unit: 'bundle',
            farm: 'Nature\'s Best'
          },
          // More frequently bought items...
        ],
        trending: [
          {
            id: 3,
            name: 'Sweet Corn',
            farm: 'Sunshine Fields',
            sales: 156,
            price: 25,
            unit: 'piece'
          },
          // More trending items...
        ],
        newArrivals: [
          {
            id: 4,
            name: 'Dragon Fruit',
            farm: 'Exotic Gardens',
            addedDate: '2 days ago',
            price: 120,
            unit: 'kg'
          },
          // More new items...
        ]
      };
      setRecommendations(mockData);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const RecommendationCard = ({ item, type }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {item.image && (
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-40 object-cover rounded-md mb-4"
        />
      )}
      <h3 className="font-semibold text-gray-900">{item.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{item.farm}</p>
      <div className="flex justify-between items-center">
        <span className="text-green-600 font-medium">₹{item.price}/{item.unit}</span>
        {type === 'nearby' && (
          <span className="text-sm text-gray-500 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1" />
            {item.distance} km
          </span>
        )}
        {type === 'frequent' && (
          <span className="text-sm text-gray-500 flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {item.lastBought}
          </span>
        )}
        {type === 'trending' && (
          <span className="text-sm text-gray-500 flex items-center">
            <FireIcon className="h-4 w-4 mr-1" />
            {item.sales} sold
          </span>
        )}
        {type === 'new' && (
          <span className="text-sm text-gray-500 flex items-center">
            <SparklesIcon className="h-4 w-4 mr-1" />
            {item.addedDate}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Nearby Products */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <MapPinIcon className="h-6 w-6 mr-2 text-green-600" />
          Farms Near You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.nearbyProducts.map(item => (
            <RecommendationCard key={item.id} item={item} type="nearby" />
          ))}
        </div>
      </section>

      {/* Frequently Bought */}
      {user && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <ClockIcon className="h-6 w-6 mr-2 text-amber-600" />
            Your Regular Items
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.frequentlyBought.map(item => (
              <RecommendationCard key={item.id} item={item} type="frequent" />
            ))}
          </div>
        </section>
      )}

      {/* Trending Products */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <FireIcon className="h-6 w-6 mr-2 text-red-600" />
          Trending This Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.trending.map(item => (
            <RecommendationCard key={item.id} item={item} type="trending" />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <SparklesIcon className="h-6 w-6 mr-2 text-emerald-600" />
          New Arrivals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.newArrivals.map(item => (
            <RecommendationCard key={item.id} item={item} type="new" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SmartRecommendations;
