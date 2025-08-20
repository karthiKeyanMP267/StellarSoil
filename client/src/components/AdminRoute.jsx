// src/components/AdminRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log('AdminRoute user:', user); // Debug: see what user is

  if (loading) return null; // or a spinner if you want
  if (!user) return <Navigate to="/" />;
  return user.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;
