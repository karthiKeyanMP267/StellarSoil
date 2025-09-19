import React, { useState } from 'react';
import { ClockIcon, MapPinIcon, TruckIcon } from '@heroicons/react/24/outline';
import API from './api/api';
import { useNotification } from './ui/Notification';
import StaticMapView from './StaticMapView';

const DeliveryUpdates = ({ order, onOrderUpdate }) => {
  const { success, error } = useNotification();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleAddressUpdate = async (updatedAddress) => {
    try {
      setIsUpdating(true);
      
      // In a real app, you would send the updated address to the server
      await API.put(`/api/orders/${order._id}/update-address`, { 
        deliveryAddress: updatedAddress 
      });
      
      if (onOrderUpdate) {
        onOrderUpdate({
          ...order,
          deliveryAddress: updatedAddress
        });
      }
      
      success('Updated', 'Delivery address has been updated');
    } catch (err) {
      error('Error', 'Failed to update delivery address');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getEstimatedDeliveryTime = () => {
    // In a real application with live tracking, this would be calculated
    // based on the driver's location and ETA
    // For now, we'll just show the scheduled delivery time if available
    if (order.deliverySlot) {
      return {
        date: new Date(order.deliverySlot.date).toLocaleDateString(),
        time: order.deliverySlot.timeSlot
      };
    }
    
    // Fallback to a generic message
    return { 
      date: 'As scheduled',
      time: 'Within the selected time slot'
    };
  };
  
  const deliveryEstimate = getEstimatedDeliveryTime();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-beige-200 overflow-hidden">
      <div className="p-4 bg-beige-50 border-b border-beige-100">
        <div className="flex items-center">
          <TruckIcon className="h-5 w-5 text-beige-600 mr-2" />
          <h3 className="font-medium text-beige-700">Delivery Information</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col gap-4">
          {/* Estimated Delivery Time */}
          <div>
            <div className="flex items-center mb-2">
              <ClockIcon className="h-4 w-4 text-beige-500 mr-2" />
              <span className="text-sm font-medium text-beige-700">Estimated Delivery</span>
            </div>
            <div className="ml-6">
              <p className="text-beige-800">{deliveryEstimate.date}</p>
              <p className="text-sm text-beige-600">{deliveryEstimate.time}</p>
            </div>
          </div>
          
          {/* Address with Map */}
          <div>
            <div className="flex items-center mb-2">
              <MapPinIcon className="h-4 w-4 text-beige-500 mr-2" />
              <span className="text-sm font-medium text-beige-700">Delivery Location</span>
            </div>
            <div className="ml-6">
              <StaticMapView 
                address={order.deliveryAddress}
                onAddressUpdate={handleAddressUpdate}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-beige-50 border-t border-beige-100 text-center">
        <p className="text-xs text-beige-500">
          Static map shown as an alternative to real-time tracking
        </p>
      </div>
    </div>
  );
};

export default DeliveryUpdates;