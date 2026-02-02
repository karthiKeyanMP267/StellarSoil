import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TruckIcon, ClockIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import AddressForm from './AddressForm';
import API from '../api/api';

const DeliveryForm = ({ deliveryDetails, onChange, showTitle = true, farmId = null }) => {
  const [farmInfo, setFarmInfo] = useState(null);
  const [loadingFarm, setLoadingFarm] = useState(false);

  // Fetch farm information when farmId is provided
  useEffect(() => {
    const fetchFarmInfo = async () => {
      if (!farmId) return;
      
      try {
        setLoadingFarm(true);
        const response = await API.get(`/farms/${farmId}`);
        const farm = response.data;
        
        setFarmInfo({
          name: farm.name,
          address: farm.address,
          phone: farm.contactPhone,
          location: farm.location
        });
        
        // If user switches to pickup, auto-fill farm address
        if (deliveryDetails.type === 'pickup') {
          const farmAddress = {
            farmName: farm.name,
            street: farm.address,
            city: farm.city || '',
            state: farm.state || '',
            zipCode: farm.zipCode || '',
            phoneNumber: farm.contactPhone,
            coordinates: farm.location?.coordinates ? {
              lat: farm.location.coordinates[1],
              lng: farm.location.coordinates[0]
            } : null
          };
          onChange({
            ...deliveryDetails,
            address: farmAddress
          });
        }
      } catch (error) {
        console.error('Error fetching farm info:', error);
      } finally {
        setLoadingFarm(false);
      }
    };

    fetchFarmInfo();
  }, [farmId]);

  // When delivery type changes to pickup, auto-fill farm address
  useEffect(() => {
    if (deliveryDetails.type === 'pickup' && farmInfo && !deliveryDetails.address?.farmName) {
      const farmAddress = {
        farmName: farmInfo.name,
        street: farmInfo.address,
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: farmInfo.phone,
        coordinates: farmInfo.location?.coordinates ? {
          lat: farmInfo.location.coordinates[1],
          lng: farmInfo.location.coordinates[0]
        } : null
      };
      onChange({
        ...deliveryDetails,
        address: farmAddress
      });
    }
  }, [deliveryDetails.type, farmInfo]);
  // Generate time slots from 8 AM to 8 PM in 1-hour intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 8; i <= 20; i++) {
      const hour = i > 12 ? i - 12 : i;
      const ampm = i >= 12 ? 'PM' : 'AM';
      slots.push(`${hour}:00 ${ampm} - ${hour}:59 ${ampm}`);
    }
    return slots;
  };

  const handleDeliveryTypeChange = (type) => {
    onChange({
      ...deliveryDetails,
      type
    });
  };

  const handleAddressChange = (address) => {
    onChange({
      ...deliveryDetails,
      address
    });
  };

  const handleSlotDateChange = (date) => {
    // If there's no date selected yet, initialize with empty values
    const slotParts = deliveryDetails.slot ? deliveryDetails.slot.split('T') : ['', ''];
    const slotTime = slotParts.length > 1 ? slotParts[1] : '';
    
    // Create combined date-time string in ISO format
    const newSlot = slotTime ? `${date}T${slotTime}` : date;
    
    onChange({
      ...deliveryDetails,
      slot: newSlot
    });
  };

  const handleSlotTimeChange = (time) => {
    // Get current date or use today if none
    const slotDate = deliveryDetails.slot ? 
      deliveryDetails.slot.split('T')[0] : 
      new Date().toISOString().split('T')[0];
    
    // Create combined date-time string in ISO format
    const newSlot = `${slotDate}T${time}`;
    
    onChange({
      ...deliveryDetails,
      slot: newSlot
    });
  };

  // Parse slot into date and time parts
  const slotParts = deliveryDetails.slot?.split('T') || ['', ''];
  const slotDate = slotParts[0];
  const slotTime = slotParts[1];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-amber-100 shadow-lg"
    >
      {showTitle && (
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl shadow-md">
            <TruckIcon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-amber-800">Delivery Details</h3>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-amber-800 mb-2">
          Delivery Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer
              ${deliveryDetails.type === 'delivery' 
                ? 'bg-amber-50 border-amber-500 shadow' 
                : 'border-gray-200 hover:border-amber-300'}
            `}
            onClick={() => handleDeliveryTypeChange('delivery')}
          >
            <div className={`p-3 rounded-full ${
              deliveryDetails.type === 'delivery'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}>
              <TruckIcon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <h4 className={`font-medium ${deliveryDetails.type === 'delivery' ? 'text-amber-800' : 'text-gray-700'}`}>
                Home Delivery
              </h4>
              <p className={`text-sm ${deliveryDetails.type === 'delivery' ? 'text-amber-700' : 'text-gray-500'}`}>
                Delivered to your doorstep
              </p>
            </div>
          </div>
          
          <div
            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer
              ${deliveryDetails.type === 'pickup' 
                ? 'bg-amber-50 border-amber-500 shadow' 
                : 'border-gray-200 hover:border-amber-300'}
            `}
            onClick={() => handleDeliveryTypeChange('pickup')}
          >
            <div className={`p-3 rounded-full ${
              deliveryDetails.type === 'pickup'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}>
              <BuildingStorefrontIcon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <h4 className={`font-medium ${deliveryDetails.type === 'pickup' ? 'text-amber-800' : 'text-gray-700'}`}>
                Farm Pickup
              </h4>
              <p className={`text-sm ${deliveryDetails.type === 'pickup' ? 'text-amber-700' : 'text-gray-500'}`}>
                Pick up from farm location
              </p>
            </div>
          </div>
        </div>
      </div>

      {loadingFarm && deliveryDetails.type === 'pickup' ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <span className="ml-3 text-gray-600">Loading farm location...</span>
        </div>
      ) : (
        <AddressForm 
          address={deliveryDetails.address} 
          onChange={handleAddressChange} 
          deliveryType={deliveryDetails.type}
          readOnly={deliveryDetails.type === 'pickup'}
          farmLocation={deliveryDetails.type === 'pickup' && farmInfo?.location?.coordinates ? {
            lat: farmInfo.location.coordinates[1],
            lng: farmInfo.location.coordinates[0]
          } : null}
        />
      )}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-amber-800 mb-2 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-amber-600" />
          {deliveryDetails.type === 'delivery' ? 'Preferred Delivery Time' : 'Preferred Pickup Time'}
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-amber-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={slotDate}
              onChange={(e) => handleSlotDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs text-amber-700 mb-1">
              Time Slot <span className="text-red-500">*</span>
            </label>
            <select
              value={slotTime || ''}
              onChange={(e) => handleSlotTimeChange(e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
              required
            >
              <option value="">Select a time slot</option>
              {generateTimeSlots().map((slot, index) => (
                <option key={index} value={`${index + 8}:00:00`}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {slotDate && slotTime && (
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <ClockIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-700">
                  {deliveryDetails.type === 'delivery' ? 'Delivery' : 'Pickup'} scheduled for:
                </p>
                <p className="text-green-800 font-bold">
                  {new Date(slotDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-green-800">
                  Time: {generateTimeSlots()[parseInt(slotTime.split(':')[0]) - 8]}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-xs text-amber-600 mt-1">
          {deliveryDetails.type === 'delivery' 
            ? "We'll try our best to deliver within your selected time slot."
            : "Please arrive during your selected time slot to collect your order."}
        </p>
      </div>
    </motion.div>
  );
};

export default DeliveryForm;