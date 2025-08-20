import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function FarmProfile({ onComplete }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    farmName: user?.farmName || '',
    farmType: '',
    description: '',
    location: '',
    specialties: [],
    certifications: [],
    images: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const farmTypes = ['Organic', 'Conventional', 'Hydroponic', 'Aquaponic', 'Mixed'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'specialties' || name === 'certifications') {
      setForm((prev) => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/farms/profile/me`,
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess('Farm profile updated successfully!');
      if (onComplete) onComplete();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update farm profile');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Complete Your Farm Profile</h2>
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
            placeholder="Farm location"
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
          className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
