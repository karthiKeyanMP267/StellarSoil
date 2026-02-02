# 📁 StellarSoil - Reorganized Folder Structure

## Overview
The project has been reorganized into a **feature-based architecture** following industry best practices for scalable applications.

---

## 🎨 CLIENT SIDE STRUCTURE

```
client/src/
├── features/                          # Feature-based modules
│   ├── auth/                          # Authentication & Authorization
│   │   ├── components/                # Auth-specific components
│   │   │   ├── EnhancedAuthModal.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   └── hooks/
│   │
│   ├── marketplace/                   # Product Browsing & Discovery
│   │   ├── components/
│   │   │   ├── LiveMarketPriceWidget.jsx
│   │   │   ├── LiveStockPredictionWidget.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Marketplace.jsx
│   │   │   ├── ProductDiscovery.jsx
│   │   │   ├── FarmDiscovery.jsx
│   │   │   ├── PurchaseProduce.jsx
│   │   │   └── ...
│   │   └── hooks/
│   │
│   ├── cart/                          # Shopping Cart & Checkout
│   │   ├── components/
│   │   │   ├── PaymentForm.jsx
│   │   │   ├── PaymentGateway.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Favorites.jsx
│   │   │   └── ...
│   │   └── hooks/
│   │
│   ├── orders/                        # Order Management (Customer)
│   │   ├── components/
│   │   │   ├── OrderSummary.jsx
│   │   │   ├── OrderTracker.jsx
│   │   │   ├── DeliveryForm.jsx
│   │   │   ├── DeliveryMap.jsx
│   │   │   ├── DeliveryUpdates.jsx
│   │   │   ├── AddressDisplay.jsx
│   │   │   ├── AddressForm.jsx
│   │   │   ├── OrderAddressEdit.jsx
│   │   │   ├── RealTimeDeliveryTracking.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── UserOrderTracking.jsx
│   │   │   └── ...
│   │   └── hooks/
│   │
│   ├── farmer/                        # Farmer Dashboard & Management
│   │   ├── components/
│   │   │   ├── FarmerOrderManagement.jsx
│   │   │   ├── FarmerOrderNotification.jsx
│   │   │   ├── FarmerProfileGuard.jsx
│   │   │   ├── FarmerRoute.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── FarmDashboard.jsx
│   │   │   ├── FarmerAnalytics.jsx
│   │   │   ├── FarmerCustomers.jsx
│   │   │   ├── FarmerDeliveries.jsx
│   │   │   ├── FarmerOrderTracking.jsx
│   │   │   └── ...
│   │   └── hooks/
│   │
│   ├── farm/                          # Farm Profiles & Certificates
│   │   ├── components/
│   │   │   ├── FarmCertificateManager.jsx
│   │   │   ├── FarmCertificates.jsx
│   │   │   ├── CertificateCard.jsx
│   │   │   ├── CertificateUploader.jsx
│   │   │   ├── FarmMap.jsx
│   │   │   ├── FarmProfileModal.jsx
│   │   │   ├── FarmsMap.jsx
│   │   │   ├── MandatoryFarmProfile.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── EnhancedFarms.jsx
│   │   │   ├── FarmProfile.jsx
│   │   │   └── ...
│   │   └── hooks/
│   │
│   ├── admin/                         # Admin Panel & Management
│   │   ├── components/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── AdminFarms.jsx
│   │   │   └── ...
│   │   └── hooks/
│   │
│   └── user/                          # User Profile & Settings
│       ├── components/
│       ├── pages/
│       │   ├── UserProfile.jsx
│       │   ├── Settings.jsx
│       │   └── ...
│       └── hooks/
│
├── shared/                            # Shared Across Features
│   ├── components/
│   │   ├── ui/                        # Reusable UI Components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Form.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Notification.jsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                    # Layout Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── EnhancedNavbar.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── EnhancedThemeToggle.jsx
│   │   │   ├── LanguageSelector.jsx
│   │   │   ├── EnhancedLanguageSelector.jsx
│   │   │   ├── DirectLanguageSelector.jsx
│   │   │   ├── EmergencyLanguageReset.jsx
│   │   │   ├── GoogleTranslateWidget.jsx
│   │   │   ├── CommunityHub.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── ReviewSystem.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ...
│   │   │
│   │   ├── maps/                      # Map Components
│   │   │   ├── LocationMap.jsx
│   │   │   ├── LiveLocationPicker.jsx
│   │   │   ├── OrderMap.jsx
│   │   │   ├── StaticMapView.jsx
│   │   │   └── ...
│   │   │
│   │   ├── forms/                     # Form Components
│   │   │   ├── EnhancedInput.jsx
│   │   │   ├── EnhancedButton.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ModalFooter.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── ImageGallery.jsx
│   │   │   └── ...
│   │   │
│   │   └── guards/                    # Route Protection
│   │       ├── PrivateRoute.jsx
│   │       ├── UserRoute.jsx
│   │       ├── FarmerRoute.jsx
│   │       ├── AdminRoute.jsx
│   │       ├── FarmerProfileGuard.jsx
│   │       ├── HomeRedirect.jsx
│   │       └── ...
│   │
│   ├── hooks/                         # Custom React Hooks
│   │   ├── useFocusPrevention.js
│   │   └── ...
│   │
│   ├── utils/                         # Utility Functions
│   │   └── ...
│   │
│   ├── services/                      # API Services
│   │   └── ...
│   │
│   └── context/                       # React Context Providers
│       ├── AuthContext.jsx
│       ├── ThemeContext.jsx
│       └── ...
│
├── core/                              # Core App Functionality
│   ├── config/                        # App Configuration
│   │
│   ├── constants/                     # App Constants
│   │
│   ├── i18n/                          # Internationalization
│   │   ├── i18n.js
│   │   └── locales/
│   │
│   └── theme/                         # Theme Configuration
│       ├── theme.js
│       └── ...
│
├── pages/                             # Landing & Public Pages
│   └── public/
│       ├── EnhancedLandingPage.jsx
│       ├── Home.jsx
│       ├── About.jsx
│       ├── AboutPage.jsx
│       ├── Contact.jsx
│       ├── ContactPage.jsx
│       ├── PrivacyPolicyPage.jsx
│       ├── NotFound.jsx
│       └── ...
│
├── api/                               # API Configuration
├── assets/                            # Static Assets
├── styles/                            # Global Styles
├── test/                              # Test Files
├── App.jsx                            # Main App Component
├── main.jsx                           # App Entry Point
└── index.css                          # Global CSS
```

---

## 🚀 SERVER SIDE STRUCTURE

```
server/
├── features/                          # Feature-based Modules
│   ├── auth/                          # Authentication
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   ├── auth.service.js
│   │   ├── user.model.js
│   │   └── auth.validator.js
│   │
│   ├── products/                      # Product Management
│   │   ├── product.controller.js
│   │   ├── product.routes.js
│   │   ├── product.service.js
│   │   ├── product.model.js
│   │   └── product.validator.js
│   │
│   ├── farms/                         # Farm Management
│   │   ├── farm.controller.js
│   │   ├── farm.routes.js
│   │   ├── farm.service.js
│   │   ├── farm.model.js
│   │   ├── farmManagement.controller.js
│   │   └── farm.validator.js
│   │
│   ├── orders/                        # Order Management
│   │   ├── order.controller.js
│   │   ├── order.routes.js
│   │   ├── order.service.js
│   │   ├── order.model.js
│   │   └── order.validator.js
│   │
│   ├── cart/                          # Shopping Cart
│   │   ├── cart.controller.js
│   │   ├── cart.routes.js
│   │   ├── cart.service.js
│   │   ├── cart.model.js
│   │   └── cart.validator.js
│   │
│   ├── certificates/                  # Certificate Management
│   │   ├── certificate.controller.js
│   │   ├── certificate.routes.js
│   │   ├── certificate.service.js
│   │   └── certificate.validator.js
│   │
│   ├── payments/                      # Payment Processing
│   │   ├── payment.controller.js
│   │   ├── payment.routes.js
│   │   ├── payment.service.js
│   │   └── payment.validator.js
│   │
│   ├── analytics/                     # Analytics & Insights
│   │   ├── analytics.controller.js
│   │   ├── analytics.routes.js
│   │   ├── analytics.service.js
│   │   └── analytics.validator.js
│   │
│   ├── notifications/                 # Notification System
│   │   ├── notification.controller.js
│   │   ├── notification.routes.js
│   │   ├── notification.service.js
│   │   ├── notification.model.js
│   │   └── notification.validator.js
│   │
│   ├── favorites/                     # Favorites/Wishlist
│   │   ├── favorites.controller.js
│   │   ├── favorites.routes.js
│   │   ├── favorites.service.js
│   │   └── favorites.validator.js
│   │
│   └── admin/                         # Admin Operations
│       ├── admin.controller.js
│       ├── admin.routes.js
│       ├── admin.service.js
│       └── admin.validator.js
│
├── shared/                            # Shared Resources
│   ├── middleware/                    # Express Middleware
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── utils/                         # Utility Functions
│   │   └── ...
│   │
│   ├── services/                      # Cross-feature Services
│   │   ├── emailService.js
│   │   ├── notificationService.js
│   │   ├── firebaseAdmin.js
│   │   ├── languageService.js
│   │   ├── regionUtil.js
│   │   └── ...
│   │
│   ├── validators/                    # Shared Validators
│   │   └── ...
│   │
│   └── config/                        # Shared Configuration
│       ├── certificateUpload.js
│       ├── multer.js
│       └── security.js
│
├── core/                              # Core Server Functionality
│   ├── database/                      # Database Configuration
│   │   └── db.js
│   │
│   └── server.js                      # Server Setup (optional)
│
├── ml_service/                        # ML Microservice
│   ├── crop_recommendation.py
│   ├── price_prediction.py
│   ├── stock_prediction.py
│   └── requirements.txt
│
├── certificates/                      # Certificate Storage
├── uploads/                           # File Uploads
├── data/                              # Static Data Files
├── scripts/                           # Utility Scripts
├── test/                              # Test Files
├── index.js                           # Server Entry Point
├── package.json
└── .env
```

---

## 📋 Key Benefits of This Structure

### 1. **Feature-Based Organization**
- Each feature is self-contained with its own components, pages, and hooks
- Easy to locate and modify feature-specific code
- Better code ownership and team collaboration

### 2. **Clear Separation of Concerns**
- **Features**: Domain-specific business logic
- **Shared**: Reusable components across features
- **Core**: App-wide configuration and setup

### 3. **Scalability**
- Easy to add new features without cluttering existing structure
- Clear boundaries between features
- Independent feature development

### 4. **Maintainability**
- Reduced cognitive load - developers know exactly where to find code
- Easier onboarding for new team members
- Consistent naming conventions

### 5. **Testing**
- Feature-isolated testing
- Easier to mock dependencies
- Better test organization

---

## 🔄 Migration Notes

### Import Path Changes

**Old Structure:**
```javascript
import Navbar from '../components/Navbar';
import Cart from '../pages/Cart';
```

**New Structure:**
```javascript
import Navbar from '../shared/components/layout/Navbar';
import Cart from '../features/cart/pages/Cart';
```

### Server-Side Imports

**Old Structure:**
```javascript
const orderController = require('./controllers/orderController');
const authMiddleware = require('./middleware/authMiddleware');
```

**New Structure:**
```javascript
const orderController = require('./features/orders/order.controller');
const authMiddleware = require('./shared/middleware/authMiddleware');
```

---

## 🛠️ Next Steps

1. **Update Import Paths**: Systematically update all import statements
2. **Update Route Configurations**: Update App.jsx and server routes
3. **Test Features**: Verify each feature works after reorganization
4. **Update Documentation**: Update README and component documentation
5. **Remove Old Folders**: Clean up legacy folders once migration is complete

---

## 📚 Feature Module Structure

Each feature module follows this pattern:

```
feature-name/
├── components/          # Feature-specific components
├── pages/               # Feature-specific pages/screens
├── hooks/               # Feature-specific custom hooks
├── [feature].controller.js    # Server: Request handling
├── [feature].routes.js        # Server: API routes
├── [feature].service.js       # Server: Business logic
├── [feature].model.js         # Server: Data model
└── [feature].validator.js     # Server: Input validation
```

---

## 🎯 Component Classification Guide

### Features (Domain-Specific)
- Auth, Marketplace, Cart, Orders, Farmer, Farm, Admin, User
- Contains business logic specific to that domain

### Shared (Reusable)
- UI components (buttons, cards, inputs)
- Layout components (navbar, footer, modals)
- Maps, Forms, Guards
- Can be used across multiple features

### Core (App Configuration)
- i18n, Theme, Constants, Config
- App-wide setup and configuration

---

**Last Updated**: February 3, 2026
