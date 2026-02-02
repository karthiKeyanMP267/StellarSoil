import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/api';
import { signInWithGoogle, isFirebaseConfigured } from '../services/firebase';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    kisanId: '',
    role: 'user'
  });
  const [kisanIdFile, setKisanIdFile] = useState(null);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleVerified, setGoogleVerified] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (role === 'farmer') {
      setGoogleVerified(false);
    }
  }, [role]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    setKisanIdFile(e.target.files[0]);
  };

  const isValidEmail = (value) => {
    const normalized = (value || '').trim().toLowerCase();
    const blockedDomains = new Set([
      'example.com',
      'example.org',
      'example.net',
      'test.com',
      'test.org',
      'fake.com',
      'mailinator.com',
      'tempmail.com',
      '10minutemail.com',
      'guerrillamail.com'
    ]);

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const domain = normalized.split('@')[1];
    if (!normalized || !emailRegex.test(normalized)) return false;
    if (domain && blockedDomains.has(domain)) return false;
    return true;
  };

  const handleGoogleSignup = async () => {
    setError('');

    if (!isFirebaseConfigured) {
      setError('Firebase config missing. Add VITE_FIREBASE_* values in client env.');
      return;
    }

    try {
      setGoogleLoading(true);
      const { user, idToken } = await signInWithGoogle();
      if (!user?.email || !idToken) {
        setError('Google sign-in did not return an email.');
        return;
      }
      const res = await authApi.googleAuth({ idToken, role: 'user' });
      login(res.data.user, res.data.accessToken);
      setGoogleVerified(true);
      onClose();
    } catch (err) {
      const code = err?.code || err?.message;
      if (code === 'auth/configuration-not-found') {
        setError('Google Auth is not enabled for this Firebase project. Enable Google provider in Firebase Console → Authentication → Sign-in method, and add localhost to Authorized domains.');
      } else {
        setError(err?.message || 'Google sign-in failed');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (mode === 'login') {
        const res = await authApi.login({
          email: form.email,
          password: form.password,
          role: role
        });
        console.log('Login response:', res.data);
        login(res.data.user, res.data.accessToken);
        console.log('Stored token after login:', localStorage.getItem('token'));
        onClose();
      } else if (mode === 'register') {
        if (!isValidEmail(form.email)) {
          setError('Please enter a valid email address');
          return;
        }
        // Build data object for registration
        const data = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: role,
        };
        if (role === 'farmer' && kisanIdFile) {
          data.kisanId = kisanIdFile;
        }
        await authApi.register(data);
        // If registration successful, switch to login mode
        setMode('login');
        setForm({ ...form, password: '' });
        alert('Registration successful! Please verify your email before logging in.');
      }
    } catch (err) {
      const apiErr = err?.response?.data;
      if (apiErr?.errors && Array.isArray(apiErr.errors) && apiErr.errors.length > 0) {
        setError(apiErr.errors.map(e => e.message).join('\n'));
      } else {
        setError(apiErr?.msg || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300">
          {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
        </span>
      }
      overlayClassName="fixed inset-0 bg-gradient-to-br from-amber-900/90 via-orange-900/90 to-red-900/90 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="mt-4 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-amber-200/20 p-8 text-amber-900">
        
        {/* Enhanced Role Selection */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-earth-800 mb-4 text-center">
            Choose your role
          </h3>
          <div className="flex justify-center gap-4">
            <motion.button
              type="button"
              onClick={() => setRole('user')}
              className={`px-6 py-4 text-sm font-bold border-2 rounded-2xl backdrop-blur-lg focus:outline-none transition-all duration-300 relative overflow-hidden group ${
                role === 'user' 
                  ? 'bg-gradient-to-r from-beige-500 to-sage-600 text-white border-beige-400 shadow-xl' 
                  : 'bg-white/80 text-earth-700 border-beige-200 hover:bg-beige-50 hover:border-beige-300'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {role === 'user' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center">
                <UserIcon className="h-5 w-5 mr-2" />
                🛍️ Customer
              </span>
            </motion.button>
            
            <motion.button
              type="button"
              onClick={() => setRole('farmer')}
              className={`px-6 py-4 text-sm font-bold border-2 rounded-2xl backdrop-blur-lg focus:outline-none transition-all duration-300 relative overflow-hidden group ${
                role === 'farmer' 
                  ? 'bg-gradient-to-r from-sage-500 to-earth-600 text-white border-sage-400 shadow-xl' 
                  : 'bg-white/80 text-earth-700 border-beige-200 hover:bg-sage-50 hover:border-sage-300'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {role === 'farmer' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                👨‍🌾 Farmer
              </span>
            </motion.button>
            
            {mode === 'login' && (
              <motion.button
                type="button"
                onClick={() => setRole('admin')}
                className={`px-6 py-4 text-sm font-bold border-2 rounded-2xl backdrop-blur-lg focus:outline-none transition-all duration-300 relative overflow-hidden group ${
                  role === 'admin' 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-xl' 
                    : 'bg-white/80 text-earth-700 border-beige-200 hover:bg-red-50 hover:border-red-300'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {role === 'admin' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.723V12a1 1 0 11-2 0v-1.277l-1.246-.855a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.277l1.246.855a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.277V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                  </svg>
                  🔧 Admin
                </span>
              </motion.button>
            )}
          </div>
        </motion.div>
        
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-700 text-sm rounded-xl shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                {error}
              </div>
            </div>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="name" className="block text-sm font-semibold text-earth-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-beige-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-beige-200 rounded-xl shadow-sm placeholder-beige-500 text-earth-800 focus:outline-none focus:ring-2 focus:ring-beige-400 focus:border-transparent transition-all duration-300 sm:text-sm hover:bg-white/90"
                  placeholder="Enter your full name"
                />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: mode === 'register' ? 0.1 : 0 }}
          >
            <label htmlFor="email" className="block text-sm font-semibold text-earth-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-beige-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                readOnly={googleVerified}
                className="block w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-beige-200 rounded-xl shadow-sm placeholder-beige-500 text-earth-800 focus:outline-none focus:ring-2 focus:ring-beige-400 focus:border-transparent transition-all duration-300 sm:text-sm hover:bg-white/90"
                placeholder="Enter your email"
              />
            </div>
            {googleVerified && (
              <p className="mt-2 text-xs text-green-700 font-semibold">
                Google verified email
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: mode === 'register' ? 0.2 : 0.1 }}
          >
            <label htmlFor="password" className="block text-sm font-semibold text-earth-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-beige-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-3 bg-white/80 backdrop-blur-sm border border-beige-200 rounded-xl shadow-sm placeholder-beige-500 text-earth-800 focus:outline-none focus:ring-2 focus:ring-beige-400 focus:border-transparent transition-all duration-300 sm:text-sm hover:bg-white/90"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-beige-500 hover:text-beige-600 transition-colors duration-200" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-beige-500 hover:text-beige-600 transition-colors duration-200" />
                )}
              </button>
            </div>
          </motion.div>

          {mode === 'register' && role === 'farmer' && (
            <div>
              <label htmlFor="kisanId" className="block text-sm font-medium text-amber-800 mb-2">
                Kisan ID Document
              </label>
              <input
                id="kisanId"
                name="kisanId"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="block w-full text-sm text-amber-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-500/20 file:text-amber-700 hover:file:bg-amber-500/30 file:backdrop-blur-sm"
                required
              />
              <p className="mt-2 text-xs text-gray-400">Upload your Kisan ID card (PDF, JPG, JPEG, or PNG)</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl text-white font-black text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all duration-300 hover:scale-105 shadow-2xl tracking-wide drop-shadow-lg
              ${loading
                ? 'bg-amber-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-2xl'
              }`}
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              mode === 'login' ? 'Sign in' : 'Create account'
            )}
          </button>
        </form>

        {mode === 'register' && role === 'user' && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading}
              className="w-full py-3 px-6 rounded-2xl border-2 border-beige-200 bg-white text-earth-700 font-bold hover:bg-beige-50 transition-all duration-300 shadow-sm"
            >
              {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </button>
          </div>
        )}
        
        <div className="mt-8 text-center text-sm">
          <span className="text-amber-700">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
              setForm({
                name: '',
                email: '',
                password: '',
                kisanId: '',
                role: 'user'
              });
              setGoogleVerified(false);
              setRole('user'); // Reset role when switching modes
            }}
            className="text-amber-600 font-medium hover:text-amber-800 focus:outline-none focus:underline transition-colors duration-200 ml-1"
          >
            {mode === 'login' ? 'Sign up here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
