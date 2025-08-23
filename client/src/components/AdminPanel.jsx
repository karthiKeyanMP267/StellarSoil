import { useState, useEffect } from 'react';
import API, { adminApi } from '../api/api';
import { 
  UserGroupIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg">
              <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-amber-700 mt-1">Monitor and manage platform activities</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/20 p-6">
            <nav className="flex space-x-6">
              <a 
                href="/admin" 
                className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
                Dashboard
              </a>
              <a 
                href="/admin/users" 
                className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Manage Users
              </a>
              <a 
                href="/admin/farms" 
                className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-lg hover:from-amber-700 hover:to-orange-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
                Manage Farms
              </a>
            </nav>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-center shadow-sm">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-12 w-12 bg-white/10 rounded-full"></div>
            <div className="relative">
              <UserGroupIcon className="h-8 w-8 text-white mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              <p className="text-white font-medium">Total Users</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-12 w-12 bg-white/10 rounded-full"></div>
            <div className="relative">
              <BuildingStorefrontIcon className="h-8 w-8 text-green-100 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-bold text-white">{stats.totalFarms}</p>
              <p className="text-green-100 font-medium">Total Farms</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-12 w-12 bg-white/10 rounded-full"></div>
            <div className="relative">
              <CheckCircleIcon className="h-8 w-8 text-white mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-bold text-white">{stats.verifiedFarms}</p>
              <p className="text-white font-medium">Verified Farms</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-12 w-12 bg-white/10 rounded-full"></div>
            <div className="relative">
              <ClockIcon className="h-8 w-8 text-amber-100 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-bold text-white">{stats.pendingVerifications}</p>
              <p className="text-amber-100 font-medium">Pending Verifications</p>
            </div>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/20 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
            <h2 className="text-xl font-bold text-amber-800 flex items-center">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg mr-3">
                <ClockIcon className="h-5 w-5 text-white" />
              </div>
              Pending Farmer Verifications
            </h2>
          </div>
          
          <div className="p-6">
            {pendingFarmers.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircleIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-amber-800 mb-2">All caught up!</h3>
                <p className="text-amber-700">No pending farmer verifications at the moment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-amber-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-amber-800">
                        Farmer Details
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-amber-800">
                        Applied Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-amber-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {pendingFarmers.map((farmer) => (
                      <tr key={farmer._id} className="hover:bg-amber-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-amber-900">{farmer.name}</div>
                            <div className="text-sm text-amber-600">{farmer.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-amber-700">
                          {new Date(farmer.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleApprove(farmer._id)}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
                              disabled={actionLoading}
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-2" />
                              {actionLoading ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleReject(farmer._id)}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
                              disabled={actionLoading}
                            >
                              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                              {actionLoading ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
