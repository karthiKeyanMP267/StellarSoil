import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Farms from './pages/Farms';
import FarmDashboard from './pages/FarmDashboard';
import FarmProfile from './pages/FarmProfile';

import AdminPanel from './components/AdminPanel';

import AdminRoute from './components/AdminRoute';
import FarmerRoute from './components/FarmerRoute';
import UserRoute from './components/UserRoute';
import HomeRedirect from './components/HomeRedirect';
import PurchaseProduce from './pages/PurchaseProduce';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import OrderHistory from './pages/OrderHistory';
import Checkout from './pages/Checkout';
import AdminUsers from './pages/AdminUsers';
import AdminFarms from './pages/AdminFarms';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import UserProfile from './pages/UserProfile';

// Enhanced Components
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './components/FAQ';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        
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
        
        {/* Farmer Routes */}
        <Route path="/farmer" element={<FarmerRoute><FarmDashboard /></FarmerRoute>} />
        <Route path="/farmer/profile" element={<FarmerRoute><FarmProfile /></FarmerRoute>} />
        
        {/* User Shopping Routes */}
        <Route path="/farms" element={<UserRoute><Farms /></UserRoute>} />
        <Route path="/purchase/:farmId/:productId" element={<UserRoute><PurchaseProduce /></UserRoute>} />
        <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
        <Route path="/favorites" element={<UserRoute><Favorites /></UserRoute>} />
        <Route path="/orders" element={<UserRoute><OrderHistory /></UserRoute>} />
        <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
