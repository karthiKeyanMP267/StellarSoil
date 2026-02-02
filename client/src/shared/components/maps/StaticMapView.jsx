import React, { useState } from 'react';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import AddressForm from './AddressForm';
import AddressDisplay from './AddressDisplay';

// This component provides a static map alternative since Google Maps API 
// doesn't provide free live geolocation
const StaticMapView = ({ address, onAddressUpdate, title = 'Delivery Location' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState(address || {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    landmark: '',
    coordinates: null
  });

  // Handle legacy address format (string) or new format (object)
  const isLegacyFormat = typeof address === 'string';
  
  // Parse legacy format into structured format if needed
  const getStructuredAddress = () => {
    if (!address) return null;
    
    // If it's already structured, use it
    if (!isLegacyFormat) return address;
    
    // Basic attempt to parse a string address
    // This is a simple implementation - in production you'd want more sophisticated parsing
    const parts = address.split(',').map(part => part.trim());
    return {
      street: parts[0] || '',
      city: parts.length > 1 ? parts[1] : '',
      state: parts.length > 2 ? parts[2].split(' ')[0] : '',
      zipCode: parts.length > 2 ? parts[2].split(' ').slice(1).join(' ') : '',
      phoneNumber: '',
      landmark: ''
    };
  };

  // Get a static map URL from OpenStreetMap (free alternative)
  const getStaticMapUrl = () => {
    if (!address) return null;
    
    // Handle structured address
    const structAddress = isLegacyFormat ? getStructuredAddress() : address;
    
    // If we have coordinates, use them
    if (structAddress.coordinates?.lat && structAddress.coordinates?.lng) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${structAddress.coordinates.lng-0.01}%2C${structAddress.coordinates.lat-0.01}%2C${structAddress.coordinates.lng+0.01}%2C${structAddress.coordinates.lat+0.01}&layer=mapnik&marker=${structAddress.coordinates.lat}%2C${structAddress.coordinates.lng}`;
    }
    
    // Otherwise, try to use the address components
    // Note: This is a fallback that might not be accurate without geocoding
    let addressComponents = [];
    
    if (isLegacyFormat) {
      addressComponents = [address];
    } else {
      addressComponents = [
        structAddress.street,
        structAddress.city,
        structAddress.state,
        structAddress.zipCode
      ].filter(Boolean);
    }
    
    const addressString = encodeURIComponent(addressComponents.join(', '));
    return `https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&marker=&query=${addressString}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    if (onAddressUpdate) {
      onAddressUpdate(editedAddress);
    }
  };

  // Get the structured address for display
  const structuredAddress = getStructuredAddress();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-amber-200">
      {!isEditing ? (
        <>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-amber-800">{title}</h3>
              {onAddressUpdate && (
                <button 
                  className="text-sm text-amber-600 hover:text-amber-800 px-2 py-1 rounded hover:bg-amber-50"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>
            
            {/* Use AddressDisplay component */}
            <AddressDisplay address={structuredAddress} />
          </div>
          
          {address && (
            <div className="border-t border-amber-100">
              <div className="relative h-48 w-full">
                <iframe 
                  src={getStaticMapUrl()}
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0"
                  title="Map"
                  className="absolute inset-0"
                />
                <div className="absolute bottom-2 right-2">
                  <a 
                    href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(
                      isLegacyFormat 
                        ? address 
                        : [structuredAddress.street, structuredAddress.city, structuredAddress.state, structuredAddress.zipCode].filter(Boolean).join(', ')
                    )}`} 
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white bg-opacity-90 text-xs px-2 py-1 rounded text-amber-700 hover:text-amber-900"
                  >
                    Open larger map
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-4">
          <h3 className="text-lg font-medium text-amber-800 mb-3">Edit {title}</h3>
          <form onSubmit={handleSubmit}>
            <AddressForm 
              address={editedAddress}
              onChange={setEditedAddress}
            />
            
            <div className="flex justify-end space-x-2 pt-4 mt-2">
              <button
                type="button"
                onClick={() => {
                  setEditedAddress(address || {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    phoneNumber: '',
                    landmark: '',
                    coordinates: null
                  });
                  setIsEditing(false);
                }}
                className="px-4 py-2 border border-amber-300 text-amber-700 rounded-md hover:bg-amber-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-md hover:from-amber-600 hover:to-orange-700"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StaticMapView;