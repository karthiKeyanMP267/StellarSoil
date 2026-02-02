import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomeRedirect() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'farmer':
      return <Navigate to="/farmer" replace />;
    case 'user':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
