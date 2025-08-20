import { Routes, Route } from 'react-router-dom';
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

import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-grow w-full pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Admin Routes */}
          
          <Route path="/admin/verifications" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/farms" element={<AdminRoute><AdminFarms /></AdminRoute>} />
          
          {/* Farmer Routes */}
          <Route path="/farm-dashboard" element={<FarmerRoute><FarmDashboard /></FarmerRoute>} />
          <Route path="/farm-profile" element={<FarmerRoute><FarmProfile /></FarmerRoute>} />
          
          {/* User Routes */}
          <Route path="/marketplace" element={<UserRoute><Marketplace /></UserRoute>} />
          <Route path="/farms" element={<UserRoute><Farms /></UserRoute>} />
          <Route path="/purchase/:farmId/:productId" element={<UserRoute><PurchaseProduce /></UserRoute>} />
          <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
          <Route path="/favorites" element={<UserRoute><Favorites /></UserRoute>} />
          <Route path="/orders" element={<UserRoute><OrderHistory /></UserRoute>} />
          <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
          
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
