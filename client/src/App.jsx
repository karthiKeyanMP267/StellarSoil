import { Routes, Route, useLocation } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import EnhancedFarms from './pages/EnhancedFarms';
import FarmDashboard from './pages/FarmDashboard';
import FarmCertificateManager from './components/FarmCertificateManager';
import FarmProfile from './pages/FarmProfile';
import FarmerAnalytics from './pages/FarmerAnalytics';
import FarmerCustomers from './pages/FarmerCustomers';
import FarmerDeliveries from './pages/FarmerDeliveries';
import ErrorBoundary from './components/ErrorBoundary';

import AdminPanel from './components/AdminPanel';

import AdminRoute from './components/AdminRoute';
import FarmerRoute from './components/FarmerRoute';
import UserRoute from './components/UserRoute';
import HomeRedirect from './components/HomeRedirect';
import FarmerProfileGuard from './components/FarmerProfileGuard';
import PurchaseProduce from './pages/PurchaseProduce';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import OrderHistory from './pages/OrderHistory';
import Checkout from './pages/Checkout';
import OrderDetails from './pages/OrderDetails';
import AdminUsers from './pages/AdminUsers';

// Import focus prevention hooks
import { useFocusPrevention, useActiveElementBlur } from './hooks/useFocusPrevention';
import AdminFarms from './pages/AdminFarms';
import EnhancedLandingPage from './pages/EnhancedLandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import UserProfile from './pages/UserProfile';
// Lazy loaded feature pages
const AdvancedFeaturesShowcase = lazy(() => import('./pages/AdvancedFeaturesShowcase'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));

// Enhanced Components
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './components/FAQ';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Import NotificationProvider and i18n
import { NotificationProvider } from './components/ui/Notification';
import { ThemeProvider } from './context/ThemeContext';
// Lazy heavy / rarely interacted components
const AIChatbotAssistant = lazy(() => import('./components/AIChatbotAssistant'));
const SmartNotificationSystem = lazy(() => import('./components/SmartNotificationSystem'));
import './i18n/i18n';

// Import Focus Test Component (for testing only)
// import FocusTestComponent from './components/FocusTestComponent';

const App = () => {
  const location = useLocation();
  
  // Apply global focus prevention
  // useFocusPrevention(true);
  // useActiveElementBlur();
  
  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-beige-400 to-cream-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-sage-400 to-earth-400 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cream-300 to-beige-300 rounded-full blur-3xl"></div>
          </div>
        
          <div className="relative z-10">
            <Navbar />
            <Suspense fallback={null}>
              <SmartNotificationSystem />
            </Suspense>
            <ErrorBoundary>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="pt-20 min-h-screen"
                >
                  <Suspense fallback={<div className="pt-24 text-center text-sage-600 animate-pulse">Loading...</div>}>
                  <Routes location={location}>
                    {/* Public Routes */}
                    <Route path="/" element={<EnhancedLandingPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/features" element={<AdvancedFeaturesShowcase />} />
                    <Route path="/feature-list" element={<FeaturesPage />} />
                  
                    {/* Legacy Routes for compatibility */}
                    <Route path="/about-old" element={<AboutPage />} />
                    <Route path="/contact-old" element={<ContactPage />} />
                    
                    {/* User Dashboard (authenticated users only) */}
                    <Route path="/dashboard" element={<UserRoute><Home /></UserRoute>} />
                    <Route path="/profile" element={<UserRoute><UserProfile /></UserRoute>} />
                    <Route path="/settings" element={<UserRoute><Settings /></UserRoute>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                    <Route path="/admin/farms" element={<AdminRoute><AdminFarms /></AdminRoute>} />
                    <Route path="/admin/verifications" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                    
                    {/* Farmer Routes - Wrapped with FarmerProfileGuard to ensure profile completion */}
                    <Route path="/farmer" element={<FarmerRoute><FarmerProfileGuard><FarmDashboard /></FarmerProfileGuard></FarmerRoute>} />
                    <Route path="/farmer/certificates" element={<FarmerRoute><FarmerProfileGuard><FarmCertificateManager /></FarmerProfileGuard></FarmerRoute>} />
                    <Route path="/farmer/certificates/:farmId" element={<FarmerRoute><FarmerProfileGuard><FarmCertificateManager /></FarmerProfileGuard></FarmerRoute>} />
                    <Route path="/farmer/profile" element={<FarmerRoute><FarmerProfileGuard><FarmProfile /></FarmerProfileGuard></FarmerRoute>} />
                    <Route path="/farmer/analytics" element={<FarmerRoute><FarmerProfileGuard><FarmerAnalytics /></FarmerProfileGuard></FarmerRoute>} />
                    <Route path="/farmer/customers" element={<FarmerRoute><FarmerProfileGuard><FarmerCustomers /></FarmerProfileGuard></FarmerRoute>} />
                    <Route path="/farmer/deliveries" element={<FarmerRoute><FarmerProfileGuard><FarmerDeliveries /></FarmerProfileGuard></FarmerRoute>} />
                    
                    {/* User Shopping Routes */}
                    <Route path="/farms" element={<EnhancedFarms />} />
                    <Route path="/purchase/:farmId/:productId" element={<UserRoute><PurchaseProduce /></UserRoute>} />
                    <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
                    <Route path="/favorites" element={<UserRoute><Favorites /></UserRoute>} />
                    <Route path="/orders" element={<UserRoute><OrderHistory /></UserRoute>} />
                    <Route path="/orders/:id" element={<UserRoute><OrderDetails /></UserRoute>} />
                    <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
            
            {/* AI Chatbot Assistant - Global */}
            <Suspense fallback={null}>
              <AIChatbotAssistant />
            </Suspense>
            
            {/* Focus Test Component - Testing Only */}
            {/* <FocusTestComponent /> */}
          </div>
        </div>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;