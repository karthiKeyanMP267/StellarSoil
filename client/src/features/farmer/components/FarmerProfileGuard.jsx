import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import MandatoryFarmProfile from './MandatoryFarmProfile';

const FarmerProfileGuard = ({ children }) => {
  const { user } = useAuth();
  const [hasFarmProfile, setHasFarmProfile] = useState(null); // null = loading, true/false = result
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user has completed farm profile
  useEffect(() => {
    const checkFarmProfile = async () => {
      // Only check for farmer users
      if (!user || user.role !== 'farmer') {
        setIsLoading(false);
        return;
      }
      
      try {
        await API.get('/farms/profile/me');
        setHasFarmProfile(true);
        setIsLoading(false);
      } catch (err) {
        if (err?.response?.status === 404) {
          setHasFarmProfile(false);
        } else {
          // For any other error, assume profile exists to avoid blocking user
          setHasFarmProfile(true);
        }
        setIsLoading(false);
      }
    };
    
    checkFarmProfile();
  }, [user]);

  // Don't render anything during loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-3 text-beige-700">Loading your farm profile...</p>
        </div>
      </div>
    );
  }

  // Show mandatory profile form if needed
  if (user?.role === 'farmer' && hasFarmProfile === false) {
    return <MandatoryFarmProfile />;
  }

  // Otherwise, render children
  return children;
};

export default FarmerProfileGuard;