// src/components/AdminRoute.jsx

import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldExclamationIcon, 
  SparklesIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log('AdminRoute:', { user, loading }); // Enhanced debug

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 flex items-center justify-center"
      >
        <motion.div 
          className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-beige-200"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="relative mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 border-4 border-beige-200 border-t-beige-600 rounded-full shadow-lg mx-auto"></div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <SparklesIcon className="w-6 h-6 text-beige-600" />
            </motion.div>
          </motion.div>
          <motion.h3 
            className="text-xl font-semibold text-beige-800 mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Verifying Admin Access...
          </motion.h3>
          <p className="text-beige-600">Please wait while we authenticate your permissions</p>
        </motion.div>
      </motion.div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/" />;
  }

  if (user.role !== 'admin') {
    console.log('User is not admin, redirecting to home');
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 flex items-center justify-center p-8"
      >
        <motion.div 
          className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-red-200 p-8 text-center"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ShieldExclamationIcon className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h2 
            className="text-2xl font-bold text-red-700 mb-4"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Access Denied
          </motion.h2>
          <motion.p 
            className="text-red-600 mb-6 text-lg"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            You don't have permission to access the admin panel. Admin privileges are required.
          </motion.p>
          <motion.div 
            className="flex items-center justify-center text-sm text-red-500 bg-red-50 rounded-xl p-4"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            If you believe this is an error, please contact your administrator.
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return children;
};

export default AdminRoute;
