import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/ui/Notification';
import LocationMap from '../components/LocationMap';
import { Card, ProductCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import API from '../api/api';
import { 
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  ClockIcon,
  TruckIcon,
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  ViewColumnsIcon,
  Bars3Icon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const Farms = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'map'
  const [loading, setLoading] = useState(true);
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());
  const [cartItems, setCartItems] = useState([]);

  // Sample farm data with coordinates
  const sampleFarms = [
    {
      id: 1,
      name: "Green Valley Organic Farm",
      location: "Gurgaon, Haryana",
      latitude: 28.4595,
      longitude: 77.0266,
  image: "/images/farm-generic.svg",
      rating: 4.8,
      phone: "+91 98765 43210",
      hours: "6 AM - 8 PM",
      isOpen: true,
      isOrganic: true,
      hasDelivery: true,
      description: "Premium organic vegetables and fruits grown with sustainable farming practices.",
      products: [
  { id: 101, name: "Organic Tomatoes", price: 80, image: "/images/product-generic.svg", category: "vegetables" },
  { id: 102, name: "Fresh Spinach", price: 40, image: "/images/product-generic.svg", category: "leafy greens" },
  { id: 103, name: "Organic Carrots", price: 60, image: "/images/product-generic.svg", category: "vegetables" }
      ]
    },
    {
      id: 2,
      name: "Sunrise Vegetable Farm",
      location: "Noida, UP",
      latitude: 28.5355,
      longitude: 77.3910,
  image: "/images/farm-generic.svg",
      rating: 4.6,
      phone: "+91 98765 43211",
      hours: "5 AM - 7 PM",
      isOpen: true,
      isOrganic: false,
      hasDelivery: true,
      description: "Fresh seasonal vegetables delivered daily to your doorstep.",
      products: [
  { id: 201, name: "Fresh Potatoes", price: 30, image: "/images/product-generic.svg", category: "vegetables" },
  { id: 202, name: "Green Peas", price: 70, image: "/images/product-generic.svg", category: "vegetables" },
  { id: 203, name: "Fresh Onions", price: 25, image: "/images/product-generic.svg", category: "vegetables" }
      ]
    },
    {
      id: 3,
      name: "Eco Earth Farm",
      location: "Faridabad, Haryana",
      latitude: 28.4089,
      longitude: 77.3178,
  image: "/images/farm-generic.svg",
      rating: 4.9,
      phone: "+91 98765 43212",
      hours: "7 AM - 6 PM",
      isOpen: false,
      isOrganic: true,
      hasDelivery: false,
      description: "Certified organic farm specializing in exotic vegetables and herbs.",
      products: [
  { id: 301, name: "Organic Broccoli", price: 120, image: "/images/product-generic.svg", category: "vegetables" },
  { id: 302, name: "Fresh Herbs Mix", price: 50, image: "/images/product-generic.svg", category: "herbs" },
  { id: 303, name: "Baby Corn", price: 90, image: "/images/product-generic.svg", category: "vegetables" }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFarms(sampleFarms);
      setLoading(false);
    }, 1000);
    
    fetchUserFavorites();

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
          // Default to Delhi
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    }
  }, []);

  const handleFarmSelect = (farm) => {
    setSelectedFarm(farm);
  };

  const fetchUserFavorites = async () => {
    try {
      if (user?.token) {
        const response = await API.get('/favorites');
        const favorites = new Set(response.data.map(product => product._id));
        setFavoriteProducts(favorites);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };
  
  const toggleFavorite = async (productId) => {
    try {
      if (favoriteProducts.has(productId)) {
        // Remove from favorites
        await API.post('/favorites/remove', { productId });
        setFavoriteProducts(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(productId);
          return newFavorites;
        });
        success('Removed from favorites', 'Product removed from your favorites list');
      } else {
        // Add to favorites
        await API.post('/favorites/add', { productId });
        setFavoriteProducts(prev => {
          const newFavorites = new Set(prev);
          newFavorites.add(productId);
          return newFavorites;
        });
        success('Added to favorites', 'Product added to your favorites list');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      error('Error', 'Could not update favorites. Please try again.');
    }
  };

  const addToCart = (product, farmId) => {
    setCartItems(prev => [...prev, { ...product, farmId, quantity: 1 }]);
    success('Added to cart', `${product.name} has been added to your cart`);
  };

  const FarmCard = ({ farm, variant = 'card' }) => (
    <motion.div
      layout
      whileHover={{ scale: variant === 'card' ? 1.02 : 1.01 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-beige-200 ${
        variant === 'list' ? 'flex items-center p-4' : 'p-0'
      }`}
    >
      <div className={variant === 'list' ? 'w-24 h-24 flex-shrink-0' : 'h-48 relative'}>
        <img
          src={farm.image}
          alt={farm.name}
          className="w-full h-full object-cover rounded-xl"
        />
        {farm.isOpen && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Open
          </div>
        )}
        {farm.isOrganic && (
          <div className="absolute top-3 right-3 bg-sage-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Organic
          </div>
        )}
      </div>
      
      <div className={`p-6 ${variant === 'list' ? 'flex-1 ml-4' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-beige-800 mb-1">{farm.name}</h3>
            <div className="flex items-center text-beige-600 text-sm">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{farm.location}</span>
            </div>
          </div>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-semibold text-beige-700">{farm.rating}</span>
          </div>
        </div>
        
        <p className="text-beige-600 text-sm mb-4">{farm.description}</p>
        
        <div className="flex items-center space-x-4 text-xs text-beige-500 mb-4">
          <div className="flex items-center">
            <PhoneIcon className="h-3 w-3 mr-1" />
            <span>{farm.phone}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>{farm.hours}</span>
          </div>
          {farm.hasDelivery && (
            <div className="flex items-center">
              <TruckIcon className="h-3 w-3 mr-1" />
              <span>Delivery</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="small"
            onClick={() => setSelectedFarm(farm)}
            className="flex items-center space-x-1"
          >
            <EyeIcon className="h-4 w-4" />
            <span>View Products</span>
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={() => handleFarmSelect(farm)}
            className="flex items-center space-x-1"
          >
            <MapPinIcon className="h-4 w-4" />
            <span>View on Map</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-beige-300 border-t-beige-600 rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-beige-700 to-earth-600 mb-4">
            Local Farms Near You
          </h1>
          <p className="text-beige-600 text-lg max-w-2xl">
            Discover fresh, local produce from verified farms in your area. Support sustainable agriculture and get the freshest ingredients delivered to your door.
          </p>
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-2">
            <span className="text-beige-600 font-medium">View:</span>
            <div className="flex bg-white rounded-xl p-1 border border-beige-200 shadow-soft">
              {[
                { key: 'grid', icon: ViewColumnsIcon, label: 'Grid' },
                { key: 'list', icon: Bars3Icon, label: 'List' },
                { key: 'map', icon: MapPinIcon, label: 'Map' }
              ].map(({ key, icon: Icon, label }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(key)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === key
                      ? 'bg-beige-500 text-white shadow-soft'
                      : 'text-beige-600 hover:bg-beige-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:block">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="text-sm text-beige-600">
            <span className="font-semibold">{farms.length}</span> farms found
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Farms List/Grid */}
          <div className={`${viewMode === 'map' ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
            {viewMode === 'grid' && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {farms.map((farm, index) => (
                    <motion.div
                      key={farm.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <FarmCard farm={farm} variant="card" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-4">
                <AnimatePresence>
                  {farms.map((farm, index) => (
                    <motion.div
                      key={farm.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <FarmCard farm={farm} variant="list" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {viewMode === 'map' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-beige-800">Farm List</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {farms.map((farm) => (
                      <motion.div
                        key={farm.id}
                        layout
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleFarmSelect(farm)}
                        className={`p-4 rounded-xl cursor-pointer border transition-all ${
                          selectedFarm?.id === farm.id
                            ? 'bg-beige-100 border-beige-300'
                            : 'bg-white border-beige-200 hover:bg-beige-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={farm.image}
                            alt={farm.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-beige-800 truncate">{farm.name}</h4>
                            <p className="text-sm text-beige-600 truncate">{farm.location}</p>
                            <div className="flex items-center text-xs text-beige-500 mt-1">
                              <StarIcon className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                              <span>{farm.rating}</span>
                              {farm.isOpen ? (
                                <span className="ml-2 text-green-600">Open</span>
                              ) : (
                                <span className="ml-2 text-red-600">Closed</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          {viewMode === 'map' && (
            <div className="lg:col-span-2">
              <LocationMap
                farms={farms}
                userLocation={userLocation}
                onFarmSelect={handleFarmSelect}
                height="600px"
              />
            </div>
          )}
        </div>

        {/* Selected Farm Products Modal */}
        <AnimatePresence>
          {selectedFarm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedFarm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-strong max-w-4xl w-full max-h-[80vh] overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-beige-200 bg-gradient-to-r from-beige-50 to-cream-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-beige-800">{selectedFarm.name}</h2>
                      <p className="text-beige-600">{selectedFarm.location}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => setSelectedFarm(null)}
                      className="text-beige-600 hover:text-beige-800"
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                {/* Products */}
                <div className="p-6 overflow-y-auto">
                  <h3 className="text-lg font-bold text-beige-800 mb-4">Available Products</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFarm.products?.map((product) => (
                      <ProductCard
                        key={product.id}
                        image={product.image}
                        title={product.name}
                        price={product.price}
                        onAddToCart={() => addToCart(product, selectedFarm.id)}
                        onFavorite={() => toggleFavorite(product.id)}
                        isFavorite={favoriteProducts.has(product.id)}
                        className="h-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Farms;
