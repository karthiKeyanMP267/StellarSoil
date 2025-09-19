import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API from './api/api';
import { MapPinIcon } from '@heroicons/react/24/outline';
import AddressForm from './AddressForm';

const OrderAddressEdit = ({ order, onUpdate, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(order.deliveryAddress || {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    landmark: ''
  });
  
  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await API.put(`/api/orders/${order._id}/address`, {
        deliveryAddress: address
      });
      
      if (onUpdate) {
        onUpdate(response.data.order);
      }
    } catch (err) {
      console.error('Error updating address:', err);
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-amber-100 rounded-full">
          <MapPinIcon className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-amber-800">Update Delivery Address</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <AddressForm 
          address={address}
          onChange={handleAddressChange}
          deliveryType={order.deliveryType}
        />
        
        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Address'
            )}
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
          <p>Note: You can only update the address if the order hasn't been processed yet.</p>
        </div>
      </form>
    </motion.div>
  );
};

export default OrderAddressEdit;