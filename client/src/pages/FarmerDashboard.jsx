import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/ui/Notification';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  CurrencyRupeeIcon,
  SparklesIcon,
  BeakerIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import API from '../api/api';

// Import new farmer feature components
import CropHealthMonitoring from '../components/CropHealthMonitoring';
import MarketDemandForecasting from '../components/MarketDemandForecasting';
import SustainabilityScoreTracker from '../components/SustainabilityScoreTracker';

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { success, error } = useNotification();
  
  const [userLocation, setUserLocation] = useState(null);
  const [registeredFarms, setRegisteredFarms] = useState([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Original dashboard data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    farmSize: '',
    farmType: 'organic',
    contactNumber: '',
    email: '',
    certifications: '',
    specialCrops: '',
    farmImages: []
  });

  useEffect(() => {
    loadFarmData();
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setFormData(prev => ({
            ...prev,
            latitude: location.lat.toString(),
            longitude: location.lng.toString()
          }));
          setLoading(false);
        },
        (error) => {
          console.log('Error getting location:', error);
          error('Location Error', 'Unable to get your current location. Please enable location services.');
          setLoading(false);
        }
      );
    }

    loadFarms();
  }, []);

  const loadFarmData = async () => {
    try {
      // Load farm's products
      const productsRes = await API.get('/api/products/farm');
      setProducts(productsRes.data);

      // Load farm's orders
      const ordersRes = await API.get(`/api/orders/farm/${user.farmId}`);
      setOrders(ordersRes.data);

      // Calculate enhanced stats
      const totalOrders = ordersRes.data.length;
      const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingOrders = ordersRes.data.filter(
        order => !['delivered', 'cancelled'].includes(order.orderStatus)
      ).length;

      setStats({ 
        totalOrders, 
        totalRevenue, 
        pendingOrders,
        cropHealthScore: 92,
        sustainabilityScore: 87,
        marketTrend: 'up'
      });
    } catch (err) {
      console.error('Error loading farm data:', err);
    }
  };

  const loadFarms = () => {
    // Simulate API call
    setTimeout(() => {
      setRegisteredFarms([
        {
          id: 1,
          name: "My Organic Farm",
          latitude: 28.4595,
          longitude: 77.0266,
          address: "Village Sector 45, Gurgaon",
          farmSize: "5 acres",
          farmType: "organic",
          status: "approved",
          registrationDate: "2024-01-15"
        }
      ]);
    }, 1000);
  };

  // Initialize Google Maps
  useEffect(() => {
    if (userLocation && window.google) {
      const mapInstance = new window.google.maps.Map(
        document.getElementById('farmer-map'),
        {
          center: userLocation,
          zoom: 13,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ color: '#f4f1eb' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#a8d5ba' }]
            }
          ]
        }
      );

      // Add user location marker
      new window.google.maps.Marker({
        position: userLocation,
        map: mapInstance,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="4"/>
              <circle cx="20" cy="20" r="8" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });

      // Add existing farm markers
      registeredFarms.forEach(farm => {
        new window.google.maps.Marker({
          position: { lat: farm.latitude, lng: farm.longitude },
          map: mapInstance,
          title: farm.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2L30 16H10L20 2Z" fill="#10B981" stroke="white" stroke-width="2"/>
                <circle cx="20" cy="18" r="8" fill="#10B981" stroke="white" stroke-width="2"/>
                <text x="20" y="22" text-anchor="middle" fill="white" font-size="12" font-weight="bold">F</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });
      });

      // Click to select location for new farm
      mapInstance.addListener('click', (event) => {
        if (showRegistrationForm) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          
          setSelectedLocation({ lat, lng });
          setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
          }));

          // Add temporary marker
          if (window.tempMarker) {
            window.tempMarker.setMap(null);
          }
          
          window.tempMarker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstance,
            title: 'Selected Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="4"/>
                  <text x="20" y="25" text-anchor="middle" fill="white" font-size="20">📍</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40)
            }
          });
        }
      });

      setMap(mapInstance);
    }
  }, [userLocation, registeredFarms, showRegistrationForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      farmImages: [...prev.farmImages, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      error('Location Required', 'Please select a location on the map for your farm.');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFarm = {
        id: Date.now(),
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        status: 'pending',
        registrationDate: new Date().toISOString().split('T')[0]
      };

      setRegisteredFarms(prev => [...prev, newFarm]);
      setShowRegistrationForm(false);
      setFormData({
        name: '',
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        farmSize: '',
        farmType: 'organic',
        contactNumber: '',
        email: '',
        certifications: '',
        specialCrops: '',
        farmImages: []
      });
      
      if (window.tempMarker) {
        window.tempMarker.setMap(null);
      }

      success('Farm Registered', 'Your farm has been successfully registered and is pending approval.');
    } catch (err) {
      error('Registration Failed', 'Failed to register farm. Please try again.');
    }
  };

  const deleteFarm = async (farmId) => {
    try {
      setRegisteredFarms(prev => prev.filter(farm => farm.id !== farmId));
      success('Farm Deleted', 'Farm has been successfully removed.');
    } catch (err) {
      error('Delete Failed', 'Failed to delete farm. Please try again.');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-24 bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-beige-300 border-t-beige-600 rounded-full"
            />
            <span className="ml-4 text-beige-800 font-medium text-lg">Loading your farm dashboard...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Farm Overview', icon: ChartBarIcon },
    { id: 'health', name: 'Crop Health', icon: BeakerIcon },
    { id: 'market', name: 'Market Insights', icon: ArrowTrendingUpIcon },
    { id: 'sustainability', name: 'Sustainability', icon: ShieldCheckIcon }
  ];

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-beige-200/50 p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-gradient-to-r from-green-600 via-emerald-700 to-teal-600 rounded-2xl shadow-xl relative"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl opacity-30"
                    />
                    <SparklesIcon className="h-10 w-10 text-white relative z-10" />
                  </motion.div>
                  <div>
                    <motion.h1 
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-earth-700 via-beige-600 to-sage-600"
                    >
                      Smart Farmer Dashboard
                    </motion.h1>
                    <motion.p 
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-beige-600 text-lg font-medium flex items-center"
                    >
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        🚀
                      </motion.span>
                      AI-powered farm management and analytics platform
                    </motion.p>
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    variant="primary"
                    onClick={() => setShowRegistrationForm(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 shadow-xl border-0 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <PlusIcon className="h-5 w-5 relative z-10" />
                    <span className="relative z-10">Register New Farm</span>
                  </Button>
                </motion.div>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg text-white relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                  <motion.div
                    animate={{ bounce: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ShoppingBagIcon className="h-6 w-6 mb-2 opacity-80 relative z-10" />
                  </motion.div>
                  <p className="text-2xl font-bold relative z-10">{stats.totalOrders}</p>
                  <p className="text-sm opacity-90 relative z-10">Total Orders</p>
                  <motion.div 
                    className="absolute bottom-1 right-1 text-xs opacity-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    📦
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg text-white relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CurrencyRupeeIcon className="h-6 w-6 mb-2 opacity-80 relative z-10" />
                  </motion.div>
                  <p className="text-2xl font-bold relative z-10">₹{stats.totalRevenue}</p>
                  <p className="text-sm opacity-90 relative z-10">Revenue</p>
                  <motion.div 
                    className="absolute bottom-1 right-1 text-xs opacity-50"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💰
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 p-4 rounded-2xl shadow-lg text-white relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ExclamationTriangleIcon className="h-6 w-6 mb-2 opacity-80 relative z-10" />
                  </motion.div>
                  <p className="text-2xl font-bold relative z-10">{stats.pendingOrders}</p>
                  <p className="text-sm opacity-90 relative z-10">Pending</p>
                  <motion.div 
                    className="absolute bottom-1 right-1 text-xs opacity-50"
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⏰
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-lg text-white relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <BeakerIcon className="h-6 w-6 mb-2 opacity-80 relative z-10" />
                  </motion.div>
                  <p className="text-2xl font-bold relative z-10">{stats.cropHealthScore}%</p>
                  <p className="text-sm opacity-90 relative z-10">Crop Health</p>
                  <motion.div 
                    className="absolute bottom-1 right-1 text-xs opacity-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    🌱
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg text-white relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <ShieldCheckIcon className="h-6 w-6 mb-2 opacity-80 relative z-10" />
                  </motion.div>
                  <p className="text-2xl font-bold relative z-10">{stats.sustainabilityScore}%</p>
                  <p className="text-sm opacity-90 relative z-10">Sustainability</p>
                  <motion.div 
                    className="absolute bottom-1 right-1 text-xs opacity-50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    ♻️
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-indigo-400 via-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg text-white relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                  <motion.div
                    animate={{ x: [0, 3, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowTrendingUpIcon className="h-6 w-6 mb-2 opacity-80 relative z-10" />
                  </motion.div>
                  <p className="text-2xl font-bold capitalize relative z-10">{stats.marketTrend}</p>
                  <p className="text-sm opacity-90 relative z-10">Market Trend</p>
                  <motion.div 
                    className="absolute bottom-1 right-1 text-xs opacity-50"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    📈
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-beige-200 shadow-lg relative overflow-hidden">
            {/* Background glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-beige-100/50 via-cream-100/50 to-sage-100/50 opacity-50"
              animate={{
                background: [
                  'linear-gradient(90deg, rgba(239,195,115,0.1) 0%, rgba(247,213,114,0.1) 50%, rgba(90,138,90,0.1) 100%)',
                  'linear-gradient(90deg, rgba(90,138,90,0.1) 0%, rgba(239,195,115,0.1) 50%, rgba(247,213,114,0.1) 100%)',
                  'linear-gradient(90deg, rgba(247,213,114,0.1) 0%, rgba(90,138,90,0.1) 50%, rgba(239,195,115,0.1) 100%)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className="flex space-x-2 relative z-10">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'text-beige-600 hover:bg-beige-100'
                  }`}
                >
                  {/* Active tab glow effect */}
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <motion.div
                    animate={activeTab === tab.id ? { 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 2, repeat: activeTab === tab.id ? Infinity : 0 }}
                  >
                    <tab.icon className="h-5 w-5 relative z-10" />
                  </motion.div>
                  <span className="relative z-10">{tab.name}</span>
                  
                  {/* Hover effect for inactive tabs */}
                  {activeTab !== tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-beige-200/50 to-cream-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Map */}
                <div className="lg:col-span-2">
                  <Card className="p-0 overflow-hidden h-[600px]">
                    <div className="bg-gradient-to-r from-beige-500 to-earth-500 text-white p-4">
                      <h2 className="text-xl font-bold flex items-center">
                        <MapPinIcon className="h-6 w-6 mr-2" />
                        Farm Locations
                      </h2>
                      <p className="text-beige-100 text-sm mt-1">
                        {showRegistrationForm 
                          ? "Click on the map to select location for your new farm"
                          : "View your registered farms and current location"
                        }
                      </p>
                    </div>
                    <div id="farmer-map" className="w-full h-full" />
                  </Card>
                </div>

                {/* Farms List and Info */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-beige-800 mb-4">Your Farms</h3>
                    
                    {registeredFarms.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPinIcon className="h-8 w-8 text-beige-400" />
                        </div>
                        <p className="text-beige-600 mb-4">No farms registered yet</p>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => setShowRegistrationForm(true)}
                        >
                          Register Your First Farm
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {registeredFarms.map((farm) => (
                          <motion.div
                            key={farm.id}
                            layout
                            className="border border-beige-200 rounded-xl p-4 bg-white"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-beige-800">{farm.name}</h4>
                                <p className="text-sm text-beige-600 mt-1">{farm.address}</p>
                                <div className="flex items-center space-x-4 text-xs text-beige-500 mt-2">
                                  <span>Size: {farm.farmSize}</span>
                                  <span>Type: {farm.farmType}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  farm.status === 'approved' 
                                    ? 'bg-green-100 text-green-700'
                                    : farm.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {farm.status}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => setSelectedFarm(farm)}
                                className="flex items-center space-x-1"
                              >
                                <PencilIcon className="h-3 w-3" />
                                <span>Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => deleteFarm(farm.id)}
                                className="flex items-center space-x-1 text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <TrashIcon className="h-3 w-3" />
                                <span>Delete</span>
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Location Info */}
                  {userLocation && (
                    <Card className="p-6">
                      <h3 className="text-lg font-bold text-beige-800 mb-3 flex items-center">
                        <InformationCircleIcon className="h-5 w-5 mr-2" />
                        Current Location
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-beige-600">Latitude:</span>
                          <span className="font-mono text-beige-800">{userLocation.lat.toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-beige-600">Longitude:</span>
                          <span className="font-mono text-beige-800">{userLocation.lng.toFixed(6)}</span>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>

              {/* Recent Orders Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Card className="overflow-hidden">
                  <div className="p-6 border-b border-beige-200 bg-gradient-to-r from-beige-50 to-cream-50">
                    <h2 className="text-xl font-bold text-beige-800">Recent Orders</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-beige-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-beige-700 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-beige-700 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-beige-700 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-beige-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-beige-700 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-beige-200">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-beige-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-beige-900 font-mono">{order._id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-beige-900">{order.buyer?.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-beige-900 font-semibold">₹{order.totalAmount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-beige-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'health' && (
            <motion.div
              key="health"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CropHealthMonitoring farmId={user?.farmId} />
            </motion.div>
          )}

          {activeTab === 'market' && (
            <motion.div
              key="market"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MarketDemandForecasting farmId={user?.farmId} />
            </motion.div>
          )}

          {activeTab === 'sustainability' && (
            <motion.div
              key="sustainability"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SustainabilityScoreTracker farmId={user?.farmId} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Form Modal */}
        <AnimatePresence>
          {showRegistrationForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-strong max-w-4xl w-full max-h-[90vh] overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-beige-200 bg-gradient-to-r from-beige-50 to-cream-50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-beige-800">Register New Farm</h2>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => {
                        setShowRegistrationForm(false);
                        if (window.tempMarker) {
                          window.tempMarker.setMap(null);
                        }
                      }}
                      className="text-beige-600 hover:text-beige-800"
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-beige-800 mb-2">
                          Farm Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-transparent"
                          placeholder="Enter your farm name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-beige-800 mb-2">
                          Farm Size *
                        </label>
                        <input
                          type="text"
                          name="farmSize"
                          value={formData.farmSize}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-transparent"
                          placeholder="e.g., 5 acres"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-beige-800 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-transparent"
                        placeholder="Describe your farm, crops, and farming practices"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-beige-800 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-transparent"
                        placeholder="Enter complete farm address"
                        required
                      />
                    </div>

                    {/* Location */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-beige-800 mb-2">
                          Latitude *
                        </label>
                        <input
                          type="text"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-transparent bg-beige-50"
                          placeholder="Click on map to select"
                          readOnly
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-beige-800 mb-2">
                          Longitude *
                        </label>
                        <input
                          type="text"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-transparent bg-beige-50"
                          placeholder="Click on map to select"
                          readOnly
                          required
                        />
                      </div>
                    </div>

                    {/* Farm Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-beige-800 mb-2">
                          Farm Type *
                        </label>
                        <select
                          name="farmType"
                          value={formData.farmType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-transparent"
                          required
                        >
                          <option value="organic">Organic</option>
                          <option value="conventional">Conventional</option>
                          <option value="hydroponic">Hydroponic</option>
                          <option value="mixed">Mixed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-beige-800 mb-2">
                          Contact Number *
                        </label>
                        <input
                          type="tel"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-transparent"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-beige-800 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-transparent"
                          placeholder="farmer@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-beige-800 mb-2">
                          Certifications
                        </label>
                        <input
                          type="text"
                          name="certifications"
                          value={formData.certifications}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-transparent"
                          placeholder="Organic certified, etc."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-beige-800 mb-2">
                        Special Crops
                      </label>
                      <input
                        type="text"
                        name="specialCrops"
                        value={formData.specialCrops}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-beige-200 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-transparent"
                        placeholder="List main crops you grow"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-beige-800 mb-2">
                        Farm Images
                      </label>
                      <div className="border-2 border-dashed border-beige-300 rounded-xl p-6 text-center">
                        <PhotoIcon className="h-12 w-12 text-beige-400 mx-auto mb-3" />
                        <p className="text-beige-600 mb-2">Upload farm photos</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="farm-images"
                        />
                        <label
                          htmlFor="farm-images"
                          className="inline-block px-4 py-2 bg-beige-500 text-white rounded-lg cursor-pointer hover:bg-beige-600 transition-colors"
                        >
                          Choose Files
                        </label>
                        {formData.farmImages.length > 0 && (
                          <p className="text-sm text-beige-600 mt-2">
                            {formData.farmImages.length} file(s) selected
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Location Hint */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <MapPinIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-blue-800 mb-1">Location Selection</p>
                          <p className="text-blue-600">
                            Click on the map to select your farm's exact location. The latitude and longitude will be automatically filled.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex space-x-4 pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1 flex items-center justify-center space-x-2"
                      >
                        <CheckIcon className="h-5 w-5" />
                        <span>Register Farm</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowRegistrationForm(false);
                          if (window.tempMarker) {
                            window.tempMarker.setMap(null);
                          }
                        }}
                        className="px-8"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
