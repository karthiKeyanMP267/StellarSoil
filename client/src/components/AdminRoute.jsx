// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;
  return user.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;
