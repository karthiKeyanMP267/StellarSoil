// server/index.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For JSON body parsing

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ensure uploads directory exists
import fs from 'fs';

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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
