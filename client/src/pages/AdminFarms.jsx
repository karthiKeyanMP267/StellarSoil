import { useEffect, useState } from 'react';
import API from '../api/api';
import FarmsMap from '../components/FarmsMap';

export default function AdminFarms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        console.log('Debug - Auth state:', { 
          hasToken: !!token, 
          userRole: user?.role,
          user: user
        });

        if (!token) {
          setError('Not authenticated. Please login again.');
          return;
        }

        if (user?.role !== 'admin') {
          setError('Not authorized. Admin access required.');
          return;
        }

        console.log('Making API request to /admin/farms');
        const res = await API.get('/admin/farms');
        console.log('Farms API response:', res.data);
        setFarms(res.data);
      } catch (err) {
        console.error('Error fetching farms:', {
          error: err,
          response: err.response,
          message: err.message
        });
        setError(err.response?.data?.msg || err.message || 'Failed to load farms');
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      <span className="ml-2">Loading farms...</span>
    </div>
  );
  
  if (error) return (
    <div className="p-8">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Farms</h1>
      {farms.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded-lg text-gray-600">
          No farms found in the system.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Owner</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {farms.map(farm => (
                <tr key={farm._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{farm.name}</td>
                  <td className="px-4 py-3 text-sm">{farm.owner?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    {farm.location?.coordinates ? 
                      `${farm.location.coordinates[1].toFixed(6)}, ${farm.location.coordinates[0].toFixed(6)}` 
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm">{farm.description || 'No description'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${farm.owner?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {farm.owner?.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-8">
        <FarmsMap 
          farms={farms.filter(farm => farm.location && Array.isArray(farm.location.coordinates))} 
          userLocation={null}
        />
      </div>
    </div>
  );
} 