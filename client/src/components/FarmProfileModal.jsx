import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import API from '../api/api';
import '../styles/FarmProfile.css';

const FarmProfileModal = ({ isOpen, onClose, onComplete, userData }) => {
  const [form, setForm] = useState({
    farmName: userData?.farmName || '',
    farmType: '',
    description: '',
    location: '',
    address: '',
    contactPhone: '',
    email: userData?.email || '',
    specialties: [],
    certifications: [],
    farmSize: '',
    unit: 'Acres',
    established: new Date().getFullYear().toString(),
    organicCertified: false,
    website: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const farmTypes = [
    'Organic',
    'Conventional',
    'Hydroponic',
    'Aquaponic',
    'Mixed',
    'Permaculture',
    'Urban'
  ];

  const units = [
    'Acres',
    'Hectares',
    'Square Feet',
    'Square Meters'
  ];

  useEffect(() => {
    if (isOpen && userData?.farmId) {
      // Fetch farm data if user already has a farm
      fetchFarmProfile();
    } else if (isOpen && userData) {
      // Prefill form with user data if available
      setForm(prev => ({
        ...prev,
        farmName: userData.farmName || '',
        description: userData.farmDescription || '',
        location: userData.location || '',
        email: userData.email || '',
      }));
    }
  }, [isOpen, userData]);

  const fetchFarmProfile = async () => {
    setLoading(true);
    try {
      const response = await API.get('/farms/profile/me');
      const farmData = response.data;
      // Parse farmSize like "10 acres" -> { farmSize: "10", unit: "acres" }
      let parsedSize = '';
      let parsedUnit = 'Acres';
      if (typeof farmData.farmSize === 'string' && farmData.farmSize.trim()) {
        const parts = farmData.farmSize.trim().split(/\s+/);
        if (parts.length >= 2) {
          parsedSize = parts[0];
          // Normalize unit capitalization for UI
          const unitRaw = parts.slice(1).join(' ');
          parsedUnit = unitRaw.charAt(0).toUpperCase() + unitRaw.slice(1);
        } else {
          parsedSize = farmData.farmSize;
        }
      }

      setForm(prev => ({
        ...prev,
        farmName: farmData.name || userData?.farmName || '',
        farmType: farmData.farmType || '',
        description: farmData.description || '',
        // Use address as a human-friendly location string fallback
        location: farmData.address || prev.location || '',
        address: farmData.address || '',
        contactPhone: farmData.contactPhone || '',
        email: farmData.email || userData?.email || '',
        specialties: farmData.specialties || [],
        certifications: farmData.certifications || [],
        farmSize: parsedSize,
        unit: parsedUnit,
        established: farmData.established || new Date().getFullYear().toString(),
        organicCertified: farmData.organicCertified || false,
        website: farmData.website || ''
      }));
    } catch (err) {
      if (err.response?.status !== 404) { // Ignore 404 as it just means no profile yet
        setError('Failed to load farm profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'specialties' || name === 'certifications') {
      setForm(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(item => item !== ''),
      }));
    } else if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Normalize payload to server schema
      const allowedTypes = ['organic','conventional','hydroponic','mixed'];
      const normalizedType = form.farmType?.toLowerCase();
      const payload = {
        farmName: form.farmName,
        farmType: allowedTypes.includes(normalizedType) ? normalizedType : 'mixed',
        description: form.description,
        address: form.address || form.location,
        location: form.address || form.location, // server resolves this alias
        contactPhone: form.contactPhone,
        email: form.email,
        website: form.website,
        farmSize: form.farmSize,
        unit: form.unit,
        specialties: form.specialties,
        certifications: form.certifications
      };
      const response = await API.put('/farms/profile/me', payload);
      setSuccess('Farm profile updated successfully!');
      
      if (onComplete) {
        onComplete(response.data.farm);
      }
      
      // Close the modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.msg || err.message || 'Failed to update farm profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="farm-profile-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="farm-profile-content"
      >
        <div className="farm-profile-header">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Complete your farm profile
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Add information about your farm to attract more customers
          </p>
          {error && <div className="mt-3 text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}
          {success && <div className="mt-3 text-green-600 bg-green-50 p-3 rounded-lg text-sm">{success}</div>}
        </div>

        <div className="farm-profile-body">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-2">Loading profile...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="farm-profile-form">
              <div className="farm-profile-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Type *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size *</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="farmSize"
                    value={form.farmSize}
                    onChange={handleChange}
                    className="block w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. 10"
                    required
                  />
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="block w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="farm-profile-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
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
              
              <div className="farm-profile-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Complete farm address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location/Region *</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={form.location}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="City, State/Region"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Farm email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Farm website (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Established</label>
                <input
                  type="number"
                  name="established"
                  value={form.established}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Year established"
                />
              </div>
              
              <div className="farm-profile-full">
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
              
              <div className="farm-profile-full">
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

              <div className="farm-profile-full">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="organicCertified"
                    id="organicCertified"
                    checked={form.organicCertified}
                    onChange={handleChange}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="organicCertified" className="text-sm font-medium text-gray-700">
                    This farm is Organic Certified
                  </label>
                </div>
              </div>
            </form>
          )}
        </div>
        
        <div className="farm-profile-actions">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FarmProfileModal;