import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/ui/Notification';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import API from '../api/api';

const MandatoryFarmProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  
  const [form, setForm] = useState({
    farmName: user?.farmName || '',
    farmType: '',
    description: '',
    address: '',
    contactPhone: '',
    email: user?.email || '',
    specialties: [],
    certifications: [],
    farmSize: '',
    unit: 'Acres',
    established: new Date().getFullYear().toString(),
    organicCertified: false,
    website: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
  
  // Get location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          success('Location Found', 'Your farm location has been detected');
        },
        (geoErr) => {
          console.error('Error getting location:', geoErr);
        }
      );
    }
  }, []);

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
    
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!form.farmName || !form.farmType || !form.description || !form.address || !form.contactPhone) {
        throw new Error('Please fill all required fields');
      }
      
      // Normalize payload to server schema
      const allowedTypes = ['organic','conventional','hydroponic','mixed'];
      const normalizedType = form.farmType?.toLowerCase();
      const payload = {
        farmName: form.farmName,
        farmType: allowedTypes.includes(normalizedType) ? normalizedType : 'mixed',
        description: form.description,
        address: form.address,
        contactPhone: form.contactPhone,
        email: form.email,
        website: form.website,
        farmSize: form.farmSize,
        unit: form.unit,
        specialties: form.specialties,
        certifications: form.certifications,
        latitude: form.latitude,
        longitude: form.longitude
      };
      
      const response = await API.put('/farms/profile/me', payload);
      setSuccessMsg('Farm profile created successfully!');
      success('Farm Profile Created', 'Your farm profile has been created successfully');
      
      // Update user context
      setUser(prev => ({
        ...prev,
        farmName: form.farmName,
        farmDescription: form.description,
        location: form.address,
        phone: form.contactPhone,
        farmId: response.data?.farm?._id || response.data?._id
      }));
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        farmName: form.farmName,
        farmDescription: form.description,
        location: form.address,
        phone: form.contactPhone,
        farmId: response.data?.farm?._id || response.data?._id
      }));
      
      // Redirect after successful submission
      setTimeout(() => {
        navigate('/farmer');
      }, 1500);
    } catch (err) {
      console.error('Profile creation error:', err);
      setErrorMsg(err?.response?.data?.msg || err?.message || 'Failed to create farm profile');
      error('Profile Creation Failed', err?.response?.data?.msg || err?.message || 'Failed to create farm profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'farmer') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <div className="p-6 bg-gradient-to-r from-beige-50 to-cream-50 border-b border-beige-100 rounded-t-xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600">
              Complete Your Farm Profile
            </h2>
          </div>
          <p className="text-sm text-beige-600 mt-1">
            Please complete your farm profile to continue. This information helps customers find your farm and products.
          </p>
          {errorMsg && <div className="mt-3 text-red-600 bg-red-50 p-3 rounded-lg text-sm">{errorMsg}</div>}
          {successMsg && <div className="mt-3 text-green-600 bg-green-50 p-3 rounded-lg text-sm">{successMsg}</div>}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-beige-600 mb-1">Farm Name *</label>
                <input
                  type="text"
                  name="farmName"
                  required
                  value={form.farmName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Your farm's name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-beige-600 mb-1">Farm Type *</label>
                <select
                  name="farmType"
                  required
                  value={form.farmType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select farm type</option>
                  {farmTypes.map((type) => (
                    <option key={type} value={type.toLowerCase()}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-beige-600 mb-1">Farm Description *</label>
              <textarea
                name="description"
                required
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows="4"
                placeholder="Tell us about your farm and farming practices"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-beige-600 mb-1">Farm Address *</label>
              <input
                type="text"
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Complete farm address"
              />
            </div>
              
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-beige-600 mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  name="contactPhone"
                  required
                  value={form.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-beige-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="farm@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-beige-600 mb-1">Farm Size</label>
                <input
                  type="text"
                  name="farmSize"
                  value={form.farmSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. 10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-beige-600 mb-1">Unit</label>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-beige-600 mb-1">Year Established</label>
                <input
                  type="number"
                  name="established"
                  value={form.established}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Year established"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-beige-600 mb-1">Specialties (comma-separated)</label>
                <input
                  type="text"
                  name="specialties"
                  value={Array.isArray(form.specialties) ? form.specialties.join(', ') : ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Organic Vegetables, Herbs, Fruits"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-beige-600 mb-1">Website (Optional)</label>
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="https://yourfarm.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="organicCertified"
                  id="organicCertified"
                  checked={form.organicCertified}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 border-beige-300 rounded focus:ring-green-500"
                />
                <label htmlFor="organicCertified" className="text-sm font-medium text-beige-600">
                  This farm is Organic Certified
                </label>
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-beige-100 bg-gradient-to-r from-beige-50 to-cream-50 rounded-b-xl sticky bottom-0 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Profile...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Complete Profile & Continue
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MandatoryFarmProfile;