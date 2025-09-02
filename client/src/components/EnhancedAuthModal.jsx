import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  DocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/api';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    kisanId: '',
    role: 'user'
  });
  const [kisanIdFile, setKisanIdFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    setMode(initialMode);
    setForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      kisanId: '',
      role: role
    });
    setError('');
    setSuccess('');
  }, [initialMode, isOpen, role]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    setKisanIdFile(e.target.files[0]);
  };

  const validateForm = () => {
    if (mode === 'register') {
      if (!form.name.trim()) {
        setError(t('auth.errors.nameRequired'));
        return false;
      }
      if (form.password !== form.confirmPassword) {
        setError(t('auth.errors.passwordMismatch'));
        return false;
      }
      if (form.password.length < 6) {
        setError(t('auth.errors.passwordTooShort'));
        return false;
      }
      if (role === 'farmer' && !form.kisanId.trim()) {
        setError(t('auth.errors.kisanIdRequired'));
        return false;
      }
    }
    
    if (!form.email.trim()) {
      setError(t('auth.errors.emailRequired'));
      return false;
    }
    
    if (!form.password.trim()) {
      setError(t('auth.errors.passwordRequired'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setError('');
    setLoading(true);
    
    try {
      if (mode === 'login') {
        const res = await authApi.login({
          email: form.email,
          password: form.password,
          role: role
        });
        login(res.data.user, res.data.accessToken);
        setSuccess(t('auth.loginSuccess'));
        setTimeout(() => onClose(), 1000);
      } else if (mode === 'register') {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('email', form.email);
        formData.append('password', form.password);
        formData.append('role', role);
        
        if (role === 'farmer') {
          formData.append('kisanId', form.kisanId);
          if (kisanIdFile) {
            formData.append('kisanIdFile', kisanIdFile);
          }
        }
        
        await authApi.register(formData);
        setSuccess(t('auth.registerSuccess'));
        setTimeout(() => {
          setMode('login');
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('auth.errors.general'));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setSuccess('');
    setForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      kisanId: '',
      role: role
    });
  };

  const roleOptions = [
    { value: 'user', label: t('auth.signup.roles.user'), icon: '👤', color: 'from-beige-400 to-cream-400' },
    { value: 'farmer', label: t('auth.signup.roles.farmer'), icon: '👨‍🌾', color: 'from-sage-400 to-earth-400' },
    { value: 'admin', label: t('auth.signup.roles.admin'), icon: '👨‍💼', color: 'from-earth-400 to-beige-400' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          static
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md"
            >
              <Dialog.Panel className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-strong border border-beige-200/50 overflow-hidden">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.button>

                {/* Header */}
                <div className="bg-gradient-to-r from-beige-100 to-cream-100 px-8 py-6 border-b border-beige-200/50">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold text-beige-800">
                      {mode === 'login' ? t('auth.login.title') : t('auth.signup.title')}
                    </h2>
                    <p className="text-beige-600 mt-1">
                      {mode === 'login' ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
                    </p>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="px-8 py-6">
                  {/* Role Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                  >
                    <label className="block text-sm font-semibold text-beige-700 mb-3">
                      {mode === 'register' ? t('auth.signup.role') : 'Sign in as'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {roleOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setRole(option.value)}
                          className={`p-3 rounded-2xl border-2 transition-all duration-300 ${
                            role === option.value
                              ? 'border-beige-400 bg-gradient-to-r from-beige-100 to-cream-100'
                              : 'border-beige-200 hover:border-beige-300 bg-white/50'
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.icon}</div>
                          <div className="text-xs font-medium text-beige-700">
                            {option.label}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field (Register only) */}
                    {mode === 'register' && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="block text-sm font-semibold text-beige-700 mb-2">
                          {t('auth.signup.name')}
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-beige-400" />
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full pl-10 pr-4 py-3 border-2 border-beige-300 rounded-xl bg-white/80 placeholder-beige-400 transition-all duration-300"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Email Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: mode === 'register' ? 0.5 : 0.4 }}
                    >
                      <label className="block text-sm font-semibold text-beige-700 mb-2">
                        {t('auth.login.email')}
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-beige-400" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-4 py-3 border-2 border-beige-300 rounded-xl bg-white/80 placeholder-beige-400 transition-all duration-300"
                        />
                      </div>
                    </motion.div>

                    {/* Password Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: mode === 'register' ? 0.6 : 0.5 }}
                    >
                      <label className="block text-sm font-semibold text-beige-700 mb-2">
                        {t('auth.login.password')}
                      </label>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-beige-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-12 py-3 border-2 border-beige-300 rounded-xl bg-white/80 placeholder-beige-400 transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-beige-400 hover:text-beige-600 transition-colors"
                        >
                          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </motion.div>

                    {/* Confirm Password (Register only) */}
                    {mode === 'register' && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <label className="block text-sm font-semibold text-beige-700 mb-2">
                          {t('auth.signup.confirmPassword')}
                        </label>
                        <div className="relative">
                          <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-beige-400" />
                          <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className="w-full pl-10 pr-4 py-3 border-2 border-beige-300 rounded-xl bg-white/80 placeholder-beige-400 transition-all duration-300"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Kisan ID (Farmer only) */}
                    {mode === 'register' && role === 'farmer' && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-beige-700 mb-2">
                            Kisan ID Number
                          </label>
                          <div className="relative">
                            <DocumentIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-beige-400" />
                            <input
                              type="text"
                              name="kisanId"
                              value={form.kisanId}
                              onChange={handleChange}
                              placeholder="Enter your Kisan ID"
                              className="w-full pl-10 pr-4 py-3 border-2 border-beige-300 rounded-xl bg-white/80 placeholder-beige-400 transition-all duration-300"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-beige-700 mb-2">
                            Kisan ID Document (Optional)
                          </label>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="w-full px-4 py-3 border-2 border-beige-300 rounded-xl bg-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-beige-100 file:text-beige-700 hover:file:bg-beige-200 transition-all duration-300"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Error/Success Messages */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl"
                        >
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                          <span className="text-sm text-red-700">{error}</span>
                        </motion.div>
                      )}
                      
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-xl"
                        >
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-700">{success}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-beige-500 to-cream-500 text-white font-bold text-lg rounded-xl hover:from-beige-600 hover:to-cream-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-medium hover:shadow-strong"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Please wait...</span>
                        </div>
                      ) : (
                        mode === 'login' ? t('auth.login.submit') : t('auth.signup.submit')
                      )}
                    </motion.button>
                  </form>

                  {/* Switch Mode */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-6 text-center"
                  >
                    <p className="text-beige-600">
                      {mode === 'login' ? t('auth.login.noAccount') : t('auth.signup.hasAccount')}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={switchMode}
                      className="mt-2 text-beige-700 font-semibold hover:text-beige-800 transition-colors"
                    >
                      {mode === 'login' ? t('auth.login.signup') : t('auth.signup.login')}
                    </motion.button>
                  </motion.div>
                </div>
              </Dialog.Panel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
