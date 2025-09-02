import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        about: 'About',
        marketplace: 'Marketplace',
        farms: 'Farms',
        dashboard: 'Dashboard',
        profile: 'Profile',
        cart: 'Cart',
        favorites: 'Favorites',
        orders: 'Orders',
        admin: 'Admin',
        login: 'Login',
        signup: 'Sign Up',
        logout: 'Logout',
        contact: 'Contact',
        faq: 'FAQ',
        settings: 'Settings'
      },
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        submit: 'Submit',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
        open: 'Open',
        yes: 'Yes',
        no: 'No',
        confirm: 'Confirm',
        welcome: 'Welcome',
        getStarted: 'Get Started',
        learnMore: 'Learn More',
        backToHome: 'Back to Home'
      },
      // Landing Page
      landing: {
        hero: {
          title: 'Cultivating Sustainable Agriculture',
          subtitle: 'Connect farmers with buyers, promote organic farming, and build a sustainable food ecosystem',
          cta: 'Start Your Journey',
          watchVideo: 'Watch Demo'
        },
        features: {
          title: 'Why Choose StellarSoil?',
          organic: {
            title: 'Certified Organic',
            description: 'Premium organic produce directly from verified farms'
          },
          direct: {
            title: 'Direct from Farm',
            description: 'No middlemen, better prices for farmers and consumers'
          },
          sustainable: {
            title: 'Sustainable Practices',
            description: 'Supporting eco-friendly farming methods'
          },
          fresh: {
            title: 'Farm Fresh Quality',
            description: 'Harvest to doorstep in record time'
          }
        },
        stats: {
          farmers: 'Active Farmers',
          products: 'Fresh Products',
          customers: 'Happy Customers',
          cities: 'Cities Served'
        }
      },
      // Auth
      auth: {
        login: {
          title: 'Welcome Back',
          subtitle: 'Sign in to your account',
          email: 'Email Address',
          password: 'Password',
          remember: 'Remember me',
          forgot: 'Forgot password?',
          submit: 'Sign In',
          noAccount: "Don't have an account?",
          signup: 'Sign up'
        },
        signup: {
          title: 'Create Account',
          subtitle: 'Join our farming community',
          name: 'Full Name',
          email: 'Email Address',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          role: 'I am a',
          roles: {
            user: 'Buyer',
            farmer: 'Farmer',
            admin: 'Administrator'
          },
          terms: 'I agree to the Terms and Conditions',
          submit: 'Create Account',
          hasAccount: 'Already have an account?',
          login: 'Sign in'
        }
      },
      // Dashboard
      dashboard: {
        welcome: 'Welcome back, {{name}}!',
        overview: 'Overview',
        recentOrders: 'Recent Orders',
        favoriteProducts: 'Favorite Products',
        recommendations: 'Recommended for You',
        quickActions: 'Quick Actions',
        viewAll: 'View All'
      },
      // Products
      products: {
        title: 'Fresh Products',
        category: 'Category',
        price: 'Price',
        rating: 'Rating',
        addToCart: 'Add to Cart',
        addToFavorites: 'Add to Favorites',
        outOfStock: 'Out of Stock',
        inStock: 'In Stock',
        organic: 'Organic',
        fresh: 'Fresh',
        description: 'Description',
        reviews: 'Reviews',
        seller: 'Seller',
        farmLocation: 'Farm Location'
      },
      // Cart
      cart: {
        title: 'Shopping Cart',
        empty: 'Your cart is empty',
        item: 'Item',
        quantity: 'Quantity',
        price: 'Price',
        total: 'Total',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        tax: 'Tax',
        checkout: 'Proceed to Checkout',
        continueShopping: 'Continue Shopping',
        remove: 'Remove',
        update: 'Update'
      },
      // Farmer
      farmer: {
        dashboard: 'Farmer Dashboard',
        products: 'My Products',
        orders: 'Orders',
        analytics: 'Analytics',
        profile: 'Farm Profile',
        addProduct: 'Add Product',
        manageInventory: 'Manage Inventory',
        sales: 'Sales Report',
        customers: 'Customers'
      },
      // Footer
      footer: {
        about: 'About StellarSoil',
        description: 'Connecting farmers and consumers for a sustainable future.',
        quickLinks: 'Quick Links',
        support: 'Support',
        legal: 'Legal',
        newsletter: 'Newsletter',
        newsletterText: 'Subscribe to get updates on fresh products and offers',
        subscribe: 'Subscribe',
        copyright: '© 2024 StellarSoil. All rights reserved.',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        cookies: 'Cookie Policy'
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        about: 'Acerca de',
        marketplace: 'Mercado',
        farms: 'Granjas',
        dashboard: 'Panel',
        profile: 'Perfil',
        cart: 'Carrito',
        favorites: 'Favoritos',
        orders: 'Pedidos',
        admin: 'Administrador',
        login: 'Iniciar Sesión',
        signup: 'Registrarse',
        logout: 'Cerrar Sesión',
        contact: 'Contacto',
        faq: 'Preguntas',
        settings: 'Configuración'
      },
      common: {
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        view: 'Ver',
        submit: 'Enviar',
        search: 'Buscar',
        filter: 'Filtrar',
        sort: 'Ordenar',
        next: 'Siguiente',
        previous: 'Anterior',
        close: 'Cerrar',
        open: 'Abrir',
        yes: 'Sí',
        no: 'No',
        confirm: 'Confirmar',
        welcome: 'Bienvenido',
        getStarted: 'Comenzar',
        learnMore: 'Saber Más',
        backToHome: 'Volver al Inicio'
      },
      landing: {
        hero: {
          title: 'Cultivando Agricultura Sostenible',
          subtitle: 'Conecta agricultores con compradores, promueve la agricultura orgánica y construye un ecosistema alimentario sostenible',
          cta: 'Comienza Tu Viaje',
          watchVideo: 'Ver Demo'
        },
        features: {
          title: '¿Por qué Elegir StellarSoil?',
          organic: {
            title: 'Orgánico Certificado',
            description: 'Productos orgánicos premium directamente de granjas verificadas'
          },
          direct: {
            title: 'Directo de la Granja',
            description: 'Sin intermediarios, mejores precios para agricultores y consumidores'
          },
          sustainable: {
            title: 'Prácticas Sostenibles',
            description: 'Apoyando métodos de agricultura ecológica'
          },
          fresh: {
            title: 'Calidad Fresca de Granja',
            description: 'De la cosecha a tu puerta en tiempo récord'
          }
        }
      },
      auth: {
        login: {
          title: 'Bienvenido de Vuelta',
          subtitle: 'Inicia sesión en tu cuenta',
          email: 'Correo Electrónico',
          password: 'Contraseña',
          remember: 'Recordarme',
          forgot: '¿Olvidaste tu contraseña?',
          submit: 'Iniciar Sesión',
          noAccount: '¿No tienes una cuenta?',
          signup: 'Regístrate'
        }
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: 'होम',
        about: 'हमारे बारे में',
        marketplace: 'बाज़ार',
        farms: 'खेत',
        dashboard: 'डैशबोर्ड',
        profile: 'प्रोफ़ाइल',
        cart: 'कार्ट',
        favorites: 'पसंदीदा',
        orders: 'ऑर्डर',
        admin: 'एडमिन',
        login: 'लॉगिन',
        signup: 'साइन अप',
        logout: 'लॉगआउट',
        contact: 'संपर्क',
        faq: 'सवाल-जवाब',
        settings: 'सेटिंग्स'
      },
      common: {
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        success: 'सफलता',
        save: 'सेव करें',
        cancel: 'रद्द करें',
        delete: 'डिलीट करें',
        edit: 'संपादित करें',
        view: 'देखें',
        submit: 'जमा करें',
        search: 'खोजें',
        filter: 'फिल्टर',
        sort: 'सॉर्ट',
        next: 'अगला',
        previous: 'पिछला',
        close: 'बंद करें',
        open: 'खोलें',
        yes: 'हाँ',
        no: 'नहीं',
        confirm: 'पुष्टि करें',
        welcome: 'स्वागत है',
        getStarted: 'शुरू करें',
        learnMore: 'और जानें',
        backToHome: 'होम पर वापस'
      },
      landing: {
        hero: {
          title: 'टिकाऊ कृषि का विकास',
          subtitle: 'किसानों को खरीदारों से जोड़ें, जैविक खेती को बढ़ावा दें, और एक टिकाऊ खाद्य पारिस्थितिकी तंत्र बनाएं',
          cta: 'अपनी यात्रा शुरू करें',
          watchVideo: 'डेमो देखें'
        }
      }
    }
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

export default i18n;
