import React from 'react';
import { motion } from 'framer-motion';

const AddressForm = ({ address, onChange, deliveryType = 'delivery' }) => {
  const handleAddressChange = (field, value) => {
    onChange({
      ...address,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-medium text-amber-800 mb-2">
        {deliveryType === 'delivery' ? 'Delivery Address' : 'Pickup Address'}
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => handleAddressChange('street', e.target.value)}
            className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
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
            className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
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
            className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
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
            className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
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
            className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
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
            className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
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
    </div>
  );
};

export default AddressForm;