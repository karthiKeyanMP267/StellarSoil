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
          <StatCard
            icon={BuildingStorefrontIcon}
            title="Total Farms"
            value={farmStats.total}
            color="from-beige-500 to-beige-600"
            delay={0.1}
          />
          <StatCard
            icon={ShieldCheckIcon}
            title="Verified"
            value={farmStats.verified}
            color="from-green-500 to-green-600"
            delay={0.2}
          />
          <StatCard
            icon={ExclamationTriangleIcon}
            title="Pending"
            value={farmStats.pending}
            color="from-orange-500 to-orange-600"
            delay={0.3}
          />
          <StatCard
            icon={ChartBarIcon}
            title="Active"
            value={farmStats.active}
            color="from-sage-500 to-sage-600"
            delay={0.4}
          />
        </motion.div>
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center relative z-10">
              <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full">
                <CheckCircleIcon className="h-8 w-8 text-green-300" />
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">
                  {farms.filter(f => f.owner?.isVerified).length}
                </p>
                <p className="text-gray-300">Verified Farms</p>
              </div>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center relative z-10">
              <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full">
                <ClockIcon className="h-8 w-8 text-yellow-300" />
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">
                  {farms.filter(f => !f.owner?.isVerified).length}
                </p>
                <p className="text-gray-300">Pending Verification</p>
              </div>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center relative z-10">
              <div className="p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full">
                <MapPinIcon className="h-8 w-8 text-amber-300" />
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{farms.length}</p>
                <p className="text-gray-300">Total Farms</p>
              </div>
            </div>
          </div>
        </div>

        {farms.length === 0 ? (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No farms found</h3>
            <p className="text-gray-300">No farms have been registered in the system yet.</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-gradient-to-r from-amber-800/50 to-orange-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Farm Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {farms.map(farm => (
                    <tr key={farm._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{farm.name}</div>
                          <div className="text-sm text-gray-300 truncate max-w-xs">
                            {farm.description || 'No description provided'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{farm.owner?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-300">{farm.owner?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {farm.location?.coordinates ? 
                          `${farm.location.coordinates[1].toFixed(4)}, ${farm.location.coordinates[0].toFixed(4)}` 
                          : 'Not provided'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                          farm.owner?.isVerified 
                            ? 'bg-green-500/20 border-green-400/30 text-green-300' 
                            : 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300'
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
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setSelectedFarm(farm)}
                            className="text-amber-300 hover:text-amber-100 flex items-center transition-colors"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleToggleVerification(farm._id, farm.owner?.isVerified)}
                            className={`flex items-center transition-colors ${
                              farm.owner?.isVerified 
                                ? 'text-red-300 hover:text-red-100' 
                                : 'text-green-300 hover:text-green-100'
                            }`}
                          >
                            {farm.owner?.isVerified ? 'Revoke' : 'Verify'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Farm Detail Modal */}
        {selectedFarm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 w-full max-w-lg shadow-2xl rounded-2xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-6">
                  Farm Details
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Name:</label>
                    <p className="text-white font-semibold">{selectedFarm.name}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Owner:</label>
                    <p className="text-white">{selectedFarm.owner?.name || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Email:</label>
                    <p className="text-white">{selectedFarm.owner?.email || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Description:</label>
                    <p className="text-white">{selectedFarm.description || 'No description provided'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Location:</label>
                    <p className="text-white">
                      {selectedFarm.location?.coordinates 
                        ? `Lat: ${selectedFarm.location.coordinates[1].toFixed(6)}, Lng: ${selectedFarm.location.coordinates[0].toFixed(6)}`
                        : 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setSelectedFarm(null)}
                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 