import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Farm from './models/Farm.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

// Sample data
const sampleUsers = [
  {
    name: 'Test Farmer',
    email: 'farmer@gmail.com',
    password: '$2b$10$rQYXuWRTOo0NlnqCZqFexek6yW8FE1Kk2.FxJnH6WgE0jTfXQDEVa', // password123
    phone: '9876543210',
    role: 'farmer',
    isVerified: true,
    isActive: true,
    kisanId: {
      number: 'TEST123456789',
      verified: true
    }
  },
  {
    name: 'Test User',
    email: 'user@gmail.com',
    password: '$2b$10$rQYXuWRTOo0NlnqCZqFexek6yW8FE1Kk2.FxJnH6WgE0jTfXQDEVa', // password123
    phone: '9876543211',
    role: 'user',
    isVerified: true,
    isActive: true
  },
  {
  name: 'Admin',
  email: 'admin@gmail.com',
  password: '$2b$10$rQYXuWRTOo0NlnqCZqFexek6yW8FE1Kk2.FxJnH6WgE0jTfXQDEVa', // password123
  phone: '9876543212',
  role: 'admin',
  isVerified: true,
  isActive: true
}
];

const sampleFarms = [
  {
    name: 'Green Valley Farm',
    description: 'Organic vegetables and fresh produce',
    address: '123 Farm Road, Rural Area, State 12345',
    contactPhone: '9876543210',
    location: {
      type: 'Point',
      coordinates: [77.5946, 12.9716] // Bangalore coordinates
    },
    businessHours: {
      monday: { open: '06:00', close: '18:00' },
      tuesday: { open: '06:00', close: '18:00' },
      wednesday: { open: '06:00', close: '18:00' },
      thursday: { open: '06:00', close: '18:00' },
      friday: { open: '06:00', close: '18:00' },
      saturday: { open: '06:00', close: '16:00' },
      sunday: { open: '08:00', close: '12:00' }
    },
    certifications: ['Organic', 'ISO 9001'],
    isVerified: true
  }
];

const sampleProducts = [
  // Vegetables
  { name: 'Fresh Tomatoes', category: 'Vegetables', description: 'Fresh, juicy tomatoes grown organically', price: 45, unit: 'kg', stock: 100, isOrganic: true, tags: ['fresh', 'organic', 'vegetables'] },
  { name: 'Red Onions', category: 'Vegetables', description: 'Premium quality red onions', price: 35, unit: 'kg', stock: 150, tags: ['vegetables', 'cooking'] },
  { name: 'Fresh Potatoes', category: 'Vegetables', description: 'Farm fresh potatoes', price: 25, unit: 'kg', stock: 200, tags: ['vegetables', 'staple'] },
  { name: 'Carrots', category: 'Vegetables', description: 'Crunchy and sweet carrots', price: 40, unit: 'kg', stock: 120, tags: ['vegetables', 'root'] },
  { name: 'Cabbage', category: 'Vegetables', description: 'Green cabbage heads', price: 30, unit: 'piece', stock: 60, tags: ['vegetables', 'leafy'] },
  // Fruits
  { name: 'Fresh Apples', category: 'Fruits', description: 'Sweet and crispy apples', price: 120, unit: 'kg', stock: 80, tags: ['fruits', 'sweet', 'healthy'] },
  { name: 'Bananas', category: 'Fruits', description: 'Ripe bananas', price: 50, unit: 'dozen', stock: 90, tags: ['fruits', 'energy'] },
  { name: 'Grapes', category: 'Fruits', description: 'Seedless green grapes', price: 90, unit: 'kg', stock: 70, tags: ['fruits', 'vitamins'] },
  { name: 'Oranges', category: 'Fruits', description: 'Juicy oranges', price: 80, unit: 'kg', stock: 60, tags: ['fruits', 'citrus'] },
  { name: 'Papaya', category: 'Fruits', description: 'Fresh papaya', price: 60, unit: 'kg', stock: 40, tags: ['fruits', 'tropical'] },
  // Leafy Vegetables
  { name: 'Green Spinach', category: 'Leafy Vegetables', description: 'Fresh leafy spinach', price: 30, unit: 'bundle', stock: 50, isOrganic: true, tags: ['leafy', 'organic', 'healthy'] },
  { name: 'Coriander', category: 'Leafy Vegetables', description: 'Aromatic coriander leaves', price: 15, unit: 'bunch', stock: 100, tags: ['leafy', 'herb'] },
  { name: 'Mint', category: 'Leafy Vegetables', description: 'Fresh mint leaves', price: 20, unit: 'bunch', stock: 80, tags: ['leafy', 'herb'] },
  // Dairy
  { name: 'Cow Milk', category: 'Dairy', description: 'Pure cow milk', price: 50, unit: 'liter', stock: 200, tags: ['dairy', 'milk'] },
  { name: 'Paneer', category: 'Dairy', description: 'Fresh paneer cubes', price: 250, unit: 'kg', stock: 30, tags: ['dairy', 'cheese'] },
  // Grains
  { name: 'Basmati Rice', category: 'Grains', description: 'Premium basmati rice', price: 80, unit: 'kg', stock: 100, tags: ['grains', 'rice'] },
  { name: 'Wheat Flour', category: 'Grains', description: 'Whole wheat flour', price: 40, unit: 'kg', stock: 150, tags: ['grains', 'flour'] },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Farm.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.insertMany(sampleUsers);
    console.log('Created sample users');

    // Create farms
    const farmer = users.find(u => u.role === 'farmer');
    sampleFarms[0].owner = farmer._id;
    const farms = await Farm.insertMany(sampleFarms);
    console.log('Created sample farms');

    // Create products
    const farm = farms[0];
    sampleProducts.forEach(product => {
      product.farm = farm._id;
    });
    await Product.insertMany(sampleProducts);
    console.log('Created sample products');

    console.log('Database seeded successfully!');
    console.log('Test Login Credentials:');
    console.log('Farmer: farmer@gmail.com / password123');
    console.log('User: user@gmail.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
