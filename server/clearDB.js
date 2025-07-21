import mongoose from 'mongoose';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Appointment from './models/Appointment.js';
import dotenv from 'dotenv';

dotenv.config();

const clearDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Doctor.deleteMany({});
  await Appointment.deleteMany({});
  console.log('All users, doctors, and appointments deleted.');
  process.exit();
};

clearDB();
