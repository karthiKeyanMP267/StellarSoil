import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import FarmProfileModal from '../components/FarmProfileModal';

export default function FarmProfile({ onComplete }) {
  const { user, setUser, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);

  // Redirect if not authenticated or not a farmer
  useEffect(() => {
    console.log('Auth state:', { user, token }); // Debug auth state
    if (!token || !user) {
      console.log('No authentication, redirecting to login');
      navigate('/');
      return;
    }
    if (user.role !== 'farmer') {
      console.log('User is not a farmer, redirecting');
      navigate('/');
      return;
    }
    setLoading(false);
  }, [token, user, navigate]);

  const handleProfileComplete = (farmData) => {
    // Update user context with new farm name if needed
    if (user?.farmName !== farmData.name) {
      setUser(prev => ({ 
        ...prev, 
        farmName: farmData.name,
        farmDescription: farmData.description || prev.farmDescription,
        location: farmData.location || prev.location
      }));
      
      // Also update localStorage to persist the changes
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        farmName: farmData.name,
        farmDescription: farmData.description || storedUser.farmDescription,
        location: farmData.location || storedUser.location
      }));
    }
    
    if (onComplete) {
      onComplete(farmData);
    }
    
    // Navigate to farmer dashboard
    navigate('/farmer');
  };

  const handleClose = () => {
    navigate('/farmer');
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <FarmProfileModal 
          isOpen={showModal}
          onClose={handleClose}
          onComplete={handleProfileComplete}
          userData={user}
        />
      )}
    </div>
  );
}
