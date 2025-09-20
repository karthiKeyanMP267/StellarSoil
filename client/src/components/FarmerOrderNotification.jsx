import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import API from '../api/api';

const FarmerOrderNotification = () => {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get('/api/orders/farmer-orders');
        // Count orders that are not delivered or cancelled
        const pending = response.data.filter(order => 
          !['delivered', 'cancelled'].includes(order.orderStatus)
        ).length;
        
        setPendingOrders(pending);
      } catch (err) {
        console.error('Error fetching farmer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Refresh order notifications every 2 minutes
    const interval = setInterval(fetchOrders, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Link 
      to="/farmer/orders" 
      className="relative flex items-center justify-center px-4 py-2 text-beige-800 hover:bg-beige-100 rounded-lg transition-colors"
    >
      <span className="flex items-center">
        <ShoppingBagIcon className="h-5 w-5 mr-2" />
        Orders
      </span>
      
      {!loading && pendingOrders > 0 && (
        <span className="absolute -top-1 -right-1 bg-beige-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {pendingOrders}
        </span>
      )}
    </Link>
  );
};

export default FarmerOrderNotification;