import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/ui/Notification';
import LocationMap from '../components/LocationMap';
import { Card, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, TextArea, Select, FileUpload } from '../components/ui/Form';
import { Modal } from '../components/ui/Modal';
import API from '../api/api';
import {
  MapPinIcon,
  PlusIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  UserGroupIcon,
  ClockIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function FarmDashboard() {
  const { user, setUser } = useAuth();
  const { success, error, info } = useNotification();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeListings: 0,
    completedOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    monthlyEarnings: 0
  });
  
  const [farmLocation, setFarmLocation] = useState(null);
  const [showFarmRegistration, setShowFarmRegistration] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Farm registration form state
  const [farmData, setFarmData] = useState({
    farmName: user?.farmName || '',
    farmType: user?.farmType || '',
    description: user?.farmDescription || '',
    location: user?.location || '',
    latitude: null,
    longitude: null,
    phone: user?.phone || '',
    email: user?.email || '',
    website: '',
    establishedYear: '',
    farmSize: '',
    farmSizeUnit: 'acres',
    organicCertified: false,
    certificationNumber: '',
    specialties: [],
    operatingHours: {
      monday: { open: '06:00', close: '18:00', closed: false },
      tuesday: { open: '06:00', close: '18:00', closed: false },
      wednesday: { open: '06:00', close: '18:00', closed: false },
      thursday: { open: '06:00', close: '18:00', closed: false },
      friday: { open: '06:00', close: '18:00', closed: false },
      saturday: { open: '06:00', close: '18:00', closed: false },
      sunday: { open: '08:00', close: '16:00', closed: false }
    },
    images: [],
    documents: []
  });

  // Fetch farm statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/farms/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching farm stats:', error);
        setStats({
          totalProducts: 12,
          activeListings: 8,
          completedOrders: 45,
          totalRevenue: 125000,
          pendingOrders: 3,
          monthlyEarnings: 25000
        });
      }
    };

    fetchStats();
  }, []);

  // Get live location for farm
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setFarmLocation(location);
          setFarmData(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng
          }));
          setIsLoadingLocation(false);
          success('Location Found', 'Your farm location has been detected');
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
          info('Location Access', 'Please enable location access to mark your farm on the map');
        }
      );
    }
  }, []);

  // Check if farm profile needs completion
  useEffect(() => {
    // Only show registration modal if not on the profile page and profile is incomplete
    const isOnProfilePage = window.location.pathname.includes('/farmer/profile');
    if (user?.role === 'farmer' && 
        (!user.farmDescription || !user.location || !farmLocation) && 
        !isOnProfilePage) {
      setShowFarmRegistration(true);
    }
  }, [user, farmLocation]);

  const handleFarmRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put('/farms/profile', farmData);
      success('Farm Registered', 'Your farm profile has been updated successfully');
      setShowFarmRegistration(false);
      
      // Update the user context data to prevent the modal from reappearing
      if (response.data?.farm || response.data) {
        setUser(prev => ({
          ...prev,
          farmName: farmData.farmName,
          farmDescription: farmData.description,
          location: farmData.location
        }));
        
        // Also update localStorage to persist the changes
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          farmName: farmData.farmName,
          farmDescription: farmData.description,
          location: farmData.location
        }));
      }
    } catch (error) {
      error('Registration Failed', error.response?.data?.message || 'Failed to update farm profile');
    }
  };

  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setFarmLocation(location);
          setFarmData(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng
          }));
          setIsLoadingLocation(false);
          success('Location Updated', 'Your farm location has been updated');
        },
        (error) => {
          setIsLoadingLocation(false);
          error('Location Error', 'Unable to get your current location');
        }
      );
    }
  };

  const farmTypeOptions = [
    { value: 'organic', label: 'Organic Farm' },
    { value: 'conventional', label: 'Conventional Farm' },
    { value: 'hydroponic', label: 'Hydroponic Farm' },
    { value: 'greenhouse', label: 'Greenhouse Farm' },
    { value: 'dairy', label: 'Dairy Farm' },
    { value: 'poultry', label: 'Poultry Farm' },
    { value: 'mixed', label: 'Mixed Farm' }
  ];

  const specialtyOptions = [
    'Vegetables', 'Fruits', 'Grains', 'Herbs', 'Spices', 'Flowers', 
    'Organic Produce', 'Exotic Vegetables', 'Seasonal Crops', 'Medicinal Plants'
  ];

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-beige-700 to-earth-600">
                {user?.farmName || `${user?.name}'s Farm`} Dashboard
              </h1>
              <p className="text-beige-600 text-lg mt-2">
                Manage your farm operations and track your success
              </p>
              {farmLocation && (
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  <span>Live location active</span>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleLocationUpdate}
                disabled={isLoadingLocation}
                className="flex items-center space-x-2"
              >
                <MapPinIcon className="h-4 w-4" />
                <span>{isLoadingLocation ? 'Updating...' : 'Update Location'}</span>
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowFarmRegistration(true)}
                className="flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Edit Farm Profile</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            icon={ShoppingBagIcon}
            value={stats.totalProducts}
            label="Total Products"
            color="text-beige-700"
            trend="up"
            trendValue="+2 this week"
          />
          <StatCard
            icon={ChartBarIcon}
            value={stats.activeListings}
            label="Active Listings"
            color="text-sage-700"
            trend="up"
            trendValue="+1 this week"
          />
          <StatCard
            icon={TruckIcon}
            value={stats.completedOrders}
            label="Completed Orders"
            color="text-earth-700"
            trend="up"
            trendValue="+12 this month"
          />
          <StatCard
            icon={CurrencyRupeeIcon}
            value={`₹${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}`}
            label="Total Revenue"
            color="text-green-700"
            trend="up"
            trendValue="+15% this month"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Farm Map & Location */}
          <div className="lg:col-span-2 space-y-6">
            {/* Farm Location Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="gradient" padding="normal">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-beige-800">Farm Location</h2>
                  <div className="flex items-center space-x-2 text-sm text-beige-600">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{user?.location || 'Location not set'}</span>
                  </div>
                </div>
                
                {farmLocation ? (
                  <LocationMap
                    farms={[{
                      id: 'user-farm',
                      name: user?.farmName || `${user?.name}'s Farm`,
                      location: user?.location || 'Your Farm',
                      latitude: farmLocation.lat,
                      longitude: farmLocation.lng,
                      image: '/hero-farm.jpg',
                      rating: 4.8,
                      isOrganic: farmData.organicCertified,
                      isOpen: true,
                      hasDelivery: true
                    }]}
                    userLocation={farmLocation}
                    height="400px"
                    showUserLocation={false}
                  />
                ) : (
                  <div className="h-96 bg-beige-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <MapPinIcon className="h-12 w-12 text-beige-400 mx-auto mb-4" />
                      <p className="text-beige-600 mb-4">
                        {isLoadingLocation ? 'Getting your location...' : 'Location not available'}
                      </p>
                      <Button
                        variant="primary"
                        onClick={handleLocationUpdate}
                        disabled={isLoadingLocation}
                      >
                        {isLoadingLocation ? 'Loading...' : 'Enable Location'}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="gradient" padding="normal">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-beige-800">Recent Orders</h2>
                  <Button variant="outline" size="small">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { id: 1, customer: 'Rahul Sharma', product: 'Organic Tomatoes', quantity: '5 kg', amount: '₹400', status: 'delivered', date: '2 hours ago' },
                    { id: 2, customer: 'Priya Patel', product: 'Fresh Spinach', quantity: '2 kg', amount: '₹160', status: 'processing', date: '5 hours ago' },
                    { id: 3, customer: 'Arjun Singh', product: 'Organic Carrots', quantity: '3 kg', amount: '₹240', status: 'pending', date: '1 day ago' }
                  ].map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 bg-white rounded-xl border border-beige-200 hover:shadow-medium transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-beige-800">{order.customer}</h3>
                            <span className="text-sm text-beige-500">{order.date}</span>
                          </div>
                          <p className="text-sm text-beige-600">{order.product} • {order.quantity}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-beige-700">{order.amount}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="gradient" padding="normal">
                <h2 className="text-xl font-bold text-beige-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full justify-start"
                    onClick={() => setShowProductModal(true)}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    Manage Customers
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                    Schedule Deliveries
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Farm Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="gradient" padding="normal">
                <h2 className="text-xl font-bold text-beige-800 mb-4">Farm Information</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-beige-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{user?.location || 'Location not set'}</span>
                  </div>
                  <div className="flex items-center text-beige-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>{user?.phone || 'Phone not set'}</span>
                  </div>
                  <div className="flex items-center text-beige-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    <span>{user?.email}</span>
                  </div>
                  {farmData.organicCertified && (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      <span>Organic Certified</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Today's Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="gradient" padding="normal">
                <h2 className="text-xl font-bold text-beige-800 mb-4">Today's Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-beige-600">New Orders</span>
                    <span className="font-semibold text-beige-800">3</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-beige-600">Revenue Today</span>
                    <span className="font-semibold text-green-600">₹1,200</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-beige-600">Pending Deliveries</span>
                    <span className="font-semibold text-orange-600">2</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-beige-600">Customer Inquiries</span>
                    <span className="font-semibold text-blue-600">5</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Farm Registration Modal */}
        <Modal
          isOpen={showFarmRegistration}
          onClose={() => setShowFarmRegistration(false)}
          title="Farm Registration & Profile"
          description="Complete your farm profile to attract more customers"
          size="xlarge"
          variant="gradient"
        >
          <form onSubmit={handleFarmRegistration} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Farm Name"
                value={farmData.farmName}
                onChange={(e) => setFarmData(prev => ({ ...prev, farmName: e.target.value }))}
                required
                placeholder="Enter your farm name"
              />
              
              <Select
                label="Farm Type"
                value={farmData.farmType}
                onChange={(e) => setFarmData(prev => ({ ...prev, farmType: e.target.value }))}
                options={farmTypeOptions}
                required
              />
            </div>

            <TextArea
              label="Farm Description"
              value={farmData.description}
              onChange={(e) => setFarmData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your farm, farming practices, and specialties..."
              rows={4}
              maxLength={500}
              showCounter
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Location Address"
                value={farmData.location}
                onChange={(e) => setFarmData(prev => ({ ...prev, location: e.target.value }))}
                required
                placeholder="Enter your farm address"
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-beige-600">
                  Live Coordinates
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={farmData.latitude?.toFixed(6) || ''}
                    placeholder="Latitude"
                    disabled
                    size="small"
                  />
                  <Input
                    value={farmData.longitude?.toFixed(6) || ''}
                    placeholder="Longitude"
                    disabled
                    size="small"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={handleLocationUpdate}
                    disabled={isLoadingLocation}
                  >
                    {isLoadingLocation ? '...' : '📍'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Input
                label="Phone Number"
                type="tel"
                value={farmData.phone}
                onChange={(e) => setFarmData(prev => ({ ...prev, phone: e.target.value }))}
                required
                placeholder="+91 98765 43210"
              />
              
              <Input
                label="Email"
                type="email"
                value={farmData.email}
                onChange={(e) => setFarmData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="farm@example.com"
              />
              
              <Input
                label="Website (Optional)"
                type="url"
                value={farmData.website}
                onChange={(e) => setFarmData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourfarm.com"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Input
                label="Established Year"
                type="number"
                value={farmData.establishedYear}
                onChange={(e) => setFarmData(prev => ({ ...prev, establishedYear: e.target.value }))}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear()}
              />
              
              <div className="flex space-x-2">
                <Input
                  label="Farm Size"
                  type="number"
                  value={farmData.farmSize}
                  onChange={(e) => setFarmData(prev => ({ ...prev, farmSize: e.target.value }))}
                  placeholder="10"
                />
                <Select
                  label="Unit"
                  value={farmData.farmSizeUnit}
                  onChange={(e) => setFarmData(prev => ({ ...prev, farmSizeUnit: e.target.value }))}
                  options={[
                    { value: 'acres', label: 'Acres' },
                    { value: 'hectares', label: 'Hectares' },
                    { value: 'bigha', label: 'Bigha' },
                    { value: 'katha', label: 'Katha' }
                  ]}
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={farmData.organicCertified}
                    onChange={(e) => setFarmData(prev => ({ ...prev, organicCertified: e.target.checked }))}
                    className="rounded border-beige-300 text-beige-500 focus:ring-beige-300"
                  />
                  <span className="text-sm font-semibold text-beige-600">Organic Certified</span>
                </label>
                {farmData.organicCertified && (
                  <Input
                    placeholder="Certification Number"
                    value={farmData.certificationNumber}
                    onChange={(e) => setFarmData(prev => ({ ...prev, certificationNumber: e.target.value }))}
                    size="small"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFarmRegistration(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Farm Profile
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
