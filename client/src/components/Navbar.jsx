import { Fragment, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon,
  UserCircleIcon,
  HomeIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  HeartIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import AuthModal from './AuthModal';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  const baseNavigation = [
    { 
      name: 'Home', 
      href: user ? '/dashboard' : '/', 
      current: location.pathname === (user ? '/dashboard' : '/'),
      icon: HomeIcon,
      requiresAuth: false
    }
  ];

  const userNavigation = [
    {
      name: 'Marketplace',
      href: '/marketplace',
      current: location.pathname.startsWith('/marketplace'),
      icon: BuildingStorefrontIcon
    },
    {
      name: 'Cart',
      href: '/cart',
      current: location.pathname === '/cart',
      icon: ShoppingCartIcon
    },
    { 
      name: 'My Orders', 
      href: '/orders', 
      current: location.pathname === '/orders',
      icon: CurrencyDollarIcon
    },
    {
      name: 'Favorites', 
      href: '/favorites', 
      current: location.pathname === '/favorites',
      icon: HeartIcon
    },
    {
      name: 'Profile', 
      href: '/profile', 
      current: location.pathname === '/profile',
      icon: UserCircleIcon
    }
  ];

  const farmerNavigation = [
    { 
      name: 'My Farm', 
      href: '/farmer', 
      current: location.pathname === '/farmer',
      icon: BuildingStorefrontIcon
    },
    { 
      name: 'Profile', 
      href: '/farmer/profile', 
      current: location.pathname === '/farmer/profile',
      icon: UserCircleIcon
    }
  ];

  const adminNavigation = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      current: location.pathname === '/admin',
      icon: HomeIcon
    },
    {
      name: 'Manage Farms',
      href: '/admin/farms',
      current: location.pathname === '/admin/farms',
      icon: BuildingStorefrontIcon
    },
    {
      name: 'Manage Users',
      href: '/admin/users',
      current: location.pathname === '/admin/users',
      icon: UserGroupIcon
    }
  ];

  let navigation = [...baseNavigation];
  if (user) {
    if (user.role === 'user') navigation = [...navigation, ...userNavigation];
    if (user.role === 'farmer') navigation = [...navigation, ...farmerNavigation];
    if (user.role === 'admin') navigation = [...navigation, ...adminNavigation];
  }
  
  navigation = navigation.filter(item => !item.requiresAuth || (item.requiresAuth && user));


  return (
    <>
      <Disclosure as="nav" className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-yellow-100/95 via-amber-50/95 to-orange-100/95 backdrop-blur-md shadow-xl border-b border-yellow-200/30 z-50">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link to={user ? "/dashboard" : "/"} className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-800 via-amber-900 to-yellow-900 drop-shadow-lg hover:scale-105 transition-all duration-300">
                      🌾 StellarSoil
                    </Link>
                  </div>
                  <div className="hidden sm:ml-8 sm:block">
                    <div className="flex space-x-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gradient-to-r from-yellow-300/40 to-amber-300/40 backdrop-blur-sm border border-yellow-400/40 text-yellow-900 shadow-lg'
                              : 'text-yellow-700 hover:bg-yellow-200/20 hover:text-yellow-900 border border-transparent hover:shadow-md',
                            'rounded-xl px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          <item.icon className="h-4 w-4 inline-block mr-1.5" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  {!user ? (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openModal('login')}
                        className="flex items-center justify-center rounded-xl px-6 py-2 text-sm font-medium text-yellow-800 border border-yellow-400/40 bg-yellow-100/20 backdrop-blur-sm hover:bg-yellow-300/30 hover:text-yellow-900 transition-all duration-300 hover:scale-105"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1.5" />
                        Sign In
                      </button>
                      <button
                        onClick={() => openModal('register')}
                        className="flex items-center justify-center rounded-xl px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        <UserPlusIcon className="h-4 w-4 mr-1.5" />
                        Sign Up
                      </button>
                    </div>
                  ) : (
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-white/20 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 hover:scale-105">
                          <span className="sr-only">Open user menu</span>
                          <UserCircleIcon className="h-7 w-7 text-amber-300" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-2xl bg-gradient-to-br from-amber-800/95 to-orange-900/95 backdrop-blur-lg py-2 shadow-2xl border border-amber-200/20 focus:outline-none">
                          <div className="px-4 py-3 border-b border-amber-200/20">
                            <p className="text-sm text-gray-400">Signed in as</p>
                            <p className="text-sm font-medium text-white truncate">{user.email}</p>
                            <p className="text-xs text-amber-300 capitalize">{user.role}</p>
                          </div>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={classNames(
                                  active ? 'bg-white/10' : '',
                                  'w-full text-left block px-4 py-3 text-sm text-gray-300 hover:text-white transition-colors'
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                </div>
                <div className="-mr-2 flex sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-xl p-2 text-gray-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-400 transition-all">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden bg-gradient-to-b from-amber-800/95 to-orange-900/95 backdrop-blur-lg border-t border-amber-200/20">
              <div className="space-y-1 px-4 pb-3 pt-4">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current 
                        ? 'bg-gradient-to-r from-amber-600/30 to-orange-600/30 backdrop-blur-sm border border-amber-400/30 text-amber-300' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent',
                      'block rounded-xl px-4 py-3 text-base font-medium transition-all'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-amber-200/20 pb-4 pt-4">
                {user ? (
                  <div className="px-4">
                     <div className="px-2 pb-4">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                        <p className="text-xs text-amber-300 capitalize">{user.role}</p>
                      </div>
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogout}
                      className="block w-full text-left rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                ) : (
                  <div className="px-4 space-y-2">
                     <Disclosure.Button
                      as="button"
                      onClick={() => openModal('login')}
                      className="block w-full text-left rounded-xl px-4 py-3 text-base font-medium text-amber-300 border border-amber-400/30 bg-white/10 hover:bg-amber-500/20 hover:text-white transition-all"
                    >
                      Sign In
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={() => openModal('register')}
                      className="block w-full text-left rounded-xl px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transition-all"
                    >
                      Sign Up
                    </Disclosure.Button>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseModal}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;
