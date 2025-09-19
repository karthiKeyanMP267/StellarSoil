import React from 'react';
import { MapPinIcon, PhoneIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

const AddressDisplay = ({ address, deliveryType = 'delivery', className = '' }) => {
  // Handle the case where address might be a string (legacy) or an object (new format)
  const isLegacyFormat = typeof address === 'string';
  
  if (!address) return null;
  
  return (
    <div className={`bg-white rounded-xl border border-amber-200 p-4 ${className}`}>
      <h4 className="font-medium text-amber-800 mb-2 flex items-center">
        {deliveryType === 'delivery' ? (
          <MapPinIcon className="h-5 w-5 mr-2 text-orange-500" />
        ) : (
          <BuildingStorefrontIcon className="h-5 w-5 mr-2 text-orange-500" />
        )}
        {deliveryType === 'delivery' ? 'Delivery Address' : 'Pickup Location'}
      </h4>
      
      {isLegacyFormat ? (
        <p className="text-gray-700 whitespace-pre-line">{address}</p>
      ) : (
        <div className="space-y-1">
          <p className="text-gray-700">
            {address.street}
          </p>
          <p className="text-gray-700">
            {address.city}, {address.state} {address.zipCode}
          </p>
          {address.landmark && (
            <p className="text-gray-500 text-sm">
              Landmark: {address.landmark}
            </p>
          )}
          {address.phoneNumber && (
            <p className="text-gray-700 flex items-center mt-2">
              <PhoneIcon className="h-4 w-4 mr-1 text-amber-500" />
              {address.phoneNumber}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressDisplay;