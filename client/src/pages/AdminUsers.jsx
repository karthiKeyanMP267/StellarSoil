import { useEffect, useState } from 'react';
import API from '../api/api';
import { 
  UserGroupIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-50 pt-20">
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
        <span className="ml-2 text-amber-700">Loading users...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 px-6 py-4 rounded-2xl">
          <h3 className="font-bold text-lg">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-50 pt-20">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-full blur-xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 mb-4">
            User Management
          </h1>
          <p className="text-xl text-amber-700">Monitor and manage all platform users</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/20 text-center transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <p className="text-2xl font-bold text-white">{roleStats.total}</p>
              <p className="text-gray-300 text-sm">Total Users</p>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/20 text-center transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <p className="text-2xl font-bold text-amber-300">{roleStats.admin}</p>
              <p className="text-gray-300 text-sm">Admins</p>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/20 text-center transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <p className="text-2xl font-bold text-green-300">{roleStats.farmer}</p>
              <p className="text-gray-300 text-sm">Farmers</p>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/20 text-center transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <p className="text-2xl font-bold text-orange-300">{roleStats.user}</p>
              <p className="text-gray-300 text-sm">Customers</p>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/20 text-center transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <p className="text-2xl font-bold text-emerald-300">{roleStats.active}</p>
              <p className="text-gray-300 text-sm">Active</p>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/20 text-center transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <p className="text-2xl font-bold text-red-300">{roleStats.inactive}</p>
              <p className="text-gray-300 text-sm">Inactive</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              >
                <option value="all" className="bg-amber-800 text-white">All Roles</option>
                <option value="admin" className="bg-amber-800 text-white">Admin</option>
                <option value="farmer" className="bg-amber-800 text-white">Farmer</option>
                <option value="user" className="bg-amber-800 text-white">Customer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-gradient-to-r from-amber-800/50 to-orange-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full mr-3">
                          <UserGroupIcon className="h-6 w-6 text-amber-300" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-300">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                        user.role === 'admin' ? 'bg-amber-500/20 border-amber-400/30 text-amber-300' :
                        user.role === 'farmer' ? 'bg-green-500/20 border-green-400/30 text-green-300' :
                        'bg-orange-500/20 border-orange-400/30 text-orange-300'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                        user.isActive ? 'bg-green-500/20 border-green-400/30 text-green-300' : 'bg-red-500/20 border-red-400/30 text-red-300'
                      }`}>
                        {user.isActive ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleStatus(user._id, user.isActive)}
                          className={`inline-flex items-center px-3 py-1 rounded-xl text-sm transition-all duration-300 hover:scale-105 ${
                            user.isActive 
                              ? 'text-red-300 hover:text-red-100 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30' 
                              : 'text-green-300 hover:text-green-100 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30'
                          }`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="inline-flex items-center px-3 py-1 rounded-xl text-sm text-red-300 hover:text-red-100 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 transition-all duration-300 hover:scale-105"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
              <p className="text-gray-300">
                {searchTerm || selectedRole !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No users have been registered yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 