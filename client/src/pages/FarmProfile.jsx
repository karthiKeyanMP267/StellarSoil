import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function FarmProfile({ onComplete }) {
  const { user, setUser, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated or not a farmer
  useEffect(() => {
    console.log('Auth state:', { user, token }); // Debug auth state
    if (!token || !user) {
      console.log('No authentication, redirecting to login');
      navigate('/');
      return;
    }
    if (user.role !== 'farmer') {
      console.log('User is not a farmer, redirecting');
      navigate('/');
      return;
    }
  }, [token, user, navigate]);

  const [form, setForm] = useState({
    farmName: user?.farmName || '',
    farmType: '',
    description: '',
    location: '',
    address: '',
    contactPhone: '',
    specialties: [],
    certifications: [],
    images: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const farmTypes = ['Organic', 'Conventional', 'Hydroponic', 'Aquaponic', 'Mixed'];

  useEffect(() => {
    const fetchFarmProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching farm profile with token:', token); // Debug token
        const response = await API.get('/farms/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Farm profile response:', response.data); // Debug response
        const farmData = response.data;
        setForm(prev => ({
          ...prev,
          farmName: farmData.name || user?.farmName || '',
          farmType: farmData.type || '',
          description: farmData.description || '',
          location: farmData.location || '',
          address: farmData.address || '',
          contactPhone: farmData.contactPhone || '',
          specialties: farmData.specialties || [],
          certifications: farmData.certifications || [],
          images: farmData.images || []
        }));
      } catch (err) {
        console.error('Profile fetch error:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/');
        } else if (err.response?.status !== 404) { // Ignore 404 as it just means no profile yet
          setError(err.response?.data?.msg || 'Failed to load farm profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFarmProfile();
  }, [user, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'specialties' || name === 'certifications') {
      setForm((prev) => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(item => item !== ''),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await API.put('/farms/profile/me', form);
      
      // Update user context with new farm name if needed
      if (user?.farmName !== form.farmName) {
        setUser(prev => ({ ...prev, farmName: form.farmName }));
      }
      
      setSuccess('Farm profile updated successfully!');
      
      if (onComplete) {
        onComplete(response.data.farm);
      }
      
      // Navigate to farm dashboard after short delay
      setTimeout(() => {
        navigate('/farm-dashboard');
      }, 1500);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.msg || 'Failed to update farm profile');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Complete Your Farm Profile</h2>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-2">Loading profile...</span>
        </div>
      ) : (
        <>
          {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
          {success && <div className="mb-4 text-green-600 bg-green-50 p-3 rounded-lg">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
              <input
                type="text"
                name="farmName"
                required
                value={form.farmName}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Your farm's name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Farm Type</label>
              <select
                name="farmType"
                required
                value={form.farmType}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select farm type</option>
                {farmTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                required
                value={form.description}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows="4"
                placeholder="Tell us about your farm and farming practices"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                required
                value={form.location}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Farm location (e.g., coordinates)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Detailed farm address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                required
                value={form.contactPhone}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Contact phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma-separated)</label>
              <input
                type="text"
                name="specialties"
                value={form.specialties.join(', ')}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Organic Vegetables, Herbs, Fruits"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certifications (comma-separated)</label>
              <input
                type="text"
                name="certifications"
                value={form.certifications.join(', ')}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Organic Certified, GAP Certified"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              Save Profile
            </button>
          </form>
        </>
      )}
    </div>
  );
}
