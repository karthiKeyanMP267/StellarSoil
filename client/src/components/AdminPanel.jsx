import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API, { adminApi } from '../api/api';
import { 
  UserGroupIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import { Card, StatCard } from './ui/Card';

export default function AdminPanel() {
  const [pendingFarmers, setPendingFarmers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarms: 0,
    verifiedFarms: 0,
    pendingVerifications: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [farmersRes, usersRes, farmsRes] = await Promise.all([
        adminApi.getPendingFarmers(),
        API.get('/admin/users'),
        API.get('/admin/farms')
      ]);
      
      setPendingFarmers(farmersRes.data);
      
      const users = usersRes.data;
      const farms = farmsRes.data;
      
      setStats({
        totalUsers: users.length,
        totalFarms: farms.length,
        verifiedFarms: farms.filter(f => f.owner?.isVerified).length,
        pendingVerifications: farmersRes.data.length
      });
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (farmerId) => {
    try {
      setActionLoading(true);
      await adminApi.approveFarmer(farmerId);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to approve farmer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (farmerId) => {
    try {
      const reason = prompt('Please enter a reason for rejection:');
      if (!reason) return;
      setActionLoading(true);
      await adminApi.rejectFarmer(farmerId, reason);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to reject farmer');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20"
      >
        <div className="flex justify-center items-center p-8 min-h-[60vh]">
          <motion.div 
            className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-beige-200"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="relative mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 border-4 border-beige-300 border-t-earth-500 rounded-full shadow-lg"></div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <SparklesIcon className="w-6 h-6 text-beige-600" />
              </motion.div>
            </motion.div>
            <h3 className="text-lg font-semibold text-beige-700 mb-2">Loading Admin Dashboard</h3>
            <p className="text-beige-600">Fetching the latest data...</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-beige-600 to-earth-600 rounded-3xl p-8 shadow-xl border border-beige-200">
            <div className="flex items-center">
              <motion.div 
                className="p-3 bg-white/30 rounded-2xl mr-4 shadow"
                whileHover={{ scale: 1.07, rotate: 3 }}
                transition={{ duration: 0.3 }}
              >
                <ChartBarIcon className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow">Admin Dashboard</h1>
                <p className="text-beige-100 text-lg">Monitor and manage platform activities</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-beige-200 p-6">
            <nav className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="medium"
                icon={ChartBarIcon}
                animation="bounce"
                className="flex-1 min-w-fit"
                onClick={() => window.location.href = '/admin'}
              >
                Dashboard
              </Button>
              <Button
                variant="secondary"
                size="medium"
                icon={UserGroupIcon}
                animation="default"
                className="flex-1 min-w-fit"
                onClick={() => window.location.href = '/admin/users'}
              >
                Manage Users
              </Button>
              <Button
                variant="earth"
                size="medium"
                icon={BuildingStorefrontIcon}
                animation="default"
                className="flex-1 min-w-fit"
                onClick={() => window.location.href = '/admin/farms'}
              >
                Manage Farms
              </Button>
            </nav>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-center shadow"
            >
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <span className="text-red-800 font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={UserGroupIcon}
            color="beige"
            trend="+12%"
            subtitle="Active platform members"
          />
          <StatCard
            title="Total Farms"
            value={stats.totalFarms}
            icon={BuildingStorefrontIcon}
            color="sage"
            trend="+8%"
            subtitle="Registered farming operations"
          />
          <StatCard
            title="Verified Farms"
            value={stats.verifiedFarms}
            icon={ShieldCheckIcon}
            color="cream"
            trend="+15%"
            subtitle="Quality approved farms"
          />
          <StatCard
            title="Pending Reviews"
            value={stats.pendingVerifications}
            icon={ClockIcon}
            color="earth"
            trend="urgent"
            subtitle="Awaiting verification"
          />
        </motion.div>

        {/* Pending Verifications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-beige-200/50 overflow-hidden"
        >
          <div className="px-6 py-5 bg-gradient-to-r from-beige-100 to-cream-100 border-b border-beige-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <motion.div 
                  className="p-2 bg-gradient-to-r from-beige-500 to-earth-500 rounded-xl mr-3"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ClockIcon className="h-5 w-5 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-beige-800">
                  Pending Farmer Verifications
                </h2>
              </div>
              {pendingFarmers.length > 0 && (
                <motion.div 
                  className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full text-white text-sm font-semibold shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {pendingFarmers.length} pending
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {pendingFarmers.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div 
                  className="p-4 bg-gradient-to-r from-beige-500 to-earth-500 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CheckCircleIcon className="h-10 w-10 text-white" />
                </motion.div>
                <motion.h3 
                  className="text-xl font-bold text-beige-800 mb-2"
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  All caught up! 🎉
                </motion.h3>
                <motion.p 
                  className="text-beige-600"
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  No pending farmer verifications at the moment.
                </motion.p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {pendingFarmers.map((farmer, index) => (
                  <motion.div
                    key={farmer._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="bg-gradient-to-r from-beige-50 to-cream-50 border border-beige-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-r from-beige-400 to-cream-400 rounded-full flex items-center justify-center shadow-md"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-white font-bold text-lg">
                            {farmer.name.charAt(0).toUpperCase()}
                          </span>
                        </motion.div>
                        <div>
                          <h4 className="text-lg font-semibold text-beige-900">{farmer.name}</h4>
                          <p className="text-beige-600">{farmer.email}</p>
                          <div className="flex items-center text-sm text-beige-500 mt-1">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            Applied {new Date(farmer.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button
                          variant="success"
                          size="medium"
                          icon={CheckCircleIcon}
                          loading={actionLoading}
                          onClick={() => handleApprove(farmer._id)}
                          animation="bounce"
                          className="shadow-lg hover:shadow-xl"
                        >
                          {actionLoading ? 'Processing...' : 'Approve'}
                        </Button>
                        <Button
                          variant="danger"
                          size="medium"
                          icon={ExclamationTriangleIcon}
                          loading={actionLoading}
                          onClick={() => handleReject(farmer._id)}
                          animation="default"
                          className="shadow-lg hover:shadow-xl"
                        >
                          {actionLoading ? 'Processing...' : 'Reject'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
