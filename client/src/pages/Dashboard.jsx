import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBagIcon,
  HeartIcon,
  ClockIcon,
  UserIcon,
  BuildingStorefrontIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    recentOrders: 0,
    favoriteItems: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate dashboard data - replace with actual API calls
      setStats({
        recentOrders: 3,
        favoriteItems: 8,
        totalSpent: 1250.50
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20">
        <div className="flex justify-center items-center p-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
            <SparklesIcon className="absolute inset-0 h-6 w-6 m-auto text-amber-600 animate-pulse" />
          </div>
          <span className="ml-4 text-amber-800 font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-yellow-200/30 p-8 hover:shadow-3xl transition-all duration-500">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-600 to-amber-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-yellow-800 to-amber-900 bg-clip-text text-transparent drop-shadow-lg">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-yellow-800 mt-2 text-lg font-medium tracking-wide">Discover what's happening with your agricultural journey</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-amber-500 p-8 rounded-2xl shadow-xl hover:shadow-3xl transition-all duration-300 group transform hover:scale-105">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 bg-white/10 rounded-full"></div>
              <div className="relative">
                <ClockIcon className="h-10 w-10 text-amber-100 mb-6 group-hover:scale-110 transition-transform drop-shadow-lg" />
                <p className="text-4xl font-black text-white tracking-tight drop-shadow-md">{stats.recentOrders}</p>
                <p className="text-amber-100 font-semibold tracking-wide mt-2">Recent Orders</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-yellow-700 p-8 rounded-2xl shadow-xl hover:shadow-3xl transition-all duration-300 group transform hover:scale-105">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 bg-white/10 rounded-full"></div>
              <div className="relative">
                <HeartIcon className="h-10 w-10 text-red-100 mb-6 group-hover:scale-110 transition-transform drop-shadow-lg" />
                <p className="text-4xl font-black text-white tracking-tight drop-shadow-md">{stats.favoriteItems}</p>
                <p className="text-red-100 font-semibold tracking-wide mt-2">Favorite Items</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden bg-gradient-to-br from-yellow-600 to-amber-600 p-8 rounded-2xl shadow-xl hover:shadow-3xl transition-all duration-300 group transform hover:scale-105">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 bg-white/10 rounded-full"></div>
              <div className="relative">
                <ShoppingBagIcon className="h-10 w-10 text-orange-100 mb-6 group-hover:scale-110 transition-transform drop-shadow-lg" />
                <p className="text-4xl font-black text-white tracking-tight drop-shadow-md">₹{stats.totalSpent}</p>
                <p className="text-orange-100 font-semibold tracking-wide mt-2">Total Spent</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link
              to="/marketplace"
              className="group bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-amber-200/50 p-8 hover:shadow-3xl transition-all duration-300 hover:border-amber-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl group-hover:scale-110 transition-transform shadow-xl">
                  <BuildingStorefrontIcon className="h-8 w-8 text-white drop-shadow-md" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-amber-900 group-hover:text-amber-800 tracking-wide">Marketplace</h3>
                  <p className="text-amber-700 font-medium tracking-wide mt-1">Browse fresh produce</p>
                </div>
              </div>
            </Link>

            <Link
              to="/cart"
              className="group bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-amber-200/50 p-8 hover:shadow-3xl transition-all duration-300 hover:border-amber-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl group-hover:scale-110 transition-transform shadow-xl">
                  <ShoppingBagIcon className="h-8 w-8 text-white drop-shadow-md" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-amber-900 group-hover:text-amber-800 tracking-wide">Shopping Cart</h3>
                  <p className="text-amber-700 font-medium tracking-wide mt-1">View your items</p>
                </div>
              </div>
            </Link>

            <Link
              to="/favorites"
              className="group bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-amber-200/50 p-8 hover:shadow-3xl transition-all duration-300 hover:border-amber-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl group-hover:scale-110 transition-transform shadow-xl">
                  <HeartIcon className="h-8 w-8 text-white drop-shadow-md" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-amber-900 group-hover:text-amber-800 tracking-wide">Favorites</h3>
                  <p className="text-amber-700 font-medium tracking-wide mt-1">Saved products</p>
                </div>
              </div>
            </Link>

            <Link
              to="/orders"
              className="group bg-white rounded-xl shadow-sm border border-amber-200 p-6 hover:shadow-md transition-all duration-200 hover:border-amber-300"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg group-hover:scale-110 transition-transform">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 group-hover:text-amber-800">Order History</h3>
                  <p className="text-sm text-amber-700">Track your orders</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
