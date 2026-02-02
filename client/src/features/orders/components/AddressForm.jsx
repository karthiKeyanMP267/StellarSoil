import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapIcon, PencilIcon } from '@heroicons/react/24/outline';
import LiveLocationPicker from './LiveLocationPicker';

const AddressForm = ({ address, onChange, deliveryType = 'delivery', readOnly = false, farmLocation = null }) => {
  const [inputMode, setInputMode] = useState('form'); // 'form' or 'map'

  const handleAddressChange = (field, value) => {
    if (readOnly) return;
    onChange({
      ...address,
      [field]: value
    });
  };

  const handleLocationSelect = (location) => {
    if (readOnly) return;
    onChange({
      ...address,
      coordinates: {
        lat: location.lat,
        lng: location.lng
      }
    });
  };

  // For pickup mode with farm location, show read-only map
  if (deliveryType === 'pickup' && farmLocation) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-lg font-medium text-amber-800">
            Farm Pickup Location
          </label>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            📍 Farm Address (Read-only)
          </span>
        </div>

        {/* Read-only Farm Location Map */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <LiveLocationPicker
            onLocationSelect={() => {}} // No-op for read-only
            initialLocation={farmLocation}
            readOnly={true}
            className="mb-4"
          />
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Farm Name</span>
              <span className="text-sm font-medium text-gray-900">{address.farmName || 'Farm'}</span>
            </div>
            {address.street && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Address</span>
                <span className="text-sm font-medium text-gray-900">{address.street}</span>
              </div>
            )}
            {address.city && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">City</span>
                <span className="text-sm font-medium text-gray-900">{address.city}, {address.state}</span>
              </div>
            )}
            {address.phoneNumber && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Contact</span>
                <span className="text-sm font-medium text-gray-900">{address.phoneNumber}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Note:</span> This is the farm's pickup location. Please arrive during your selected time slot to collect your order.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-lg font-medium text-amber-800">
          {deliveryType === 'delivery' ? 'Delivery Address' : 'Pickup Address'}
        </label>
        
        {/* Toggle between Map and Manual Form */}
        {deliveryType === 'delivery' && !readOnly && (
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setInputMode('form')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                inputMode === 'form'
                  ? 'bg-white shadow-md text-amber-600 font-medium'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              <PencilIcon className="h-4 w-4" />
              <span className="text-sm">Manual Entry</span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode('map')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                inputMode === 'map'
                  ? 'bg-white shadow-md text-amber-600 font-medium'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              <MapIcon className="h-4 w-4" />
              <span className="text-sm">Use Map</span>
            </button>
          </div>
        )}
      </div>

      {/* Show either Map Picker or Form based on toggle */}
      <AnimatePresence mode="wait">
        {inputMode === 'map' && deliveryType === 'delivery' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LiveLocationPicker
              onLocationSelect={handleLocationSelect}
              initialLocation={address.coordinates}
              className="mb-4"
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Street, Building, Apartment #"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="City"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="State"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Postal/Zip Code"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={address.phoneNumber}
                  onChange={(e) => handleAddressChange('phoneNumber', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Contact number for delivery"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={address.landmark}
                  onChange={(e) => handleAddressChange('landmark', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nearby landmark to help delivery"
                />
              </div>
            </div>
            
            {deliveryType === 'delivery' && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mt-4">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Note:</span> Please provide accurate address details to ensure smooth delivery. 
                  Your contact number will only be used for delivery coordination.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressForm;