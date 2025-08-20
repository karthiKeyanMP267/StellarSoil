import { useEffect, useState } from 'react';
import API from '../api/api';

export default function AdminFarms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarms = async () => {
      try {
  const res = await API.get('/admin/farms');
  setFarms(res.data);
      } catch (err) {
        setError('Failed to load farms');
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  if (loading) return <div className="p-8">Loading farms...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Farms</h1>
      <table className="min-w-full bg-white rounded-xl shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {farms.map(farm => (
            <tr key={farm._id} className="border-t">
              <td className="px-4 py-2">{farm.name}</td>
              <td className="px-4 py-2">{farm.location || 'N/A'}</td>
              <td className="px-4 py-2">{farm.description || 'No description'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 