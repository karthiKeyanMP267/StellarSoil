import { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
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
  Cog6ToothIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import AuthModal from './AuthModal';
import EnhancedLanguageSelector from './EnhancedLanguageSelector';
import EnhancedThemeToggle from './EnhancedThemeToggle';
import useGoogleTranslate from '../hooks/useGoogleTranslate';
import ThemeToggle from './ThemeToggle';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const EnhancedNavbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isTranslateActive = useGoogleTranslate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [notifications, setNotifications] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const [recentPages, setRecentPages] = useState([]);

  // Enhanced scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track recent pages for quick navigation
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath && currentPath !== '/') {
      setRecentPages(prev => {
        const filtered = prev.filter(page => page.path !== currentPath);
        return [{ path: currentPath, timestamp: Date.now() }, ...filtered].slice(0, 3);
      });
    }
  }, [location.pathname]);

  // Enhanced search functionality
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  // Quick action suggestions based on user role
  useEffect(() => {
    const actions = [];
    if (user) {
      if (user.role === 'farmer') {
        actions.push(
          { name: 'Add Product', icon: SparklesIcon, path: '/farmer/products/add' },
          { name: 'View Analytics', icon: InformationCircleIcon, path: '/farmer/analytics' },
          { name: 'Manage Orders', icon: CurrencyDollarIcon, path: '/farmer/orders', showBadge: true }
        );
      } else if (user.role === 'user') {
        actions.push(
          { name: 'Browse Market', icon: BuildingStorefrontIcon, path: '/marketplace' },
          { name: 'Check Cart', icon: ShoppingCartIcon, path: '/cart' },
          { name: 'Order History', icon: BookmarkIcon, path: '/orders' }
        );
      } else if (user.role === 'admin') {
        actions.push(
          { name: 'User Management', icon: UserGroupIcon, path: '/admin/users' },
          { name: 'Farm Oversight', icon: BuildingStorefrontIcon, path: '/admin/farms' },
          { name: 'System Analytics', icon: InformationCircleIcon, path: '/admin/analytics' }
        );
      }
    }
    setQuickActions(actions);
  }, [user]);

  // Custom focus style instead of prevention
  const handleFocus = (e) => {
    // Add a custom focus style if needed
    if (e.target) {
      e.target.classList.add('custom-focus');
    }
  };

  const handleBlur = (e) => {
    // Remove custom focus style
    if (e.target) {
      e.target.classList.remove('custom-focus');
    }
  };

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const openModal = useCallback((mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  }, []);

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  const baseNavigation = [
    { 
      name: t('nav.home'), 
      href: user ? '/dashboard' : '/', 
      current: location.pathname === (user ? '/dashboard' : '/'),
      icon: HomeIcon,
      requiresAuth: false
    },
    {
      name: 'Features',
      href: '/features',
      current: location.pathname === '/features',
      icon: SparklesIcon,
      requiresAuth: false
    }
  ];

  const userNavigation = [
    {
      name: t('nav.marketplace'),
      href: '/marketplace',
      current: location.pathname.startsWith('/marketplace'),
      icon: BuildingStorefrontIcon
    },
    {
      name: t('nav.cart'),
      href: '/cart',
      current: location.pathname === '/cart',
      icon: ShoppingCartIcon,
      badge: true
    },
    { 
      name: t('nav.orders'), 
      href: '/orders', 
      current: location.pathname === '/orders',
      icon: CurrencyDollarIcon
    },
    {
      name: t('nav.favorites'), 
      href: '/favorites', 
      current: location.pathname === '/favorites',
      icon: HeartIcon
    },
    {
      name: t('nav.profile'), 
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
    }
  ];

  const adminNavigation = [
    { 
      name: t('nav.dashboard'), 
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

  const navigation = useMemo(() => {
    let nav = [...baseNavigation];
    if (user) {
      if (user.role === 'user') nav = [...nav, ...userNavigation];
      if (user.role === 'farmer') nav = [...nav, ...farmerNavigation];
      if (user.role === 'admin') nav = [...nav, ...adminNavigation];
    }
    return nav.filter(item => !item.requiresAuth || (item.requiresAuth && user));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, location.pathname, t]);

  return (
    <motion.div
      className="fixed left-0 right-0 w-full z-50"
      style={{ 
        top: isTranslateActive ? '40px' : '0px',
        transition: 'top 0.3s ease-in-out'
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Disclosure as="nav" className="backdrop-blur-xl bg-white/90 border-b border-gray-200/30 shadow-lg">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                  {/* Enhanced Logo */}
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      to={user ? "/dashboard" : "/"} 
                      className="flex items-center space-x-3 group"
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    >
                      <motion.div 
                        className="relative"
                        animate={{ 
                          rotate: [0, 3, -3, 0],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        whileHover={{
                          scale: 1.1,
                          rotate: [0, 15, -15, 0],
                          transition: { duration: 0.6 }
                        }}
                      >
                        <motion.div 
                          className="text-3xl"
                          animate={{
                            filter: [
                              'drop-shadow(0 0 0px rgba(90, 138, 90, 0))',
                              'drop-shadow(0 0 8px rgba(90, 138, 90, 0.3))',
                              'drop-shadow(0 0 0px rgba(90, 138, 90, 0))'
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          🌾
                        </motion.div>
                        
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-sage-400/20 to-beige-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            rotate: [0, 180, 360]
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                      </motion.div>
                      
                      <div>
                        <motion.h1 
                          className="text-xl lg:text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sage-700 via-sage-600 to-sage-800"
                          whileHover={{ 
                            backgroundImage: "linear-gradient(to right, #4a734a, #3d5a3d, #2d4a2d, #4a734a)"
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          StellarSoil
                        </motion.h1>
                        <motion.p 
                          className="text-xs text-sage-600 font-medium tracking-wider"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          🌱 Farm Fresh • 🌿 Sustainable
                        </motion.p>
                      </div>
                    </Link>
                  </motion.div>

                  {/* Enhanced Desktop Navigation */}
                  <div className="hidden lg:ml-8 lg:block">
                    <motion.div 
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      {navigation.map((item, index) => (
                        <motion.div 
                          key={item.name}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                        >
                          <Link
                            to={item.href}
                            className={classNames(
                              item.current
                                ? 'text-sage-700 font-semibold bg-gradient-to-r from-sage-50/90 to-beige-50/90 shadow-sm'
                                : 'text-gray-700 hover:text-sage-700 hover:bg-gradient-to-r hover:from-sage-50/60 hover:to-beige-50/60',
                              'relative px-4 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 group rounded-lg backdrop-blur-sm'
                            )}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            aria-current={item.current ? 'page' : undefined}
                            aria-label={item.name}
                          >
                            <motion.div 
                              className="flex items-center space-x-2"
                              whileHover={{ 
                                scale: 1.03,
                                transition: { duration: 0.2, ease: "easeOut" }
                              }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <motion.div
                                animate={item.current ? { 
                                  rotate: [0, 5, -5, 0],
                                  scale: [1, 1.1, 1]
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                                whileHover={{
                                  rotate: [0, 10, -10, 0],
                                  scale: 1.15,
                                  transition: { duration: 0.5 }
                                }}
                              >
                                <item.icon className="h-5 w-5" />
                              </motion.div>
                              
                              <motion.span
                                whileHover={{
                                  y: -1,
                                  transition: { duration: 0.2 }
                                }}
                              >
                                {item.name}
                              </motion.span>
                              
                              {item.badge && notifications > 0 && (
                                <motion.span 
                                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg border border-white/50"
                                  animate={{ 
                                    scale: [1, 1.2, 1],
                                    boxShadow: [
                                      '0 0 0px rgba(239,68,68,0)',
                                      '0 0 20px rgba(239,68,68,0.4)',
                                      '0 0 0px rgba(239,68,68,0)'
                                    ]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  whileHover={{
                                    scale: 1.3,
                                    rotate: [0, 5, -5, 0],
                                    transition: { duration: 0.3 }
                                  }}
                                  aria-label={`${notifications} unread`}
                                >
                                  {notifications}
                                </motion.span>
                              )}
                            </motion.div>
                            
                            {item.current && (
                              <motion.div 
                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-sage-500 to-beige-500 rounded-full"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ 
                                  width: 24, 
                                  opacity: 1,
                                  boxShadow: [
                                    '0 0 0px rgba(90, 138, 90, 0)',
                                    '0 0 8px rgba(90, 138, 90, 0.3)',
                                    '0 0 0px rgba(90, 138, 90, 0)'
                                  ]
                                }}
                                transition={{ 
                                  width: { duration: 0.3 },
                                  opacity: { duration: 0.3 },
                                  boxShadow: { duration: 2, repeat: Infinity }
                                }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      ))}
                      
                      {/* Enhanced Search Bar */}
                      
                      <motion.div 
                        className="relative ml-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                      >
                        <AnimatePresence>
                          {showSearch ? (
                            <motion.form
                              onSubmit={handleSearch}
                              className="flex items-center"
                              initial={{ width: 0, opacity: 0 }}
                              animate={{ width: 'auto', opacity: 1 }}
                              exit={{ width: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="relative">
                                <input
                                  type="text"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  placeholder="Search products, farms..."
                                  className="w-64 pl-10 pr-4 py-2 bg-white/90 border border-sage-200 rounded-lg text-sm placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent backdrop-blur-sm"
                                  autoFocus
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowSearch(false)}
                                className="ml-2 p-2 text-sage-500 hover:text-sage-700 transition-colors"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </motion.form>
                          ) : (
                            <motion.button
                              onClick={() => setShowSearch(true)}
                              className="p-2 text-sage-600 hover:text-sage-700 hover:bg-sage-50/70 rounded-lg transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <MagnifyingGlassIcon className="h-5 w-5" />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Enhanced Right Side Controls */}
                  <motion.div 
                    className="hidden lg:flex lg:items-center lg:space-x-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {/* Google Translate Widget handled globally in index.html */}
                    {/* Google Translate Selector Button (compact, does not affect navbar size) */}
                    <motion.button
                      className="px-2 py-2 rounded-lg text-gray-600 hover:text-sage-700 hover:bg-sage-50/70 transition-all duration-300 flex items-center space-x-1 h-10 min-w-0"
                      style={{ outline: 'none', boxShadow: 'none', border: 'none', height: '40px', minWidth: 0 }}
                      tabIndex="-1"
                      onClick={() => {
                        // Try to open Google Translate widget dropdown
                        const combo = document.querySelector('.goog-te-combo');
                        if (combo) {
                          combo.focus();
                          combo.click();
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </motion.button>
                    
                    {user && (
                      <>
                        {/* Quick Actions Dropdown */}
                        <Menu as="div" className="relative">
                          <Menu.Button className="p-2 text-gray-600 hover:text-sage-700 transition-colors duration-300 hover:bg-sage-50/70 rounded-lg no-focus-outline">
                            <SparklesIcon className="h-5 w-5" />
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-gray-200/50 border-0 no-focus-outline">
                              <div className="py-2">
                                <div className="px-4 py-2 border-b border-gray-100">
                                  <p className="text-sm font-semibold text-gray-700">Quick Actions</p>
                                </div>
                                {quickActions.map((action, index) => (
                                  <Menu.Item key={action.name}>
                                    {({ active }) => (
                                      <Link
                                        to={action.path}
                                        className={classNames(
                                          active ? 'bg-sage-50/70' : '',
                                          'flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-sage-700 transition-colors duration-300 mx-2 rounded-md no-focus-outline'
                                        )}
                                      >
                                        <action.icon className="mr-3 h-4 w-4" />
                                        {action.name}
                                      </Link>
                                    )}
                                  </Menu.Item>
                                ))}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>

                        {/* Notifications removed as per request */}
                      </>
                    )}

                    
                    {/* Enhanced Theme Toggle */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <EnhancedThemeToggle variant="compact" />
                    </motion.div>

                    {!user ? (
                      <motion.div 
                        className="flex items-center space-x-3 ml-3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                      >
                        <motion.button
                          onClick={() => openModal('login')}
                          className="relative px-5 py-2 text-gray-700 hover:text-sage-700 font-medium rounded-lg hover:bg-sage-50/70 transition-all duration-300 overflow-hidden"
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          whileHover={{ 
                            scale: 1.05, 
                            y: -2,
                            boxShadow: '0 4px 20px rgba(90, 138, 90, 0.15)',
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-sage-100/0 to-sage-100/50 opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="relative z-10">Sign In</span>
                        </motion.button>
                        
                        <motion.button
                          onClick={() => openModal('register')}
                          className="relative px-5 py-2 bg-gradient-to-r from-sage-600 to-sage-700 text-white font-medium rounded-lg hover:from-sage-700 hover:to-sage-800 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          whileHover={{ 
                            scale: 1.05, 
                            y: -2,
                            boxShadow: '0 8px 25px rgba(90, 138, 90, 0.3)',
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-sage-400/30 to-sage-500/30"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                          <span className="relative z-10">Sign Up</span>
                        </motion.button>
                      </motion.div>
                    ) : (
                      <Menu as="div" className="relative ml-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Menu.Button 
                            className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-sage-50/90 to-beige-50/90 px-3 py-2 text-sm font-medium text-gray-700 hover:from-sage-100/90 hover:to-beige-100/90 transition-all duration-300 shadow-sm border-0 no-focus-outline"
                            style={{ 
                              outline: 'none !important', 
                              boxShadow: 'none !important',
                              border: 'none !important'
                            }}
                            tabIndex="-1"
                            onFocus={(e) => {
                              e.target.style.outline = 'none';
                              e.target.style.boxShadow = 'none';
                              e.target.style.border = 'none';
                              e.target.blur();
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <div className="relative">
                              <div className="h-7 w-7 rounded-full bg-gradient-to-r from-sage-500 to-sage-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {user?.name?.charAt(0)?.toUpperCase()}
                              </div>
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-gray-800">{user?.name}</div>
                              <div className="text-xs text-sage-600 capitalize">{user?.role}</div>
                            </div>
                          </Menu.Button>
                        </motion.div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-150"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items 
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-gray-200/50 border-0 no-focus-outline"
                            style={{ 
                              outline: 'none !important', 
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important',
                              border: 'none !important'
                            }}
                          >
                            <div className="py-2">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    to="/profile"
                                    className={classNames(
                                      active ? 'bg-sage-50/70' : '',
                                      'flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-sage-700 transition-colors duration-300 mx-2 rounded-md no-focus-outline'
                                    )}
                                    style={{ 
                                      outline: 'none !important', 
                                      boxShadow: 'none !important',
                                      border: 'none !important'
                                    }}
                                    tabIndex="-1"
                                  >
                                    <UserCircleIcon className="mr-3 h-4 w-4" />
                                    Your Profile
                                  </Link>
                                )}
                              </Menu.Item>
                              
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    to="/settings"
                                    className={classNames(
                                      active ? 'bg-sage-50/70' : '',
                                      'flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-sage-700 transition-colors duration-300 mx-2 rounded-md no-focus-outline'
                                    )}
                                    style={{ 
                                      outline: 'none !important', 
                                      boxShadow: 'none !important',
                                      border: 'none !important'
                                    }}
                                    tabIndex="-1"
                                  >
                                    <Cog6ToothIcon className="mr-3 h-4 w-4" />
                                    Settings
                                  </Link>
                                )}
                              </Menu.Item>
                              
                              <div className="border-t border-gray-200/50 my-2"></div>
                              
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={handleLogout}
                                    className={classNames(
                                      active ? 'bg-red-50/70' : '',
                                      'flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:text-red-700 transition-colors duration-300 mx-2 rounded-md no-focus-outline'
                                    )}
                                    style={{ 
                                      outline: 'none !important', 
                                      boxShadow: 'none !important',
                                      border: 'none !important'
                                    }}
                                    tabIndex="-1"
                                  >
                                    <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                                    Sign out
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}
                  </motion.div>

                  {/* Mobile menu button */}
                  <motion.div 
                    className="lg:hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Disclosure.Button 
                      className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:text-sage-700 hover:bg-sage-50/70 transition-all duration-300 no-focus-outline"
                      style={{ 
                        outline: 'none !important', 
                        boxShadow: 'none !important',
                        border: 'none !important'
                      }}
                      tabIndex="-1"
                      onFocus={(e) => {
                        e.target.style.outline = 'none';
                        e.target.style.boxShadow = 'none';
                        e.target.style.border = 'none';
                        e.target.blur();
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" />
                      )}
                    </Disclosure.Button>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Mobile menu */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="lg:hidden overflow-hidden"
                  >
                    <Disclosure.Panel className="border-t border-gray-200/50 bg-white/98 backdrop-blur-sm">
                      <div className="px-4 py-4 space-y-4">
                        {/* Mobile Search Bar */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="relative"
                        >
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search everything..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/80 focus:bg-white transition-all duration-300 no-focus-outline"
                            style={{ 
                              outline: 'none !important', 
                              boxShadow: 'none !important',
                              border: '1px solid #e5e7eb !important'
                            }}
                            tabIndex="-1"
                            onFocus={(e) => {
                              e.target.style.outline = 'none';
                              e.target.style.boxShadow = 'none';
                              e.target.style.border = '1px solid #e5e7eb';
                            }}
                          />
                        </motion.div>

                        {/* Mobile Navigation Links */}
                        <div className="space-y-2">
                          {navigation.map((item, index) => (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                            >
                              <Disclosure.Button
                                as={Link}
                                to={item.href}
                                className={classNames(
                                  item.current
                                    ? 'bg-gradient-to-r from-sage-50/90 to-beige-50/90 text-sage-700 shadow-sm border-l-4 border-sage-600'
                                    : 'text-gray-700 hover:text-sage-700 hover:bg-sage-50/70',
                                  'group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 no-focus-outline'
                                )}
                                style={{ 
                                  outline: 'none !important', 
                                  boxShadow: 'none !important',
                                  border: item.current ? '2px solid transparent' : 'none !important'
                                }}
                                tabIndex="-1"
                              >
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <item.icon className="mr-3 h-6 w-6" />
                                </motion.div>
                                {item.name}
                                {item.badge && notifications > 0 && (
                                  <motion.span 
                                    className="ml-auto bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-lg"
                                    animate={{ 
                                      scale: [1, 1.1, 1],
                                      boxShadow: [
                                        '0 0 0px rgba(239,68,68,0)',
                                        '0 0 8px rgba(239,68,68,0.4)',
                                        '0 0 0px rgba(239,68,68,0)'
                                      ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    {notifications}
                                  </motion.span>
                                )}
                                {item.current && (
                                  <motion.div
                                    className="ml-auto w-2 h-2 bg-sage-600 rounded-full"
                                    layoutId="mobile-indicator"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                  />
                                )}
                              </Disclosure.Button>
                            </motion.div>
                          ))}
                        </div>

                        {/* Mobile Google Translate Widget */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                          className="border-t border-gray-100 pt-4 pb-4"
                        >
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                            Language
                          </p>
                          <div className="px-2">
                            <GoogleTranslateWidget />
                          </div>
                        </motion.div>

                        {user && (
                          <>
                            {/* Mobile Quick Actions */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.5 }}
                              className="border-t border-gray-100 pt-4"
                            >
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                                Quick Actions
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {quickActions.slice(0, 4).map((action, index) => (
                                  <Disclosure.Button
                                    key={action.name}
                                    as={Link}
                                    to={action.path}
                                    className="flex items-center p-3 text-sm text-gray-600 hover:text-sage-700 hover:bg-sage-50/70 rounded-lg transition-all duration-300 no-focus-outline"
                                  >
                                    <action.icon className="mr-2 h-4 w-4" />
                                    <span className="truncate">{action.name}</span>
                                  </Disclosure.Button>
                                ))}
                              </div>
                            </motion.div>

                            {/* Mobile User Profile */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.6 }}
                              className="border-t border-gray-100 pt-4"
                            >
                              <div className="flex items-center space-x-3 p-3 bg-gray-50/70 rounded-lg">
                                <img
                                  className="h-10 w-10 rounded-full object-cover ring-2 ring-sage-200"
                                  src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}
                                  alt={user.name}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <EnhancedThemeToggle variant="compact" />
                                  <EnhancedLanguageSelector variant="compact" />
                                </div>
                              </div>
                              
                              <div className="mt-3 space-y-1">
                                <Disclosure.Button
                                  as={Link}
                                  to="/profile"
                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-sage-700 hover:bg-sage-50/70 rounded-lg transition-all duration-300 no-focus-outline"
                                >
                                  <UserCircleIcon className="mr-3 h-4 w-4" />
                                  View Profile
                                </Disclosure.Button>
                                
                                <button
                                  onClick={() => handleLogout()}
                                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/70 rounded-lg transition-all duration-300 no-focus-outline"
                                  style={{ 
                                    outline: 'none !important', 
                                    boxShadow: 'none !important',
                                    border: 'none !important'
                                  }}
                                  tabIndex="-1"
                                >
                                  <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                                  Sign Out
                                </button>
                              </div>
                            </motion.div>
                          </>
                        )}
                        
                        {!user && (
                          <motion.div
                            className="border-t border-gray-100 pt-4 space-y-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            <button
                              onClick={() => openModal('login')}
                              className="w-full flex items-center justify-center px-4 py-3 text-base font-medium text-gray-700 hover:text-sage-700 hover:bg-sage-50/70 rounded-xl transition-all duration-300 no-focus-outline border border-gray-200"
                              style={{ 
                                outline: 'none !important', 
                                boxShadow: 'none !important'
                              }}
                              tabIndex="-1"
                            >
                              <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                              Sign In
                            </button>
                            <button
                              onClick={() => openModal('register')}
                              className="w-full flex items-center justify-center px-4 py-3 text-base font-medium bg-gradient-to-r from-sage-600 to-sage-700 text-white rounded-xl hover:from-sage-700 hover:to-sage-800 transition-all duration-300 no-focus-outline shadow-lg"
                              style={{ 
                                outline: 'none !important', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15) !important'
                              }}
                              tabIndex="-1"
                            >
                              <UserPlusIcon className="mr-2 h-5 w-5" />
                              Sign Up Free
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </Disclosure.Panel>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </Disclosure>
        {/* FocusKiller removed for troubleshooting input issues */}
        <AnimatePresence>
          {showAuthModal && (
            <AuthModal
              isOpen={showAuthModal}
              onClose={handleCloseModal}
              mode={authMode}
            />
          )}
        </AnimatePresence>
      </motion.div>
  );
}

export default EnhancedNavbar;
