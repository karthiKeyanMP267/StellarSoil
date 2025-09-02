import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CameraIcon,
  StarIcon,
  TrophyIcon,
  CalendarIcon,
  BellIcon,
  Cog6ToothIcon,
  HeartIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  GiftIcon,
  CreditCardIcon,
  LockClosedIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Mock user stats and data
  const userStats = {
    totalOrders: 42,
    totalSpent: 15750,
    joinDate: '2023-01-15',
    loyaltyPoints: 2840,
    favoriteProducts: 18,
    averageRating: 4.8,
    membershipLevel: 'Gold',
    nextLevelPoints: 160
  };

  const recentOrders = [
    {
      id: '1',
      date: '2024-01-20',
      total: 450,
      status: 'Delivered',
      items: ['Organic Tomatoes', 'Fresh Spinach', 'Carrots']
    },
    {
      id: '2',
      date: '2024-01-18',
      total: 320,
      status: 'Delivered',
      items: ['Organic Apples', 'Bananas', 'Mixed Berries']
    },
    {
      id: '3',
      date: '2024-01-15',
      total: 680,
      status: 'In Transit',
      items: ['Organic Rice', 'Quinoa', 'Almonds']
    }
  ];

  const achievements = [
    { id: 1, title: 'First Order', description: 'Completed your first purchase', icon: '🏆', unlocked: true },
    { id: 2, title: 'Organic Lover', description: '50+ organic products purchased', icon: '🌿', unlocked: true },
    { id: 3, title: 'Loyal Customer', description: '6 months of regular purchases', icon: '💚', unlocked: true },
    { id: 4, title: 'Review Master', description: 'Written 25+ product reviews', icon: '⭐', unlocked: false },
    { id: 5, title: 'Eco Warrior', description: 'Reduced plastic usage by 80%', icon: '🌍', unlocked: true },
    { id: 6, title: 'Early Bird', description: '10+ orders before 8 AM', icon: '🌅', unlocked: false }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await API.put('/auth/profile', formData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully! ✨');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
    setError('');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: UserCircleIcon },
    { id: 'orders', label: 'Order History', icon: ShoppingBagIcon },
    { id: 'achievements', label: 'Achievements', icon: TrophyIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-beige-50 relative overflow-hidden pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 -left-10 w-72 h-72 bg-gradient-to-r from-beige-300/20 to-sage-300/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 -right-10 w-96 h-96 bg-gradient-to-r from-cream-300/20 to-earth-300/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {['👤', '⭐', '🏆', '💚', '✨'][i]}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="bg-gradient-to-r from-beige-100/90 to-sage-100/90 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-beige-200/50 shadow-2xl"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Picture */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-32 h-32 bg-gradient-to-r from-beige-500 to-sage-500 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-beige-400/30 to-sage-400/30 rounded-full blur-lg opacity-0 group-hover:opacity-100"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <motion.button 
                className="absolute -bottom-2 -right-2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-beige-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <CameraIcon className="h-5 w-5 text-earth-600" />
              </motion.button>
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h1 
                className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-beige-700 via-sage-600 to-earth-700 mb-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Welcome back, {user?.name}! 👋
              </motion.h1>
              
              <motion.div 
                className="flex flex-wrap justify-center lg:justify-start items-center space-x-4 text-earth-600 mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-5 w-5" />
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Member since {new Date(userStats.joinDate).toLocaleDateString()}</span>
                </div>
              </motion.div>

              {/* Membership Badge */}
              <motion.div 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <TrophyIcon className="h-5 w-5" />
                <span>{userStats.membershipLevel} Member</span>
              </motion.div>
            </div>

            {/* Quick Stats */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                { label: 'Total Orders', value: userStats.totalOrders, icon: '📦' },
                { label: 'Loyalty Points', value: userStats.loyaltyPoints, icon: '💎' },
                { label: 'Total Spent', value: `₹${userStats.totalSpent}`, icon: '💰' },
                { label: 'Avg Rating', value: userStats.averageRating, icon: '⭐' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-beige-200/50 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + (index * 0.1) }}
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-lg font-bold text-earth-800">{stat.value}</div>
                  <div className="text-xs text-earth-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex flex-wrap justify-center space-x-1 mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-2 border border-beige-200/50 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-beige-500 to-sage-500 text-white shadow-lg'
                  : 'text-earth-700 hover:bg-beige-50/70'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-beige-200/50 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-earth-800 flex items-center space-x-3">
                  <UserCircleIcon className="h-8 w-8 text-beige-600" />
                  <span>Profile Information</span>
                </h2>
                
                {!isEditing ? (
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-beige-500 to-sage-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-beige-600 hover:to-sage-600 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span>Edit Profile</span>
                  </motion.button>
                ) : (
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <XMarkIcon className="h-5 w-5" />
                      <span>Cancel</span>
                    </motion.button>
                    <motion.button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <CheckIcon className="h-5 w-5" />
                      )}
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Alert Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-lg"
                  >
                    ❌ {error}
                  </motion.div>
                )}
                
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50/80 backdrop-blur-sm border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 shadow-lg"
                  >
                    ✅ {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="flex items-center space-x-2 text-earth-700 font-semibold mb-3">
                      <UserCircleIcon className="h-5 w-5" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        isEditing
                          ? 'bg-white border-beige-300 focus:border-beige-500 focus:ring-2 focus:ring-beige-200'
                          : 'bg-beige-50/50 border-beige-200 cursor-not-allowed'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="flex items-center space-x-2 text-earth-700 font-semibold mb-3">
                      <EnvelopeIcon className="h-5 w-5" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        isEditing
                          ? 'bg-white border-beige-300 focus:border-beige-500 focus:ring-2 focus:ring-beige-200'
                          : 'bg-beige-50/50 border-beige-200 cursor-not-allowed'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="flex items-center space-x-2 text-earth-700 font-semibold mb-3">
                      <PhoneIcon className="h-5 w-5" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        isEditing
                          ? 'bg-white border-beige-300 focus:border-beige-500 focus:ring-2 focus:ring-beige-200'
                          : 'bg-beige-50/50 border-beige-200 cursor-not-allowed'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Address Field */}
                  <div>
                    <label className="flex items-center space-x-2 text-earth-700 font-semibold mb-3">
                      <MapPinIcon className="h-5 w-5" />
                      <span>Address</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 resize-none ${
                        isEditing
                          ? 'bg-white border-beige-300 focus:border-beige-500 focus:ring-2 focus:ring-beige-200'
                          : 'bg-beige-50/50 border-beige-200 cursor-not-allowed'
                      }`}
                      placeholder="Enter your full address"
                    />
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-beige-200/50 shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-earth-800 flex items-center space-x-3 mb-8">
                <ShoppingBagIcon className="h-8 w-8 text-beige-600" />
                <span>Order History</span>
              </h2>

              <div className="space-y-6">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-beige-50/50 to-sage-50/50 rounded-2xl p-6 border border-beige-200/30 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-earth-800">Order #{order.id}</h3>
                        <p className="text-earth-600">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-beige-600">₹{order.total}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-700' 
                            : order.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, itemIndex) => (
                        <span
                          key={itemIndex}
                          className="bg-white/70 backdrop-blur-sm text-earth-700 px-3 py-1 rounded-full text-sm border border-beige-200/50"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-beige-200/50 shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-earth-800 flex items-center space-x-3 mb-8">
                <TrophyIcon className="h-8 w-8 text-beige-600" />
                <span>Achievements & Rewards</span>
              </h2>

              {/* Progress Bar */}
              <div className="bg-gradient-to-r from-beige-100 to-sage-100 rounded-2xl p-6 mb-8 border border-beige-200/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-earth-800">Progress to Platinum Level</span>
                  <span className="text-beige-600 font-semibold">{userStats.loyaltyPoints} / {userStats.loyaltyPoints + userStats.nextLevelPoints} points</span>
                </div>
                <div className="w-full bg-white/70 rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-beige-500 to-sage-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(userStats.loyaltyPoints / (userStats.loyaltyPoints + userStats.nextLevelPoints)) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <p className="text-earth-600 text-sm mt-2">Only {userStats.nextLevelPoints} more points to unlock Platinum benefits!</p>
              </div>

              {/* Achievements Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`rounded-2xl p-6 border shadow-lg transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-xl'
                        : 'bg-gray-50/70 border-gray-200 opacity-60'
                    }`}
                    whileHover={achievement.unlocked ? { scale: 1.02, y: -2 } : {}}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="font-bold text-earth-800 mb-2">{achievement.title}</h3>
                      <p className="text-earth-600 text-sm">{achievement.description}</p>
                      {achievement.unlocked && (
                        <div className="mt-4">
                          <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            ✓ Unlocked
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-beige-200/50 shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-earth-800 flex items-center space-x-3 mb-8">
                <Cog6ToothIcon className="h-8 w-8 text-beige-600" />
                <span>Settings & Preferences</span>
              </h2>

              <div className="space-y-6">
                {[
                  { icon: BellIcon, title: 'Notifications', description: 'Manage your notification preferences' },
                  { icon: ShieldCheckIcon, title: 'Privacy & Security', description: 'Control your privacy settings' },
                  { icon: CreditCardIcon, title: 'Payment Methods', description: 'Manage your payment options' },
                  { icon: LockClosedIcon, title: 'Change Password', description: 'Update your account password' },
                  { icon: UserGroupIcon, title: 'Account Sharing', description: 'Family account settings' },
                  { icon: GiftIcon, title: 'Referral Program', description: 'Invite friends and earn rewards' }
                ].map((setting, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-beige-50/50 to-sage-50/50 rounded-2xl p-6 border border-beige-200/30 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-beige-500 to-sage-500 rounded-xl p-3">
                          <setting.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-earth-800">{setting.title}</h3>
                          <p className="text-earth-600 text-sm">{setting.description}</p>
                        </div>
                      </div>
                      <ChartBarIcon className="h-5 w-5 text-earth-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default UserProfile;
