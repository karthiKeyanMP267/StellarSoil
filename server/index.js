// server/index.js
import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { corsOptions, limiter, helmetConfig } from './config/security.js';

import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import mlRoutes from './routes/mlRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import farmManagementRoutes from './routes/farmManagementRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
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

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ensure uploads directory exists
import fs from 'fs';
import notificationService from './services/notificationService.js';

const uploadsDir = path.join(__dirname, 'uploads');
const kisanIdsDir = path.join(uploadsDir, 'kisan-ids');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(kisanIdsDir)) fs.mkdirSync(kisanIdsDir);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/farm-management', farmManagementRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

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
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Start notification service periodic tasks
  notificationService.startPeriodicTasks();
});
