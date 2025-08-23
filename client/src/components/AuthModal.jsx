import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/api';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    kisanId: '',
    role: 'user'
  });
  const [kisanIdFile, setKisanIdFile] = useState(null);
  const [error, setError] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    setKisanIdFile(e.target.files[0]);
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
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
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
        
        <div className="flex justify-center mb-8 gap-4">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`px-8 py-4 text-base font-black border border-amber-200 rounded-2xl backdrop-blur-lg focus:outline-none transition-all duration-300 hover:scale-110 shadow-xl tracking-wide
              ${role === 'user' 
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xl border-amber-400/50 drop-shadow-lg' 
                : 'bg-white/80 text-amber-800 hover:bg-amber-500/30 hover:border-amber-400/50'}`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`px-8 py-4 text-base font-black border border-amber-200 rounded-2xl backdrop-blur-lg focus:outline-none transition-all duration-300 hover:scale-110 shadow-xl tracking-wide
              ${role === 'farmer' 
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xl border-amber-400/50 drop-shadow-lg' 
                : 'bg-white/80 text-amber-800 hover:bg-amber-500/30 hover:border-amber-400/50'}`}
          >
            Farmer
          </button>
          {mode === 'login' && (
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`px-8 py-4 text-base font-black border border-amber-200 rounded-2xl backdrop-blur-lg focus:outline-none transition-all duration-300 hover:scale-110 shadow-xl tracking-wide
                ${role === 'admin' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl border-red-400/50 drop-shadow-lg' 
                  : 'bg-white/80 text-amber-800 hover:bg-red-500/30 hover:border-red-400/50'}`}
            >
              Admin
            </button>
          )}
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-400/30 text-red-700 text-sm rounded-xl shadow-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-amber-800 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200 rounded-xl shadow-sm placeholder-amber-600 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 sm:text-sm"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200 rounded-xl shadow-sm placeholder-amber-600 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200 rounded-xl shadow-sm placeholder-amber-600 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

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
