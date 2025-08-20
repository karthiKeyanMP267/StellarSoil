import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const createAdmin = async () => {
  // Remove any existing admin with this email
  await User.deleteOne({ email: 'admin@stellarsoil.com' });

  const admin = new User({
    name: 'Admin',
    email: 'admin@stellarsoil.com',
    password: 'admin@123', // Use a strong password!
    role: 'admin',
    isActive: true,
    isVerified: true
  });
  await admin.save();
  console.log('Admin user created!');
  mongoose.disconnect();
};

createAdmin();