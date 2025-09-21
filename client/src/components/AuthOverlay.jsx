import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/api';

export default function AuthOverlay({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // default to user, can be changed by UI
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await authApi.login({
          email: form.email,
          password: form.password,
          role: form.role,
        });
        login(res.data.user, res.data.accessToken);
        onClose();
      } else {
        // This lightweight overlay doesn't support file upload; block farmer registration here
        if (form.role === 'farmer') {
          setError('Farmer registration requires uploading a Kisan ID document. Please use the main sign-up form.');
          return;
        }
        await authApi.register(form);
        setIsLogin(true);
        setForm({ ...form, password: '' });
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      const apiErr = err?.response?.data;
      if (apiErr?.errors && Array.isArray(apiErr.errors) && apiErr.errors.length > 0) {
        setError(apiErr.errors.map(e => e.message).join('\n'));
      } else {
        setError(apiErr?.msg || (isLogin ? 'Login failed' : 'Registration failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setForm({
      name: '',
      email: '',
      password: '',
    });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-lg transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-green-100/50">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-full bg-white/50 backdrop-blur-sm text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 p-2 hover:scale-110 transition-all"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                  <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent mb-6">
                    {isLogin ? 'Welcome Back!' : 'Create Account'}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required={!isLogin}
                        value={form.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-xl border-green-200 shadow-sm focus:border-amber-500 focus:ring-green-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-colors"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">Account Type:</label>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-lg border ${form.role === 'user' ? 'bg-green-100 border-green-400' : 'bg-white border-gray-300'}`}
                      onClick={() => setForm(f => ({ ...f, role: 'user' }))}
                    >User</button>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-lg border ${form.role === 'farmer' ? 'bg-green-50 border-green-300 text-gray-400' : 'bg-white border-gray-200 text-gray-400'}`}
                      onClick={() => setForm(f => ({ ...f, role: isLogin ? 'farmer' : 'user' }))}
                      title={!isLogin ? 'Use the main sign-up form to register as Farmer' : undefined}
                    >Farmer</button>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-xl border-green-200 shadow-sm focus:border-amber-500 focus:ring-green-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-xl border-green-200 shadow-sm focus:border-amber-500 focus:ring-green-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-colors"
                    />
                  </div>

                  {error && (
                    <div className={`p-3 rounded-xl text-sm ${error.includes('successful') ? 'bg-green-50/50 text-green-700 border border-green-200' : 'bg-red-50/50 text-red-700 border border-red-200'}`}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-xl text-sm font-medium text-white bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-500 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </div>
                    ) : (
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
