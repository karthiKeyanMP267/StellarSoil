// Temporary script to create products that work with the chatbot
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Simple Product schema for chatbot
const chatProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  farmer: { type: String, default: 'Local Farm' },
  description: String,
  image: String
});

const ChatProduct = mongoose.model('ChatProduct', chatProductSchema);

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stellarsoil');
    console.log('Connected to MongoDB');

    // Clear existing chat products
    await ChatProduct.deleteMany({});

    // Create sample products
    const products = [
      {
        name: 'tomato',
        price: 25,
        unit: 'kg',
        quantity: 1000,
        farmer: 'Sunny Farms',
        description: 'Fresh organic tomatoes',
        image: '/placeholder.jpg'
      },
      {
        name: 'potato',
        price: 20,
        unit: 'kg',
        quantity: 800,
        farmer: 'Green Valley Farm',
        description: 'Fresh potatoes',
        image: '/placeholder.jpg'
      },
      {
        name: 'onion',
        price: 30,
        unit: 'kg',
        quantity: 900,
        farmer: 'Hillside Farms',
        description: 'Fresh red onions',
        image: '/placeholder.jpg'
      },
      {
        name: 'carrot',
        price: 35,
        unit: 'kg',
        quantity: 700,
        farmer: 'Organic Gardens',
        description: 'Fresh organic carrots',
        image: '/placeholder.jpg'
      }
    ];

    const createdProducts = await ChatProduct.insertMany(products);
    console.log('Created products:', createdProducts.length);

    console.log('Sample products:');
    createdProducts.forEach(product => {
      console.log(`- ${product.name}: ₹${product.price}/${product.unit} (${product.quantity} available)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();