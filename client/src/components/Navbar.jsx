import { Fragment, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  XMarkIcon
} from '@heroicons/react/24/outline';
import AuthModal from './AuthModal';
import AuthOverlay from './AuthOverlay';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleLogout = () => {
    logout();
  };

  const openModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  const navigation = [
    { 
      name: 'Home', 
      href: '/', 
      current: location.pathname === '/',
      icon: HomeIcon
    },
    ...(user?.role === 'user' 
      ? [
          { 
            name: 'Browse Farms', 
            href: '/farms', 
            current: location.pathname === '/farms',
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
          }
        ] 
      : []),
    ...(user?.role === 'farmer'
      ? [
          { 
            name: 'My Farm', 
            href: '/farm-dashboard', 
            current: location.pathname === '/farm-dashboard',
            icon: BuildingStorefrontIcon
          },
          { 
            name: 'Orders', 
            href: '/farm-orders', 
            current: location.pathname === '/farm-orders',
            icon: ShoppingCartIcon
          },
          {
            name: 'Earnings', 
            href: '/earnings', 
            current: location.pathname === '/earnings',
            icon: CurrencyDollarIcon
          }
        ]
      : []),
    ...(user?.role === 'admin'
      ? [
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
            name: 'Users',
            href: '/admin/users',
            current: location.pathname === '/admin/users',
            icon: UserGroupIcon
          }
        ]
      : [])
  ];

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-green-50 to-emerald-50/90 backdrop-blur-md shadow-md z-50">
      {({ open }) => (
        <>
          <div className="mx-auto w-full">
            <div className="flex h-16 items-center justify-between w-full px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
                    StellarSoil
                  </Link>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? 'border-green-500 text-green-600 bg-green-50/50'
                          : 'border-transparent text-gray-500 hover:border-green-300 hover:text-green-600 hover:bg-green-50/30',
                        'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border-b-2 transition-all duration-200'
                      )}
                    >
                      {item.icon && (
                        <item.icon className="h-5 w-5 mr-1.5 flex-shrink-0" aria-hidden="true" />
                      )}
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {!user ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => openModal('login')}
                        className="rounded-full px-4 py-2 text-sm font-medium border border-green-500 bg-white text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-lg transition-all duration-200 shadow-sm focus:outline-none"
                        style={{ minWidth: 90 }}
                      >
                        Sign in
                      </button>
                      <button
                        onClick={() => openModal('register')}
                        className="rounded-full px-4 py-2 text-sm font-medium border border-green-600 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-sm hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transition-all duration-200 focus:outline-none"
                        style={{ minWidth: 90 }}
                      >
                        Sign up
                      </button>
                    </div>
                    <AuthModal
                      isOpen={showAuthModal}
                      onClose={handleCloseModal}
                      initialMode={authMode}
                    />
                  </>
                ) : (
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 hover:from-primary-200 hover:to-secondary-200">
                      <UserCircleIcon className="h-8 w-8 text-primary-600" aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/10 focus:outline-none border border-gray-100">
                        <div className="px-5 py-3 border-b border-gray-100 rounded-t-2xl bg-gradient-to-r from-primary-50 to-secondary-50">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-base font-semibold text-primary-700 truncate capitalize">{user.role}</p>
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active
                                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 border border-black text-white'
                                  : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border border-transparent',
                                'w-full text-left block px-5 py-3 text-base font-medium rounded-b-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500'
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
              <div className="flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
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

          <Disclosure.Panel className="sm:hidden bg-white border-t border-gray-100">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-primary-600',
                    'flex items-center px-3 py-2 text-base font-medium rounded-lg transition-colors duration-150'
                  )}
                >
                  {item.icon && (
                    <item.icon className="h-5 w-5 mr-2 flex-shrink-0" aria-hidden="true" />
                  )}
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            {!user ? (
              <div className="border-t border-gray-200 px-2 py-4 space-y-2">
                <Disclosure.Button
                  as="button"
                  onClick={() => openModal('login')}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors duration-150"
                >
                  Sign in
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => openModal('register')}
                  className="w-full text-center px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-secondary-500 to-primary-500 rounded-lg hover:from-secondary-600 hover:to-primary-600 transition-all duration-200"
                >
                  Sign up
                </Disclosure.Button>
              </div>
            ) : (
              <div className="border-t border-gray-200 px-2 py-4">
                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900">{user.role}</p>
                </div>
                <Disclosure.Button
                  as="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors duration-150"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );

};

export default Navbar;
