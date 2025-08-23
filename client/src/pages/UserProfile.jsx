import { useState, useEffect } from 'react';
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
  CogIcon,
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
    level: 'Gold Member',
    favoriteProducts: 18,
    reviews: 23,
    rating: 4.8
  };

  const tabs = [
    { id: 'profile', name: '👤 Profile', icon: UserCircleIcon },
    { id: 'orders', name: '📦 Orders', icon: ShoppingBagIcon },
    { id: 'stats', name: '📊 Statistics', icon: ChartBarIcon },
    { id: 'preferences', name: '⚙️ Preferences', icon: CogIcon },
    { id: 'security', name: '🔒 Security', icon: LockClosedIcon }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await API.put('/auth/profile', formData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating profile');
      setTimeout(() => setError(''), 5000);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20">
        <div className="flex justify-center items-center p-8">
          <div className="text-center">
            <UserCircleIcon className="h-16 w-16 text-amber-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-amber-800 mb-2">Please log in</h2>
            <p className="text-amber-700">You need to be logged in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-50 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/50 overflow-hidden mb-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 px-8 py-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-48 w-48 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full animate-ping"></div>
            
            <div className="relative flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative group">
                <div className="p-8 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <UserCircleIcon className="h-24 w-24 text-white drop-shadow-lg" />
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-gradient-to-r from-amber-600 to-orange-700 rounded-full shadow-xl hover:scale-110 transition-all duration-300">
                  <CameraIcon className="h-4 w-4 text-white" />
                </button>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-2xl tracking-tight">{user.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                  <span className={`px-6 py-3 rounded-full text-lg font-black flex items-center shadow-xl ${
                    user.role === 'admin' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                    user.role === 'farmer' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                    'bg-gradient-to-r from-amber-500 to-orange-600'
                  }`}>
                    <ShieldCheckIcon className="h-6 w-6 mr-2" />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  
                  {user.isVerified && (
                    <span className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-lg font-black flex items-center shadow-xl">
                      <CheckBadgeIcon className="h-6 w-6 mr-2" />
                      Verified Pro
                    </span>
                  )}
                  
                  <span className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full text-lg font-black flex items-center shadow-xl">
                    <TrophyIcon className="h-6 w-6 mr-2" />
                    {userStats.level}
                  </span>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                    <div className="text-3xl font-black mb-1">{userStats.totalOrders}</div>
                    <div className="text-sm font-medium opacity-90">Total Orders</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                    <div className="text-3xl font-black mb-1">₹{userStats.totalSpent.toLocaleString()}</div>
                    <div className="text-sm font-medium opacity-90">Total Spent</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                    <div className="text-3xl font-black mb-1">{userStats.loyaltyPoints}</div>
                    <div className="text-sm font-medium opacity-90">Loyalty Points</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30 flex items-center justify-center">
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-6 w-6 text-yellow-300 fill-current" />
                      <span className="text-2xl font-black">{userStats.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/50">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-xl scale-105'
                      : 'bg-white/70 text-amber-800 hover:bg-white/90 hover:scale-105 shadow-lg'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8">
              {/* Messages */}
              {success && (
                <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/50 rounded-2xl flex items-center animate-bounce">
                  <CheckIcon className="h-6 w-6 text-orange-600 mr-3" />
                  <span className="text-orange-800 font-bold text-lg">{success} 🎉</span>
                </div>
              )}
              
              {error && (
                <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300/50 rounded-2xl flex items-center">
                  <XMarkIcon className="h-6 w-6 text-red-600 mr-3" />
                  <span className="text-red-800 font-bold text-lg">{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 tracking-wide">✏️ Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-700 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
                  >
                    <PencilIcon className="h-6 w-6 mr-3" />
                    ✨ Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-black rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 text-lg"
                  >
                    <XMarkIcon className="h-6 w-6 mr-3" />
                    ❌ Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Name */}
                  <div>
                    <label className="block text-amber-900 font-black mb-4 text-xl">
                      <UserCircleIcon className="h-6 w-6 inline mr-2" />
                      👤 Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-6 py-4 rounded-2xl border-2 text-lg font-medium transition-all duration-300 ${
                        isEditing 
                          ? 'border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200/50 bg-white shadow-lg' 
                          : 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800'
                      }`}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-amber-900 font-black mb-4 text-xl">
                      <EnvelopeIcon className="h-6 w-6 inline mr-2" />
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-6 py-4 rounded-2xl border-2 text-lg font-medium transition-all duration-300 ${
                        isEditing 
                          ? 'border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200/50 bg-white shadow-lg' 
                          : 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800'
                      }`}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-amber-900 font-black mb-4 text-xl">
                      <PhoneIcon className="h-6 w-6 inline mr-2" />
                      📱 Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-6 py-4 rounded-2xl border-2 text-lg font-medium transition-all duration-300 ${
                        isEditing 
                          ? 'border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200/50 bg-white shadow-lg' 
                          : 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800'
                      }`}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-amber-900 font-black mb-4 text-xl">
                      <ShieldCheckIcon className="h-6 w-6 inline mr-2" />
                      🛡️ Account Type
                    </label>
                    <input
                      type="text"
                      value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      disabled
                      className="w-full px-6 py-4 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 text-lg font-bold"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-amber-900 font-black mb-4 text-xl">
                    <MapPinIcon className="h-6 w-6 inline mr-2" />
                    📍 Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    className={`w-full px-6 py-4 rounded-2xl border-2 text-lg font-medium transition-all duration-300 resize-none ${
                      isEditing 
                        ? 'border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200/50 bg-white shadow-lg' 
                        : 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800'
                    }`}
                    placeholder="Enter your complete address with city, state, and pincode"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-center pt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center px-12 py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-xl tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <SparklesIcon className="h-7 w-7 mr-3 animate-spin" />
                          ✨ Saving Changes...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-7 w-7 mr-3" />
                          💾 Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-8 tracking-wide">📦 Order History</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((order) => (
                  <div key={order} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-black text-amber-900">Order #{order}0{order * 3}</span>
                      <span className="px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600 text-white rounded-full text-sm font-bold">
                        ✅ Delivered
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-amber-800 font-medium">Date:</span>
                        <span className="text-amber-900 font-bold">2024-0{order}-15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-800 font-medium">Amount:</span>
                        <span className="text-amber-900 font-bold">₹{(order * 450 + 200).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-800 font-medium">Items:</span>
                        <span className="text-amber-900 font-bold">{order + 1} products</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-700 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                      📄 View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              {/* Achievement Cards */}
              <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-8 tracking-wide">🏆 Achievements & Stats</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-all duration-300">
                    <TrophyIcon className="h-12 w-12 mb-4 drop-shadow-lg" />
                    <div className="text-3xl font-black mb-2">{userStats.totalOrders}</div>
                    <div className="font-bold opacity-90">Total Orders</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-all duration-300">
                    <CreditCardIcon className="h-12 w-12 mb-4 drop-shadow-lg" />
                    <div className="text-3xl font-black mb-2">₹{userStats.totalSpent.toLocaleString()}</div>
                    <div className="font-bold opacity-90">Total Spent</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-all duration-300">
                    <GiftIcon className="h-12 w-12 mb-4 drop-shadow-lg" />
                    <div className="text-3xl font-black mb-2">{userStats.loyaltyPoints}</div>
                    <div className="font-bold opacity-90">Loyalty Points</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-all duration-300">
                    <StarIcon className="h-12 w-12 mb-4 drop-shadow-lg fill-current" />
                    <div className="text-3xl font-black mb-2">{userStats.rating}/5</div>
                    <div className="font-bold opacity-90">Average Rating</div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8">
                  <h3 className="text-2xl font-black text-amber-900 mb-6 flex items-center">
                    <HeartIcon className="h-8 w-8 mr-3 text-red-500" />
                    💖 Favorites & Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-800 font-medium">Favorite Products:</span>
                      <span className="text-2xl font-black text-amber-900">{userStats.favoriteProducts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-800 font-medium">Reviews Written:</span>
                      <span className="text-2xl font-black text-amber-900">{userStats.reviews}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-800 font-medium">Member Since:</span>
                      <span className="text-lg font-bold text-amber-900">{new Date(userStats.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8">
                  <h3 className="text-2xl font-black text-amber-900 mb-6 flex items-center">
                    <FireIcon className="h-8 w-8 mr-3 text-orange-500" />
                    🔥 Current Streak
                  </h3>
                  <div className="text-center">
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-4">7</div>
                    <div className="text-xl font-bold text-amber-800">Days of Active Shopping</div>
                    <div className="mt-4 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl border border-orange-200">
                      <p className="text-orange-800 font-medium">Keep it up! You're on fire! 🔥</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-8 tracking-wide">⚙️ Preferences</h2>
              
              <div className="space-y-8">
                {/* Notification Settings */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200/50 p-6">
                  <h3 className="text-2xl font-black text-amber-900 mb-6 flex items-center">
                    <BellIcon className="h-8 w-8 mr-3" />
                    🔔 Notification Settings
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: '📧 Email Notifications', checked: true },
                      { label: '📱 SMS Notifications', checked: false },
                      { label: '🛒 Order Updates', checked: true },
                      { label: '🎉 Promotional Offers', checked: true },
                      { label: '⭐ Review Reminders', checked: false }
                    ].map((setting, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-amber-200/50">
                        <span className="text-amber-900 font-bold text-lg">{setting.label}</span>
                        <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 ${
                          setting.checked ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'
                        }`}>
                          <div className={`w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                            setting.checked ? 'translate-x-6' : 'translate-x-0'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200/50 p-6">
                  <h3 className="text-2xl font-black text-blue-900 mb-6 flex items-center">
                    <LockClosedIcon className="h-8 w-8 mr-3" />
                    🔒 Privacy Settings
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: '👥 Public Profile', checked: false },
                      { label: '📊 Share Analytics', checked: true },
                      { label: '🎯 Personalized Ads', checked: true },
                      { label: '📍 Location Services', checked: false }
                    ].map((setting, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-blue-200/50">
                        <span className="text-blue-900 font-bold text-lg">{setting.label}</span>
                        <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 ${
                          setting.checked ? 'bg-gradient-to-r from-blue-500 to-cyan-600' : 'bg-gray-300'
                        }`}>
                          <div className={`w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                            setting.checked ? 'translate-x-6' : 'translate-x-0'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-8 tracking-wide">🔒 Security Settings</h2>
              
              <div className="space-y-8">
                {/* Password Change */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-200/50 p-6">
                  <h3 className="text-2xl font-black text-red-900 mb-6 flex items-center">
                    <LockClosedIcon className="h-8 w-8 mr-3" />
                    🔑 Change Password
                  </h3>
                  <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-700 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg">
                    🔐 Update Password
                  </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200/50 p-6">
                  <h3 className="text-2xl font-black text-green-900 mb-4 flex items-center">
                    <ShieldCheckIcon className="h-8 w-8 mr-3" />
                    🛡️ Two-Factor Authentication
                  </h3>
                  <p className="text-green-800 font-medium mb-6">Add an extra layer of security to your account</p>
                  <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg">
                    ✅ Enable 2FA
                  </button>
                </div>

                {/* Login History */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200/50 p-6">
                  <h3 className="text-2xl font-black text-blue-900 mb-6 flex items-center">
                    <CalendarIcon className="h-8 w-8 mr-3" />
                    📅 Recent Login Activity
                  </h3>
                  <div className="space-y-4">
                    {[
                      { device: 'Windows PC - Chrome', location: 'Delhi, India', time: '2 hours ago', current: true },
                      { device: 'iPhone 12 - Safari', location: 'Mumbai, India', time: '1 day ago', current: false },
                      { device: 'Android - Chrome', location: 'Bangalore, India', time: '3 days ago', current: false }
                    ].map((login, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-blue-200/50">
                        <div>
                          <div className="text-blue-900 font-bold text-lg flex items-center">
                            {login.device}
                            {login.current && <span className="ml-3 px-3 py-1 bg-green-500 text-white rounded-full text-sm">Current</span>}
                          </div>
                          <div className="text-blue-700 font-medium">{login.location} • {login.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
