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
        login(res.data.user, res.data.accessToken);
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
        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
          {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
        </span>
      }
      overlayClassName="fixed inset-0 bg-gradient-to-b from-[#7BE0B0]/90 to-[#2EAEF0]/90 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="mt-4 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 rounded-2xl shadow-2xl p-8 text-gray-900">
        
      <div className="flex justify-center mb-6 gap-2">
  <button
    type="button"
    onClick={() => setRole('user')}
    className={`px-4 py-2 text-sm font-medium border border-secondary-500 rounded-lg focus:outline-none transition-colors duration-200
      ${role === 'user' ? 'bg-secondary-500 text-white shadow-lg' : 'bg-white text-secondary-600 hover:bg-secondary-600 hover:text-white hover:shadow-lg'}`}
  >
    User
  </button>
  <button
    type="button"
    onClick={() => setRole('farmer')}
    className={`px-4 py-2 text-sm font-medium border border-secondary-500 rounded-lg focus:outline-none transition-colors duration-200
      ${role === 'farmer' ? 'bg-secondary-500 text-white shadow-lg' : 'bg-white text-secondary-600 hover:bg-secondary-600 hover:text-white hover:shadow-lg'}`}
  >
    Farmer
  </button>
  {mode === 'login' && (
    <button
      type="button"
      onClick={() => setRole('admin')}
      className={`px-4 py-2 text-sm font-medium border border-secondary-500 rounded-lg focus:outline-none transition-colors duration-200
        ${role === 'admin' ? 'bg-secondary-500 text-white shadow-lg' : 'bg-white text-secondary-600 hover:bg-secondary-600 hover:text-white hover:shadow-lg'}`}
    >
      Admin
    </button>
  )}
</div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg shadow-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {mode === 'register' && role === 'farmer' && (
            <div>
              <label htmlFor="kisanId" className="block text-sm font-medium text-gray-700 mb-1">
                Kisan ID Document
              </label>
              <input
                id="kisanId"
                name="kisanId"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Upload your Kisan ID card (PDF, JPG, JPEG, or PNG)</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200
              ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
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
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
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
            className="text-green-600 font-medium hover:text-emerald-600 focus:outline-none focus:underline transition-colors duration-200 ml-1"
          >
            {mode === 'login' ? 'Sign up here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
