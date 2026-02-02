import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/api';
import { 
  UserGroupIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/Button';
import { Card, StatCard } from '../components/Card';
import { Input } from '../components/Form';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/admin/users');
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, users]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const response = await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      alert(response.data.msg || 'User deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      const errorMessage = err.response?.data?.msg || err.message || 'Failed to delete user';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await API.patch(`/admin/users/${id}/toggle-status`);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u));
    } catch (err) {
      alert(err.response?.data?.msg || err.message || 'Failed to update user status');
    }
  };

  const roleStats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    farmer: users.filter(u => u.role === 'farmer').length,
    user: users.filter(u => u.role === 'user').length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length
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
          <h3 className="text-lg font-semibold text-beige-800">Loading Users...</h3>
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
                <UserGroupIcon className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                <p className="text-beige-100 text-lg">Monitor and manage all platform users</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
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
                <UserGroupIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-sm font-medium text-beige-700">Total Users</p>
                <motion.p 
                  className="text-2xl font-bold text-beige-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {roleStats.total}
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
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1 text-green-600" />
              </motion.div>
              +12% this month
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-earth-50 to-earth-100 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-earth-200/50 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center">
              <motion.div 
                className="bg-gradient-to-r from-earth-500 to-earth-600 p-3 rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-sm font-medium text-earth-700">Admins</p>
                <motion.p 
                  className="text-2xl font-bold text-earth-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {roleStats.admin}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="mt-2 flex items-center text-xs text-earth-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircleIcon className="h-3 w-3 mr-1 text-green-600" />
              </motion.div>
              Verified access
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-sage-50 to-sage-100 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-sage-200/50 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center">
              <motion.div 
                className="bg-gradient-to-r from-sage-500 to-sage-600 p-3 rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <UserIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-sm font-medium text-sage-700">Farmers</p>
                <motion.p 
                  className="text-2xl font-bold text-sage-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {roleStats.farmer}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="mt-2 flex items-center text-xs text-sage-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🌱
              </motion.div>
              <span className="ml-1">Growing community</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-cream-50 to-cream-100 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-cream-200/50 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center">
              <motion.div 
                className="bg-gradient-to-r from-cream-500 to-cream-600 p-3 rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <UserIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-sm font-medium text-cream-700">Customers</p>
                <motion.p 
                  className="text-2xl font-bold text-cream-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {roleStats.user}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="mt-2 flex items-center text-xs text-cream-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🛒
              </motion.div>
              <span className="ml-1">Active shoppers</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-green-50 to-green-100 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center">
              <motion.div 
                className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-700">Active</p>
                <motion.p 
                  className="text-2xl font-bold text-green-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {roleStats.active}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="mt-2 flex items-center text-xs text-green-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✅
              </motion.div>
              <span className="ml-1">Online users</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-red-50 to-red-100 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-red-200/50 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center">
              <motion.div 
                className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <XCircleIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-sm font-medium text-red-700">Inactive</p>
                <motion.p 
                  className="text-2xl font-bold text-red-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {roleStats.inactive}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="mt-2 flex items-center text-xs text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⏸️
              </motion.div>
              <span className="ml-1">Need attention</span>
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
                <MagnifyingGlassIcon className="h-5 w-5 text-beige-400" />
              </motion.div>
              <motion.input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-beige-50 to-cream-50 border border-beige-300 rounded-xl text-beige-800 placeholder-beige-500 focus:ring-2 focus:ring-beige-400 focus:border-beige-400 transition-all duration-300 shadow-sm hover:shadow-md"
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
                    className="text-beige-400 hover:text-beige-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XCircleIcon className="h-5 w-5" />
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
                  animate={{ rotate: selectedRole !== 'all' ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-beige-400" />
                </motion.div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-beige-50 to-cream-50 border border-beige-300 rounded-xl text-beige-800 focus:ring-2 focus:ring-beige-400 focus:border-beige-400 transition-all duration-300 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">👨‍💼 Admin</option>
                  <option value="farmer">🌱 Farmer</option>
                  <option value="user">🛒 Customer</option>
                </select>
                <motion.div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  animate={{ rotate: selectedRole !== 'all' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChartBarIcon className="h-4 w-4 text-beige-400" />
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {(searchTerm || selectedRole !== 'all') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-center gap-2 text-sm text-beige-600"
            >
              <span>Active filters:</span>
              {searchTerm && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 bg-beige-100 text-beige-700 rounded-lg"
                >
                  Search: "{searchTerm}"
                </motion.span>
              )}
              {selectedRole !== 'all' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 bg-beige-100 text-beige-700 rounded-lg"
                >
                  Role: {selectedRole}
                </motion.span>
              )}
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('all');
                }}
                className="px-2 py-1 text-xs text-red-600 hover:text-red-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear all
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Users Table */}
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
                    User Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.tr 
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-beige-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-beige-400 to-cream-400 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-semibold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-beige-900">{user.name}</div>
                            <div className="text-sm text-beige-600">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-earth-100 text-earth-800' :
                          user.role === 'farmer' ? 'bg-sage-100 text-sage-800' :
                          'bg-beige-100 text-beige-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-beige-600">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant={user.isActive ? "danger" : "success"}
                            size="small"
                            onClick={() => handleToggleStatus(user._id, user.isActive)}
                            animation="default"
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          {user.role !== 'admin' && (
                            <Button
                              variant="danger"
                              size="small"
                              icon={TrashIcon}
                              onClick={() => handleDelete(user._id)}
                              animation="default"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
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
                <UserGroupIcon className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-beige-800 mb-2">No users found</h3>
              <p className="text-beige-600">
                {searchTerm || selectedRole !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No users have been registered yet.'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}; 