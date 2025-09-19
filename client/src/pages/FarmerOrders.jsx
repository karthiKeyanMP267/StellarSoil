import React from 'react';
import { motion } from 'framer-motion';
import FarmerOrderManagement from '../components/FarmerOrderManagement';
import { useAuth } from '../context/AuthContext';

const FarmerOrders = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-beige-800">Your Orders</h1>
        </div>

        <FarmerOrderManagement />
      </motion.div>
    </div>
  );
};

export default FarmerOrders;