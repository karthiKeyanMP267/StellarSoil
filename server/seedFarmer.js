import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const createFarmer = async () => {
  // Remove any existing farmer with this email
  await User.deleteOne({ email: 'farmer@stellarsoil.com' });

  const farmer = new User({
    name: 'Test Farmer',
    email: 'farmer@stellarsoil.com',
    password: 'farmer@123',
    role: 'farmer',
    isActive: true,
    isVerified: true
  });
  await farmer.save();
  console.log('Verified farmer user created!');
  mongoose.disconnect();
};

createFarmer();
