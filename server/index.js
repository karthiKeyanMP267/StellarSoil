// server/index.js
const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { corsOptions, limiter, helmetConfig } = require('./config/security');

const cors = require('cors');
const path = require('path');
const { pathToFileURL } = require('url');

// Load environment variables from the correct path
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Log that env was loaded
console.log(`Environment loaded from: ${envPath}`);
console.log(`Node environment: ${process.env.NODE_ENV}`);
console.log(`Server port: ${process.env.PORT}`);

connectDB();

const app = express();

// Security Middleware
app.use(cors(corsOptions));
app.use(helmetConfig);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Serve uploaded files from server/uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const fs = require('fs');
let notificationService = require('./services/notificationService');
notificationService = notificationService && notificationService.default ? notificationService.default : notificationService;

const uploadsDir = path.join(__dirname, 'uploads');
const kisanIdsDir = path.join(uploadsDir, 'kisan-ids');
const certificatesDir = path.join(uploadsDir, 'certificates');
const tempDir = path.join(uploadsDir, 'temp');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(kisanIdsDir)) fs.mkdirSync(kisanIdsDir);
if (!fs.existsSync(certificatesDir)) fs.mkdirSync(certificatesDir);
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// Helper to load routers that may be ESM or CJS
const loadRouterSync = (p) => {
  try {
    const mod = require(p);
    return mod && mod.default ? mod.default : mod;
  } catch (e) {
    return null;
  }
};

const loadRouterAsync = async (p) => {
  const fileUrl = pathToFileURL(path.resolve(__dirname, p + (p.endsWith('.js') ? '' : '.js'))).href;
  const mod = await import(fileUrl);
  return (mod && (mod.default || mod.router)) ? (mod.default || mod.router) : mod;
};

// Mount routes (support both CJS require and ESM import)
const mountRoutes = async () => {
  const mappings = [
    ['/api/auth', './routes/authRoutes'],
    ['/api/admin', './routes/adminRoutes'],
    ['/api/products', './routes/productRoutes'],
    ['/api/orders', './routes/orderRoutes'],
    ['/api/farms', './routes/farmRoutes'],
    ['/api/certificates', './routes/certificateRoutes'],
    ['/api/cart', './routes/cartRoutes'],
    ['/api/ml', './routes/mlRoutes'],
    ['/api/market', './routes/marketRoutes'],
    ['/api/payment', './routes/paymentRoutes'],
    ['/api/farm-management', './routes/farmManagementRoutes'],
    ['/api/doctors', './routes/doctorRoutes'],
    ['/api/appointments', './routes/appointmentRoutes'],
    ['/api/weather', './routes/weatherRoutes'],
    ['/api/notifications', './routes/notificationRoutes'],
    ['/api/analytics', './routes/analyticsRoutes'],
    ['/api/favorites', './routes/favoritesRoutes'],
    ['/api/chat', './routes/chatRoutes']
  ];

  for (const [mountPath, rel] of mappings) {
    let router = loadRouterSync(rel);
    if (!router) {
      router = await loadRouterAsync(rel);
    }
    app.use(mountPath, router);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large' });
    }
    return res.status(400).json({ message: err.message });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  
  res.status(500).json({ message: 'Something went wrong!' });
});

app.get('/', (req, res) => {
  res.send('StellarSoil API is running...');
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await mountRoutes();
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      // Start notification service periodic tasks
      try { notificationService.startPeriodicTasks(); } catch (e) { console.warn('Notification tasks not started:', e?.message); }
    });
  } catch (e) {
    console.error('Failed to mount routes:', e);
    process.exit(1);
  }
})();
