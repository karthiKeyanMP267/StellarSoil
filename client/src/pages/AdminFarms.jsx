import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/api';
import { 
  MapPinIcon, 
  CheckCircleIcon, 
  ClockIcon,
  EyeIcon,
  TrashIcon,
  BuildingStorefrontIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Card, StatCard } from '../components/ui/Card';
import { Input } from '../components/ui/Form';

export default function AdminFarms() {
  const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const filtered = farms.filter(farm => {
      const matchesSearch = farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           farm.owner?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'verified' && farm.owner?.isVerified) ||
                           (statusFilter === 'pending' && !farm.owner?.isVerified);
      
      return matchesSearch && matchesStatus;
    });
    setFilteredFarms(filtered);
  }, [farms, searchTerm, statusFilter]);

  const farmStats = {
    total: farms.length,
    verified: farms.filter(f => f.owner?.isVerified).length,
    pending: farms.filter(f => !f.owner?.isVerified).length,
    active: farms.filter(f => f.isActive).length
  };

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token) {
          setError('Not authenticated. Please login again.');
          return;
        }

        if (user?.role !== 'admin') {
          setError('Not authorized. Admin access required.');
          return;
        }

        const res = await API.get('/admin/farms');
        setFarms(res.data);
      } catch (err) {
        console.error('Error fetching farms:', err);
        setError(err.response?.data?.msg || err.message || 'Failed to load farms');
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  const handleToggleVerification = async (farmId, currentStatus) => {
    try {
      await API.patch(`/admin/farms/${farmId}/verify`, { 
        isVerified: !currentStatus 
      });
      
      setFarms(farms.map(farm => 
        farm._id === farmId 
          ? { ...farm, owner: { ...farm.owner, isVerified: !currentStatus } }
          : farm
      ));
    } catch (err) {
      console.error('Error updating verification:', err);
      alert('Failed to update verification status');
    }
  };

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20"
    >
      <div className="flex items-center justify-center p-8 min-h-[60vh]">
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-12 h-12 border-4 border-beige-200 border-t-beige-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h3 className="text-lg font-semibold text-beige-800">Loading Farms...</h3>
        </motion.div>
      </div>
    </motion.div>
  );
  
  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl"
        >
          <h3 className="font-bold text-lg mb-2">Error</h3>
          <p>{error}</p>
        </motion.div>
      </div>
    </motion.div>
  );

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
          <div className="bg-gradient-to-r from-beige-600 to-earth-600 rounded-3xl p-8 shadow-strong">
            <div className="flex items-center">
              <motion.div 
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-4"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <BuildingStorefrontIcon className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Farm Management</h1>
                <p className="text-beige-100 text-lg">Monitor and manage all registered farms</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-beige-50 to-beige-100 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-beige-200/50 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center">
              <motion.div 
                className="bg-gradient-to-r from-beige-500 to-beige-600 p-3 rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <BuildingStorefrontIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-sm font-medium text-beige-700">Total Farms</p>
                <motion.p 
                  className="text-2xl font-bold text-beige-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {farmStats.total}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="mt-2 flex items-center text-xs text-beige-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🏪
              </motion.div>
              <span className="ml-1">Registered farms</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-green-50 to-green-100 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center">
              <motion.div 
                className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-700">Verified</p>
                <motion.p 
                  className="text-2xl font-bold text-green-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {farmStats.verified}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="mt-2 flex items-center text-xs text-green-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                ✅
              </motion.div>
              <span className="ml-1">Quality approved</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-200/50 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center">
              <motion.div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-700">Pending</p>
                <motion.p 
                  className="text-2xl font-bold text-orange-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {farmStats.pending}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="mt-2 flex items-center text-xs text-orange-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ⏳
              </motion.div>
              <span className="ml-1">Awaiting review</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-sage-50 to-sage-100 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-sage-200/50 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center">
              <motion.div 
                className="bg-gradient-to-r from-sage-500 to-sage-600 p-3 rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <ChartBarIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-sm font-medium text-sage-700">Active</p>
                <motion.p 
                  className="text-2xl font-bold text-sage-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {farmStats.active}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="mt-2 flex items-center text-xs text-sage-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📈
              </motion.div>
              <span className="ml-1">Currently selling</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-beige-200/50 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              >
                <MapPinIcon className="h-5 w-5 text-sage-400" />
              </motion.div>
              <motion.input
                type="text"
                placeholder="Search farms by name or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-sage-50 to-beige-50 border border-sage-300 rounded-xl text-sage-800 placeholder-sage-500 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition-all duration-300 shadow-sm hover:shadow-md"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                animate={searchTerm ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {searchTerm && (
                  <motion.button
                    onClick={() => setSearchTerm('')}
                    className="text-sage-400 hover:text-sage-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </motion.button>
                )}
              </motion.div>
            </div>
            <div className="md:w-48">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <motion.div
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                  animate={{ scale: statusFilter !== 'all' ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {statusFilter === 'verified' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : statusFilter === 'pending' ? (
                    <ClockIcon className="h-5 w-5 text-orange-500" />
                  ) : (
                    <BuildingStorefrontIcon className="h-5 w-5 text-sage-400" />
                  )}
                </motion.div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-sage-50 to-beige-50 border border-sage-300 rounded-xl text-sage-800 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition-all duration-300 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                  <option value="all">🏪 All Status</option>
                  <option value="verified">✅ Verified</option>
                  <option value="pending">⏳ Pending</option>
                </select>
                <motion.div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  animate={{ rotate: statusFilter !== 'all' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChartBarIcon className="h-4 w-4 text-sage-400" />
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {(searchTerm || statusFilter !== 'all') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-center gap-2 text-sm text-sage-600"
            >
              <span>Active filters:</span>
              {searchTerm && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 bg-sage-100 text-sage-700 rounded-lg flex items-center"
                >
                  🔍 Search: "{searchTerm}"
                </motion.span>
              )}
              {statusFilter !== 'all' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 bg-sage-100 text-sage-700 rounded-lg flex items-center"
                >
                  {statusFilter === 'verified' ? '✅' : '⏳'} Status: {statusFilter}
                </motion.span>
              )}
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-2 py-1 text-xs text-red-600 hover:text-red-800 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ❌ Clear all
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Farms Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-medium border border-beige-200/50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-beige-200">
              <thead className="bg-gradient-to-r from-beige-100 to-cream-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Farm Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                <AnimatePresence>
                  {filteredFarms.map((farm, index) => (
                    <motion.tr 
                      key={farm._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-beige-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-sage-400 to-earth-400 rounded-full flex items-center justify-center mr-3">
                            <BuildingStorefrontIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-beige-900">{farm.name}</div>
                            <div className="text-sm text-beige-600">{farm.cropType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-beige-900">{farm.owner?.name}</div>
                        <div className="text-sm text-beige-600">{farm.owner?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-beige-600">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {farm.address || (farm.location?.coordinates ? 
                            `${farm.location.coordinates[1].toFixed(6)}, ${farm.location.coordinates[0].toFixed(6)}` : 
                            'Location not specified')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          farm.owner?.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {farm.owner?.isVerified ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Verified
                            </>
                          ) : (
                            <>
                              <ClockIcon className="h-4 w-4 mr-1" />
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant={farm.owner?.isVerified ? "secondary" : "success"}
                            size="small"
                            onClick={() => handleToggleVerification(farm._id, farm.owner?.isVerified)}
                            animation="default"
                          >
                            {farm.owner?.isVerified ? 'Unverify' : 'Verify'}
                          </Button>
                          <Button
                            variant="primary"
                            size="small"
                            icon={EyeIcon}
                            onClick={() => setSelectedFarm(farm)}
                            animation="default"
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {filteredFarms.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div 
                className="p-4 bg-gradient-to-r from-beige-400 to-cream-400 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BuildingStorefrontIcon className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-beige-800 mb-2">No farms found</h3>
              <p className="text-beige-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No farms have been registered yet.'}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Farm Details Modal */}
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
                className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-beige-900">Farm Details</h2>
                  <Button
                    variant="ghost"
                    size="small"
                    icon={XMarkIcon}
                    onClick={() => setSelectedFarm(null)}
                    animation="default"
                  />
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-beige-800 mb-2">Farm Information</h3>
                      <div className="space-y-2">
                        <p className="text-beige-600"><span className="font-medium">Name:</span> {selectedFarm.name}</p>
                        <p className="text-beige-600"><span className="font-medium">Crop Type:</span> {selectedFarm.cropType}</p>
                        <p className="text-beige-600"><span className="font-medium">Size:</span> {selectedFarm.size} acres</p>
                        <p className="text-beige-600"><span className="font-medium">Location:</span> {selectedFarm.address || 
                          (selectedFarm.location?.coordinates ? 
                            `${selectedFarm.location.coordinates[1].toFixed(6)}, ${selectedFarm.location.coordinates[0].toFixed(6)}` : 
                            'Location not specified')}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-beige-800 mb-2">Owner Information</h3>
                      <div className="space-y-2">
                        <p className="text-beige-600"><span className="font-medium">Name:</span> {selectedFarm.owner?.name}</p>
                        <p className="text-beige-600"><span className="font-medium">Email:</span> {selectedFarm.owner?.email}</p>
                        <p className="text-beige-600"><span className="font-medium">Phone:</span> {selectedFarm.owner?.phone}</p>
                        <p className="text-beige-600">
                          <span className="font-medium">Status:</span> 
                          <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                            selectedFarm.owner?.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {selectedFarm.owner?.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedFarm.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-beige-800 mb-2">Description</h3>
                      <p className="text-beige-600">{selectedFarm.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 mt-8">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedFarm(null)}
                    animation="default"
                  >
                    Close
                  </Button>
                  <Button
                    variant={selectedFarm.owner?.isVerified ? "secondary" : "success"}
                    onClick={() => {
                      handleToggleVerification(selectedFarm._id, selectedFarm.owner?.isVerified);
                      setSelectedFarm(null);
                    }}
                    animation="default"
                  >
                    {selectedFarm.owner?.isVerified ? 'Unverify Farm' : 'Verify Farm'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
