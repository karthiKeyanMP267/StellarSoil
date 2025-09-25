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
        loadingData: 'Loading data...',
        loadingMetrics: 'Loading metrics…',
        loadingSustainability: 'Loading sustainability metrics…',
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
  errorLoading: 'Error loading products',
  errorSearching: 'Error searching products',
  errorLoading: 'பொருட்களை ஏற்றுவதில் பிழை',
  errorSearching: 'பொருட்களை தேடுவதில் பிழை',
        title: 'Farm Fresh Marketplace',
        subtitle: 'Discover premium organic produce directly from sustainable farms',
        category: 'Category',
        price: 'Price',
        rating: 'Rating',
        addToCart: 'Add to Cart',
        addToFavorites: 'Add to Favorites',
        addedToFavorites: 'Added to favorites',
        removedFromFavorites: 'Removed from favorites',
        outOfStock: 'Out of Stock',
        inStock: 'In Stock',
        organic: 'Organic',
        fresh: 'Fresh',
        description: 'Description',
        reviews: 'Reviews',
        seller: 'Seller',
        farmLocation: 'Farm Location',
        allCategories: 'All Categories',
        vegetables: 'Vegetables',
        fruits: 'Fruits',
        grains: 'Grains',
        herbs: 'Herbs',
        dairy: 'Dairy',
        meat: 'Meat',
        featured: 'Featured',
        priceLowToHigh: 'Price: Low to High',
        priceHighToLow: 'Price: High to Low',
        nameAZ: 'Name A-Z',
        highestRated: 'Highest Rated',
        minPrice: 'Min Price',
        maxPrice: 'Max Price',
        searchProducts: 'Search Products',
        freshProducts: 'Fresh Products',
        fastDelivery: 'Fast Delivery',
        quickAdd: 'Quick Add',
        unit: 'kg',
        inCart: 'In Cart',
        farm: 'Farm',
        stock: 'Stock',
        freshFarm: 'Fresh Farm',
        localFarm: 'Local Farm',
        found: 'Found',
        premiumProducts: 'premium products',
        noProductsFound: 'No products found',
        tryAdjustingFilters: 'Try adjusting your search filters',
        resetFilters: 'Reset Filters',
        favorites: 'Favorites'
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
        update: 'Update',
        reviewProduce: 'Review your handpicked fresh produce',
        farmVerified: 'Farm Verified',
        freeDelivery: 'Free Delivery',
        loadingCart: 'Loading Your Cart',
        gatheringSelections: 'Gathering your fresh selections...',
        yourItems: 'Your Items',
        freeGift: 'Free gift wrapping available!',
        organic: 'ORGANIC',
        perUnit: 'per',
        freeDeliveryArrives: 'Free delivery • Arrives tomorrow',
        itemTotal: 'Item Total',
        orderSummary: 'Order Summary',
        reviewTotal: 'Review your total and savings',
        items: 'items',
        savings: 'Savings (Organic Discount)',
        delivery: 'Delivery',
        totalAmount: 'Total Amount:',
        trustOrganic: '100% Organic',
        trustDelivery: 'Fast Delivery',
        trustGuarantee: 'Money Back Guarantee',
        exploreProducts: 'Explore Fresh Products',
        emptyCartMessage: 'Discover amazing fresh produce from local farms and start your healthy journey!'
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
  },
  ta: {
    translation: {
      nav: {
        home: 'முகப்பு',
        about: 'பற்றி',
        marketplace: 'சந்தை',
        farms: 'பண்ணைகள்',
        dashboard: 'டாஷ்போர்டு',
        profile: 'சுயவிவரம்',
        cart: 'வண்டி',
        favorites: 'பிடித்தவை',
        orders: 'ஆர்டர்கள்',
        admin: 'நிர்வாகி',
        login: 'உள்நுழைவு',
        signup: 'பதிவு செய்க',
        logout: 'வெளியேறு',
        contact: 'தொடர்பு',
        faq: 'கேள்விகள்',
        settings: 'அமைப்புகள்'
      },
      common: {
        loading: 'ஏற்றுகிறது...',
        error: 'பிழை',
        success: 'வெற்றி',
        save: 'சேமி',
        cancel: 'ரத்து செய்',
        delete: 'நீக்கு',
        edit: 'திருத்து',
        view: 'பார்',
        submit: 'சமர்ப்பி',
        search: 'தேடு',
        filter: 'வடிகட்டு',
        sort: 'வரிசைப்படுத்து',
        next: 'அடுத்து',
        previous: 'முந்தைய',
        close: 'மூடு',
        open: 'திற',
        yes: 'ஆம்',
        no: 'இல்லை',
        confirm: 'உறுதிப்படுத்து',
        welcome: 'வரவேற்கிறோம்',
        getStarted: 'தொடங்குங்கள்',
        learnMore: 'மேலும் அறிய',
        backToHome: 'முகப்புக்கு திரும்பு'
      },
      landing: {
        hero: {
          title: 'நிலையான வேளாண்மையை வளர்ப்பது',
          subtitle: 'விவசாயிகளை வாங்குபவர்களுடன் இணைக்கவும், இயற்கை வேளாண்மையை ஊக்குவிக்கவும், நிலையான உணவு சுற்றுச்சூழல் அமைப்பை உருவாக்கவும்',
          cta: 'உங்கள் பயணத்தைத் தொடங்குங்கள்',
          watchVideo: 'டெமோ பார்க்கவும்'
        },
        features: {
          title: 'ஸ்டெல்லர்சாயில் ஏன் தேர்வு செய்ய வேண்டும்?',
          organic: {
            title: 'சான்றளிக்கப்பட்ட இயற்கை',
            description: 'சரிபார்க்கப்பட்ட பண்ணைகளிலிருந்து நேரடியாக பிரீமியம் இயற்கை உற்பத்தி'
          },
          direct: {
            title: 'பண்ணையிலிருந்து நேரடியாக',
            description: 'இடைத்தரகர்கள் இல்லை, விவசாயிகள் மற்றும் நுகர்வோருக்கு சிறந்த விலைகள்'
          },
          sustainable: {
            title: 'நிலையான நடைமுறைகள்',
            description: 'சுற்றுச்சூழல் நட்பு வேளாண்மை முறைகளை ஆதரிக்கிறது'
          },
          fresh: {
            title: 'பண்ணை புதிய தரம்',
            description: 'அறுவடையிலிருந்து வீட்டு வாசல் வரை விரைவான நேரத்தில்'
          }
        },
        stats: {
          farmers: 'செயலில் உள்ள விவசாயிகள்',
          products: 'புதிய பொருட்கள்',
          customers: 'மகிழ்ச்சியான வாடிக்கையாளர்கள்',
          cities: 'சேவை செய்யப்படும் நகரங்கள்'
        }
      },
      auth: {
        login: {
          title: 'மீண்டும் வரவேற்கிறோம்',
          subtitle: 'உங்கள் கணக்கில் உள்நுழையவும்',
          email: 'மின்னஞ்சல் முகவரி',
          password: 'கடவுச்சொல்',
          remember: 'என்னை நினைவில் வைத்துக் கொள்ளுங்கள்',
          forgot: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
          submit: 'உள்நுழைய',
          noAccount: 'கணக்கு இல்லையா?',
          signup: 'பதிவு செய்க'
        },
        signup: {
          title: 'கணக்கு உருவாக்கவும்',
          subtitle: 'எங்கள் வேளாண்மை சமூகத்தில் சேரவும்',
          name: 'முழு பெயர்',
          email: 'மின்னஞ்சல் முகவரி',
          password: 'கடவுச்சொல்',
          confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
          role: 'நான் ஒரு',
          roles: {
            user: 'வாங்குபவர்',
            farmer: 'விவசாயி',
            admin: 'நிர்வாகி'
          },
          terms: 'நான் விதிமுறைகள் மற்றும் நிபந்தனைகளை ஒப்புக்கொள்கிறேன்',
          submit: 'கணக்கு உருவாக்கவும்',
          hasAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
          login: 'உள்நுழைய'
        }
      },
      dashboard: {
        welcome: 'மீண்டும் வரவேற்கிறோம், {{name}}!',
        overview: 'கண்ணோட்டம்',
        recentOrders: 'சமீபத்திய ஆர்டர்கள்',
        favoriteProducts: 'பிடித்த பொருட்கள்',
        recommendations: 'உங்களுக்கு பரிந்துரைக்கப்படுபவை',
        quickActions: 'விரைவு செயல்கள்',
        viewAll: 'அனைத்தையும் பார்க்கவும்'
      },
      products: {
        title: 'புதிய பொருட்கள் சந்தை',
        subtitle: 'நிலையான பண்ணைகளில் இருந்து நேரடியாக பிரீமியம் இயற்கை விளைபொருட்களைக் கண்டறியுங்கள்',
        category: 'வகை',
        price: 'விலை',
        rating: 'மதிப்பீடு',
        addToCart: 'வண்டியில் சேர்க்கவும்',
        addToFavorites: 'பிடித்தவையில் சேர்க்கவும்',
        addedToFavorites: 'பிடித்தவையில் சேர்க்கப்பட்டது',
        removedFromFavorites: 'பிடித்தவையில் இருந்து அகற்றப்பட்டது',
        outOfStock: 'கையிருப்பு தீர்ந்தது',
        inStock: 'கையிருப்பில் உள்ளது',
        organic: 'இயற்கை',
        fresh: 'புதிய',
        description: 'விவரம்',
        reviews: 'மதிப்புரைகள்',
        seller: 'விற்பனையாளர்',
        farmLocation: 'பண்ணை இடம்',
        allCategories: 'அனைத்து வகைகள்',
        vegetables: 'காய்கறிகள்',
        fruits: 'பழங்கள்',
        grains: 'தானியங்கள்',
        herbs: 'மூலிகைகள்',
        dairy: 'பால் பொருட்கள்',
        meat: 'இறைச்சி',
        featured: 'சிறப்பம்சம்',
        priceLowToHigh: 'விலை: குறைந்த முதல் அதிக வரை',
        priceHighToLow: 'விலை: அதிக முதல் குறைந்த வரை',
        nameAZ: 'பெயர் A-Z',
        highestRated: 'அதிக மதிப்பீடு',
        minPrice: 'குறைந்தபட்ச விலை',
        maxPrice: 'அதிகபட்ச விலை',
        searchProducts: 'பொருட்களைத் தேடுங்கள்',
        freshProducts: 'புதிய பொருட்கள்',
        fastDelivery: 'விரைவான டெலிவரி',
        quickAdd: 'விரைவாக சேர்க்கவும்',
        unit: 'கிலோ',
        inCart: 'வண்டியில் உள்ளது',
        farm: 'பண்ணை',
        stock: 'கையிருப்பு',
        freshFarm: 'புதிய பண்ணை',
        localFarm: 'உள்ளூர் பண்ணை',
        found: 'கண்டறியப்பட்டது',
        premiumProducts: 'பிரீமியம் பொருட்கள்',
        noProductsFound: 'பொருட்கள் எதுவும் கிடைக்கவில்லை',
        tryAdjustingFilters: 'உங்கள் தேடல் வடிப்பான்களை சரிசெய்ய முயற்சிக்கவும்',
        resetFilters: 'வடிப்பான்களை மீட்டமைக்கவும்',
        favorites: 'பிடித்தவை'
      },
      cart: {
        title: 'வணிக வண்டி',
        empty: 'உங்கள் வண்டி காலியாக உள்ளது',
        item: 'பொருள்',
        quantity: 'அளவு',
        price: 'விலை',
        total: 'மொத்தம்',
        subtotal: 'துணை மொத்தம்',
        shipping: 'அனுப்புதல்',
        tax: 'வரி',
        checkout: 'செக்அவுட்டுக்கு செல்லவும்',
        continueShopping: 'வாங்குதலை தொடரவும்',
        remove: 'அகற்று',
        update: 'புதுப்பி',
        reviewProduce: 'உங்கள் கைத்தேர்ந்த புதிய விளைபொருட்களை மதிப்பாய்வு செய்யுங்கள்',
        farmVerified: 'பண்ணை சரிபார்க்கப்பட்டது',
        freeDelivery: 'இலவச டெலிவரி',
        loadingCart: 'உங்கள் வண்டி ஏற்றப்படுகிறது',
        gatheringSelections: 'உங்கள் புதிய தேர்வுகளை சேகரிக்கிறது...',
        yourItems: 'உங்கள் பொருட்கள்',
        freeGift: 'இலவச பரிசு பொதி கிடைக்கும்!',
        organic: 'இயற்கை',
        perUnit: 'ஒன்றுக்கு',
        freeDeliveryArrives: 'இலவச டெலிவரி • நாளை வந்தடையும்',
        itemTotal: 'பொருள் மொத்தம்',
        orderSummary: 'ஆர்டர் சுருக்கம்',
        reviewTotal: 'உங்கள் மொத்தம் மற்றும் சேமிப்புகளை மதிப்பாய்வு செய்யுங்கள்',
        items: 'பொருட்கள்',
        savings: 'சேமிப்பு (இயற்கை தள்ளுபடி)',
        delivery: 'அனுப்புதல்',
        totalAmount: 'மொத்த தொகை:',
        trustOrganic: '100% இயற்கை',
        trustDelivery: 'விரைவான டெலிவரி',
        trustGuarantee: 'பண மீளளிப்பு உத்தரவாதம்',
        exploreProducts: 'புதிய பொருட்களை ஆராயுங்கள்',
        emptyCartMessage: 'உள்ளூர் பண்ணைகளில் இருந்து அற்புதமான புதிய விளைபொருட்களைக் கண்டறிந்து உங்கள் ஆரோக்கியமான பயணத்தைத் தொடங்குங்கள்!'
      },
      farmer: {
        dashboard: 'விவசாயி டாஷ்போர்டு',
        products: 'என் பொருட்கள்',
        orders: 'ஆர்டர்கள்',
        analytics: 'பகுப்பாய்வு',
        profile: 'பண்ணை சுயவிவரம்',
        addProduct: 'பொருள் சேர்க்கவும்',
        manageInventory: 'சரக்கு நிர்வகிக்கவும்',
        sales: 'விற்பனை அறிக்கை',
        customers: 'வாடிக்கையாளர்கள்'
      },
      footer: {
        about: 'ஸ்டெல்லர்சாயில் பற்றி',
        description: 'நிலையான எதிர்காலத்திற்காக விவசாயிகள் மற்றும் நுகர்வோரை இணைக்கிறது.',
        quickLinks: 'விரைவு இணைப்புகள்',
        support: 'ஆதரவு',
        legal: 'சட்டப்பூர்வ',
        newsletter: 'செய்திமடல்',
        newsletterText: 'புதிய பொருட்கள் மற்றும் சலுகைகள் பற்றிய புதுப்பிப்புகளைப் பெற சந்தா செய்யவும்',
        subscribe: 'சந்தா',
        copyright: '© 2024 ஸ்டெல்லர்சாயில். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
        privacy: 'தனியுரிமை கொள்கை',
        terms: 'சேவை விதிமுறைகள்',
        cookies: 'குக்கீ கொள்கை'
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
