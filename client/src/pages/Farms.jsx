import { useEffect, useState } from 'react';
import API from '../api/api';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await API.get('/api/farms');
        setFarms(res.data);
      } catch (err) {
        setError('Failed to load farms');
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading farms...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-emerald-50 p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Browse Farms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map(farm => (
          <div key={farm._id} className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <h2 className="text-xl font-semibold text-green-800 mb-2">{farm.name}</h2>
            <p className="text-gray-600 mb-1">Location: {farm.location || 'N/A'}</p>
            <p className="text-gray-700 mb-2">{farm.description || 'No description provided.'}</p>
            {/* Add more farm details or actions here if needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Farms;
