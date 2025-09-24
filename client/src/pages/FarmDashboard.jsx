import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/ui/Notification';
import LocationMap from '../components/LocationMap';
import { Card, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, TextArea, Select, FileUpload } from '../components/ui/Form';
import { Modal } from '../components/ui/Modal';
import LiveMarketPriceWidget from '../components/LiveMarketPriceWidget';
import LiveStockPredictionWidget from '../components/LiveStockPredictionWidget';
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
  const navigate = useNavigate();
  const { success, error, info } = useNotification();
  const locationHook = useLocation();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeListings: 0,
    completedOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    monthlyEarnings: 0
  });
  const [todaySummary, setTodaySummary] = useState({
    newOrdersToday: 0,
    revenueToday: 0,
    pendingDeliveries: 0,
    customerInquiries: 0
  });
  
  const [farmLocation, setFarmLocation] = useState(null);
  const [showFarmRegistration, setShowFarmRegistration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFarm, setHasFarm] = useState(null); // null: unknown, true/false: known
  const [geoDenied, setGeoDenied] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    unit: 'kg',
    stock: '',
    quantity: 1,
    isOrganic: false
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
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

  // Fetch per-farmer statistics and today's summary
  useEffect(() => {
    const fetchAll = async () => {
      if (!user || user.role !== 'farmer') return;
      try {
        const [statsRes, summaryRes] = await Promise.all([
          API.get('/farms/me/stats'),
          API.get('/farms/me/summary')
        ]);
        if (statsRes?.data) setStats(statsRes.data);
        if (summaryRes?.data) setTodaySummary(summaryRes.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        // Graceful fallback (keep zeros rather than mock numbers)
      }
    };
    fetchAll();
  }, [user]);

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
        (geoErr) => {
          console.error('Error getting location:', geoErr);
          setIsLoadingLocation(false);
          if (geoErr && (geoErr.code === geoErr.PERMISSION_DENIED || geoErr.code === 1)) {
            setGeoDenied(true);
          }
          info('Location Access', 'Please enable location access to mark your farm on the map');
        }
      );
    }
  }, []);

  // Check with server if farmer has completed farm profile; show modal only when 404 (no profile)
  useEffect(() => {
    const checkFarmProfile = async () => {
      if (!user || user.role !== 'farmer') return;
      try {
        await API.get('/farms/profile/me');
        setHasFarm(true);
        // If URL has ?edit=1, open the modal for editing
        const params = new URLSearchParams(locationHook.search);
        const wantsEdit = params.get('edit') === '1';
        setShowFarmRegistration(!!wantsEdit);
      } catch (err) {
        if (err?.response?.status === 404) {
          setHasFarm(false);
          setShowFarmRegistration(true);
        } else {
          console.error('Error checking farm profile:', err);
        }
      }
    };
    checkFarmProfile();
  }, [user, locationHook.search]);

  // Fetch recent orders for this farmer
  useEffect(() => {
    const fetchFarmerOrders = async () => {
      if (!user || user.role !== 'farmer') return;
      setOrdersLoading(true);
      try {
        const res = await API.get('/orders/farmer-orders');
        const orders = Array.isArray(res.data) ? res.data : [];
        // Sort newest first (API already does, but ensure)
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentOrders(orders.slice(0, 5));
      } catch (e) {
        console.error('Failed to fetch farmer orders:', e);
        setRecentOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchFarmerOrders();
  }, [user, hasFarm]);

  // Fetch farmer products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user || user.role !== 'farmer') return;
      try {
        const res = await API.get('/products/mine');
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Failed to fetch products:', e);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [user, hasFarm, showProductModal]);

  const openAddProduct = () => {
    setEditingProduct(null);
  setProductForm({ name: '', description: '', category: '', price: '', unit: 'kg', stock: '', quantity: 1, isOrganic: false });
    setShowProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name || '',
      description: p.description || '',
      category: p.category || '',
      price: p.price ?? '',
      unit: p.unit || 'kg',
      stock: p.stock ?? '',
      quantity: p.quantity ?? 1,
      isOrganic: !!p.isOrganic
    });
    setShowProductModal(true);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description || 'Fresh farm produce available for purchase',
        category: productForm.category || 'General',
        price: Number(productForm.price),
        unit: productForm.unit || 'kg',
        stock: Number(productForm.stock),
        quantity: Number(productForm.quantity) || 1,
        isOrganic: !!productForm.isOrganic
      };
      if (editingProduct?._id) {
        await API.put(`/products/${editingProduct._id}`, payload);
        success('Product Updated', `${payload.name} was updated.`);
      } else {
        await API.post('/products', payload);
        success('Product Added', `${payload.name} was created.`);
      }
      setShowProductModal(false);
      // trigger re-fetch via effect
    } catch (err) {
      console.error('Save product failed:', err);
      const valErrors = err?.response?.data?.errors;
      const detailed = Array.isArray(valErrors)
        ? valErrors.map((e) => e.msg || e.message).filter(Boolean).join(', ')
        : (err?.response?.data?.msg || err?.message);
      error('Save Failed', detailed || 'Unable to save product');
    }
  };

  const timeAgo = (isoString) => {
    if (!isoString) return '';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const statusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'processing':
      case 'confirmed':
      case 'ready':
        return 'bg-blue-100 text-blue-700';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  const handleFarmRegistration = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Normalize payload to server schema and allowed enums
      const allowedTypes = ['organic','conventional','hydroponic','mixed'];
      const normalizedType = (farmData.farmType || '').toLowerCase();
      const payload = {
        farmName: farmData.farmName,
        farmType: allowedTypes.includes(normalizedType) ? normalizedType : 'mixed',
        description: farmData.description,
        // Treat the location field as address text for profile creation
        address: farmData.location,
        location: farmData.location,
        contactPhone: farmData.phone,
        email: farmData.email,
        website: farmData.website,
        farmSize: farmData.farmSize,
        unit: farmData.farmSizeUnit,
        latitude: farmData.latitude,
        longitude: farmData.longitude,
        specialties: farmData.specialties,
        certifications: farmData.organicCertified ? ['Organic Certified'] : []
      };
      const response = await API.put('/farms/profile/me', payload);
      success('Farm Registered', 'Your farm profile has been updated successfully');
      setShowFarmRegistration(false);
      setHasFarm(true);
      
      // Update the user context data to prevent the modal from reappearing
      if (response.data?.farm || response.data) {
        setUser(prev => ({
          ...prev,
          farmName: farmData.farmName,
          farmDescription: farmData.description,
          location: farmData.location,
          phone: farmData.phone,
          email: farmData.email,
          website: farmData.website
        }));
        
        // Also update localStorage to persist the changes
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          farmName: farmData.farmName,
          farmDescription: farmData.description,
          location: farmData.location,
          phone: farmData.phone,
          email: farmData.email,
          website: farmData.website
        }));
      }
    } catch (err) {
      // Avoid shadowing notification error()
      error('Registration Failed', err?.response?.data?.message || 'Failed to update farm profile');
    } finally {
      setIsSubmitting(false);
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
        (geoErr) => {
          setIsLoadingLocation(false);
          if (geoErr && (geoErr.code === geoErr.PERMISSION_DENIED || geoErr.code === 1)) {
            setGeoDenied(true);
          }
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
        {geoDenied && (
          <div className="mb-6 p-4 rounded-lg border border-orange-200 bg-orange-50 text-orange-800 flex items-start justify-between">
            <div className="pr-4">
              <div className="font-semibold">Enable location to set farm coordinates</div>
              <div className="text-sm opacity-90">We couldn’t access your location. Turn it on in your browser settings and try again to pin your farm on the map.</div>
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <Button variant="outline" size="small" onClick={handleLocationUpdate} disabled={isLoadingLocation}>
                {isLoadingLocation ? 'Trying…' : 'Retry'}
              </Button>
              {!hasFarm && (
                <Button variant="primary" size="small" onClick={() => setShowFarmRegistration(true)}>
                  Open Registration
                </Button>
              )}
            </div>
          </div>
        )}
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

        {/* Market Price & Stock Prediction Widgets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <LiveMarketPriceWidget />
          <LiveStockPredictionWidget />
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
                  {ordersLoading && (
                    <div className="text-sm text-beige-500">Loading orders…</div>
                  )}
                  {!ordersLoading && recentOrders.length === 0 && (
                    <div className="text-sm text-beige-500">No orders yet.</div>
                  )}
                  {!ordersLoading && recentOrders.map((order) => {
                    const firstItem = order.items?.[0];
                    const productName = firstItem?.product?.name || '—';
                    const qty = firstItem ? `${firstItem.quantity} ${firstItem.unit}` : '';
                    const netAmount = Math.max(0, (order.totalAmount || 0) - (order.discount || 0));
                    return (
                      <motion.div
                        key={order._id}
                        whileHover={{ scale: 1.01 }}
                        className="p-4 bg-white rounded-xl border border-beige-200 hover:shadow-medium transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-beige-800">{order.buyer?.name || 'Customer'}</h3>
                              <span className="text-sm text-beige-500">{timeAgo(order.createdAt)}</span>
                            </div>
                            <p className="text-sm text-beige-600">{productName} • {qty}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-beige-700">₹{netAmount}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(order.orderStatus)}`}>
                                {order.orderStatus.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
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
                    onClick={openAddProduct}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/farmer/certificates')}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Manage Certifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/farmer/analytics')}>
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/farmer/customers')}>
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    Manage Customers
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/farmer/deliveries')}>
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
                <div className="mb-6">
                  <h3 className="text-beige-700 font-semibold mb-2">My Products</h3>
                  {products.length === 0 ? (
                    <div className="text-sm text-beige-500">No products yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {products.map(p => (
                        <div key={p._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-beige-200">
                          <div>
                            <div className="font-semibold text-beige-800">{p.name}</div>
                            <div className="text-sm text-beige-600">₹{p.price} • {p.stock} in stock • {p.unit}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="small" onClick={() => openEditProduct(p)}>Edit</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-beige-600">New Orders</span>
                    <span className="font-semibold text-beige-800">{todaySummary.newOrdersToday}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-beige-600">Revenue Today</span>
                    <span className="font-semibold text-green-600">₹{todaySummary.revenueToday?.toLocaleString?.() || todaySummary.revenueToday}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-beige-600">Pending Deliveries</span>
                    <span className="font-semibold text-orange-600">{todaySummary.pendingDeliveries}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-beige-600">Customer Inquiries</span>
                    <span className="font-semibold text-blue-600">{todaySummary.customerInquiries}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Farm Registration Modal */}
        <Modal
          isOpen={showFarmRegistration}
          // Prevent closing via overlay/Esc when user hasn't completed farm
          onClose={() => {
            if (hasFarm) setShowFarmRegistration(false);
          }}
          title="Farm Registration & Profile"
          description="Complete your farm profile to attract more customers"
          size="xlarge"
          variant="gradient"
          closeOnOverlayClick={!!hasFarm}
          showCloseButton={!!hasFarm}
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
              {hasFarm && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFarmRegistration(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save Farm Profile'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Product Add/Edit Modal */}
        <Modal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          title={editingProduct ? 'Edit Product' : 'Add Product'}
          description={editingProduct ? 'Update your product details' : 'Create a new product listing'}
          size="large"
          variant="gradient"
        >
          <form onSubmit={saveProduct} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Name" value={productForm.name} onChange={(e) => setProductForm(v => ({ ...v, name: e.target.value }))} required />
              <Input label="Category" value={productForm.category} onChange={(e) => setProductForm(v => ({ ...v, category: e.target.value }))} placeholder="Vegetables" />
            </div>
            <TextArea label="Description" rows={3} value={productForm.description} onChange={(e) => setProductForm(v => ({ ...v, description: e.target.value }))} placeholder="Describe this product (min 10 characters)" />
            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Price (₹)" type="number" value={productForm.price} onChange={(e) => setProductForm(v => ({ ...v, price: e.target.value }))} required />
              <Select
                label="Unit"
                value={productForm.unit}
                onChange={(e) => setProductForm(v => ({ ...v, unit: e.target.value }))}
                options={[
                  { value: 'kg', label: 'kg' },
                  { value: 'g', label: 'g' },
                  { value: 'lb', label: 'lb' },
                  { value: 'piece', label: 'piece' },
                  { value: 'bunch', label: 'bunch' },
                  { value: 'dozen', label: 'dozen' },
                  { value: 'liters', label: 'liters' }
                ]}
              />
              <Input label="Stock" type="number" value={productForm.stock} onChange={(e) => setProductForm(v => ({ ...v, stock: e.target.value }))} required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Quantity per unit" type="number" value={productForm.quantity} onChange={(e) => setProductForm(v => ({ ...v, quantity: e.target.value }))} />
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" checked={productForm.isOrganic} onChange={(e) => setProductForm(v => ({ ...v, isOrganic: e.target.checked }))} />
                <span className="text-sm text-beige-700">Organic</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowProductModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
