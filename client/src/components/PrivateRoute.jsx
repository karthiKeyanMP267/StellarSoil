// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" />;
    } else if (user.role === 'farmer') {
      return <Navigate to="/farmer-dashboard" />;
    } else {
      return <Navigate to="/user-dashboard" />;
    }
  }

  return children;
};

export default PrivateRoute;
