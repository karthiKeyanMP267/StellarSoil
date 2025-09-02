import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBagIcon,
  HeartIcon,
  ClockIcon,
  UserIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  ChartBarIcon,
  StarIcon,
  GiftIcon,
  BellIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Import new feature components
import PersonalizedShoppingAssistant from '../components/PersonalizedShoppingAssistant';
import NutritionalTracking from '../components/NutritionalTracking';
import SeasonalSubscriptionBox from '../components/SeasonalSubscriptionBox';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    recentOrders: 0,
    favoriteItems: 0,
    totalSpent: 0,
    healthScore: 0,
    sustainabilityPoints: 0,
    subscriptionStatus: 'none'
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate enhanced dashboard data - replace with actual API calls
      setStats({
        recentOrders: 8,
        favoriteItems: 24,
        totalSpent: 2850.75,
        healthScore: 87,
        sustainabilityPoints: 1245,
        subscriptionStatus: 'active'
      });

      setNotifications([
        {
          id: 1,
          type: 'offer',
          title: 'Special Discount on Organic Vegetables',
          message: '25% off on all organic vegetables this week!',
          time: '2 hours ago',
          read: false
        },
        {
          id: 2,
          type: 'health',
          title: 'Weekly Nutrition Goal Achieved',
          message: 'Congratulations! You met your vitamin C intake goal.',
          time: '1 day ago',
          read: false
        },
        {
          id: 3,
          type: 'subscription',
          title: 'September Box Ready for Shipment',
          message: 'Your seasonal subscription box will arrive tomorrow.',
          time: '2 days ago',
          read: true
        }
      ]);

      setAchievements([
        {
          id: 1,
          title: 'Health Conscious Buyer',
          description: 'Purchased 50+ organic products',
          icon: '🌱',
          earned: true,
          date: '2024-08-15'
        },
        {
          id: 2,
          title: 'Sustainability Champion',
          description: 'Earned 1000+ sustainability points',
          icon: '🌍',
          earned: true,
          date: '2024-08-20'
        },
        {
          id: 3,
          title: 'Community Supporter',
          description: 'Supported 10+ local farmers',
          icon: '🤝',
          earned: true,
          date: '2024-08-25'
        },
        {
          id: 4,
          title: 'Recipe Explorer',
          description: 'Try 25 AI-recommended recipes',
          icon: '👨‍🍳',
          earned: false,
          progress: 18
        }
      ]);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20"
      >
        <div className="flex justify-center items-center p-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-16 h-16 border-4 border-beige-200 border-t-beige-600 rounded-full"></div>
            <SparklesIcon className="absolute inset-0 h-8 w-8 m-auto text-beige-600 animate-pulse" />
          </motion.div>
          <span className="ml-4 text-beige-800 font-medium text-lg">Loading your personalized dashboard...</span>
        </div>
      </motion.div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'shopping', name: 'Smart Shopping', icon: SparklesIcon },
    { id: 'nutrition', name: 'Nutrition Tracking', icon: HeartIcon },
    { id: 'subscription', name: 'Subscription Box', icon: GiftIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-beige-200/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-4 bg-gradient-to-r from-beige-600 to-earth-700 rounded-2xl shadow-xl"
                >
                  <UserIcon className="h-10 w-10 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-earth-800 to-beige-900 bg-clip-text text-transparent">
                    Welcome back, {user?.name}!
                  </h1>
                  <p className="text-beige-700 mt-2 text-lg font-medium">Your personalized agricultural marketplace dashboard</p>
                </div>
              </div>
              
              {/* Notifications Bell */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <BellIcon className="h-6 w-6 text-white" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-2xl shadow-lg text-white"
              >
                <ClockIcon className="h-6 w-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{stats.recentOrders}</p>
                <p className="text-sm opacity-90">Recent Orders</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-pink-400 to-red-500 p-4 rounded-2xl shadow-lg text-white"
              >
                <HeartIcon className="h-6 w-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{stats.favoriteItems}</p>
                <p className="text-sm opacity-90">Favorites</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-400 to-indigo-500 p-4 rounded-2xl shadow-lg text-white"
              >
                <CurrencyDollarIcon className="h-6 w-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">${stats.totalSpent}</p>
                <p className="text-sm opacity-90">Total Spent</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-400 to-violet-500 p-4 rounded-2xl shadow-lg text-white"
              >
                <ArrowTrendingUpIcon className="h-6 w-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{stats.healthScore}%</p>
                <p className="text-sm opacity-90">Health Score</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-orange-400 to-amber-500 p-4 rounded-2xl shadow-lg text-white"
              >
                <ShieldCheckIcon className="h-6 w-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{stats.sustainabilityPoints}</p>
                <p className="text-sm opacity-90">Eco Points</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-teal-400 to-cyan-500 p-4 rounded-2xl shadow-lg text-white"
              >
                <GiftIcon className="h-6 w-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold capitalize">{stats.subscriptionStatus}</p>
                <p className="text-sm opacity-90">Subscription</p>
              </motion.div>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-beige-200 shadow-lg">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-beige-500 to-earth-600 text-white shadow-lg'
                      : 'text-beige-600 hover:bg-beige-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
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
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link
                  to="/marketplace"
                  className="group"
                >
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-white/90 to-beige-50/80 backdrop-blur-lg rounded-2xl shadow-xl border border-beige-200/50 p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                        <BuildingStorefrontIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-earth-700 group-hover:text-earth-800">Marketplace</h3>
                        <p className="text-beige-600 text-sm">Browse fresh produce</p>
                      </div>
                    </div>
                    <div className="text-xs text-beige-500">
                      New arrivals from 12 local farms
                    </div>
                  </motion.div>
                </Link>

                <Link
                  to="/cart"
                  className="group"
                >
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-white/90 to-beige-50/80 backdrop-blur-lg rounded-2xl shadow-xl border border-beige-200/50 p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                        <ShoppingBagIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-earth-700 group-hover:text-earth-800">Shopping Cart</h3>
                        <p className="text-beige-600 text-sm">3 items waiting</p>
                      </div>
                    </div>
                    <div className="text-xs text-beige-500">
                      Total: $67.50
                    </div>
                  </motion.div>
                </Link>

                <Link
                  to="/favorites"
                  className="group"
                >
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-white/90 to-beige-50/80 backdrop-blur-lg rounded-2xl shadow-xl border border-beige-200/50 p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-pink-500 to-red-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                        <HeartIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-earth-700 group-hover:text-earth-800">Favorites</h3>
                        <p className="text-beige-600 text-sm">{stats.favoriteItems} saved items</p>
                      </div>
                    </div>
                    <div className="text-xs text-beige-500">
                      2 items on sale now
                    </div>
                  </motion.div>
                </Link>

                <Link
                  to="/orders"
                  className="group"
                >
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-white/90 to-beige-50/80 backdrop-blur-lg rounded-2xl shadow-xl border border-beige-200/50 p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                        <ClockIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-earth-700 group-hover:text-earth-800">Order History</h3>
                        <p className="text-beige-600 text-sm">Track your orders</p>
                      </div>
                    </div>
                    <div className="text-xs text-beige-500">
                      Latest order arriving today
                    </div>
                  </motion.div>
                </Link>
              </div>

              {/* Recent Activity & Achievements */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Notifications */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-2xl shadow-xl border border-beige-200/50 p-6"
                >
                  <h3 className="text-xl font-bold text-earth-700 mb-4 flex items-center">
                    <BellIcon className="h-6 w-6 mr-2 text-blue-600" />
                    Recent Notifications
                  </h3>
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <motion.div
                        key={notification.id}
                        whileHover={{ x: 5 }}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          notification.read
                            ? 'border-beige-200 bg-white/60'
                            : 'border-blue-200 bg-blue-50/60'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            notification.type === 'offer' ? 'bg-green-100 text-green-600' :
                            notification.type === 'health' ? 'bg-purple-100 text-purple-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {notification.type === 'offer' ? '🎯' : 
                             notification.type === 'health' ? '💪' : '📦'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-earth-700 text-sm">{notification.title}</h4>
                            <p className="text-beige-600 text-xs mt-1">{notification.message}</p>
                            <p className="text-beige-500 text-xs mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Achievements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-2xl shadow-xl border border-beige-200/50 p-6"
                >
                  <h3 className="text-xl font-bold text-earth-700 mb-4 flex items-center">
                    <TrophyIcon className="h-6 w-6 mr-2 text-yellow-600" />
                    Recent Achievements
                  </h3>
                  <div className="space-y-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          achievement.earned
                            ? 'border-yellow-200 bg-yellow-50/60'
                            : 'border-beige-200 bg-white/60'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-earth-700 text-sm">{achievement.title}</h4>
                            <p className="text-beige-600 text-xs mt-1">{achievement.description}</p>
                            {achievement.earned ? (
                              <p className="text-green-600 text-xs mt-2 font-medium">
                                Earned on {new Date(achievement.date).toLocaleDateString()}
                              </p>
                            ) : (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-beige-600">Progress</span>
                                  <span className="text-beige-700">{achievement.progress}/25</span>
                                </div>
                                <div className="w-full bg-beige-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(achievement.progress / 25) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'shopping' && (
            <motion.div
              key="shopping"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PersonalizedShoppingAssistant userId={user?.id} />
            </motion.div>
          )}

          {activeTab === 'nutrition' && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NutritionalTracking userId={user?.id} />
            </motion.div>
          )}

          {activeTab === 'subscription' && (
            <motion.div
              key="subscription"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SeasonalSubscriptionBox userId={user?.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
