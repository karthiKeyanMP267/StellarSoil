import { useState, useEffect } from 'react';
import API, { adminApi } from '../api/api';


export default function AdminPanel() {
  const [pendingFarmers, setPendingFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingFarmers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPendingFarmers();
      setPendingFarmers(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to fetch pending farmers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingFarmers();
  }, []);

  const handleApprove = async (farmerId) => {
    try {
      setActionLoading(true);
      await adminApi.approveFarmer(farmerId);
      fetchPendingFarmers();
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
      fetchPendingFarmers();
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to reject farmer');
    } finally {
      setActionLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Pending Farmer Verifications</h2>
          
          {pendingFarmers.length === 0 ? (
            <p className="text-gray-600">No pending verifications</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingFarmers.map((farmer) => (
                    <tr key={farmer._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {farmer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {farmer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(farmer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleApprove(farmer._id)}
                          className="text-green-600 hover:text-green-900 bg-green-100 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                          disabled={actionLoading}
                        >
                          {actionLoading ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(farmer._id)}
                          className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                          disabled={actionLoading}
                        >
                          {actionLoading ? 'Processing...' : 'Reject'}
                        </button>
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
  );
}
