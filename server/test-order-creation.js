// Test script to verify order creation
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Order from './models/Order.js';
import Product from './models/Product.js';

// Force ESM compatibility
const __filename = new URL(import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname;

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for testing'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const testOrderCreation = async () => {
  try {
    // Find a user with 'user' role
    const testUser = await User.findOne({ role: 'user' });
    if (!testUser) {
      console.error('Test user not found. Please ensure there is at least one user with role "user"');
      process.exit(1);
    }
    
    console.log(`Found test user: ${testUser.name} (${testUser._id})`);
    
    // Find a product to order
    const testProduct = await Product.findOne();
    if (!testProduct) {
      console.error('Test product not found. Please ensure there is at least one product in the database');
      process.exit(1);
    }
    
    console.log(`Found test product: ${testProduct.name} (${testProduct._id})`);
    console.log(`Product farm ID: ${testProduct.farm}`);
    
    // Create test order
    const testOrder = await Order.create({
      buyer: testUser._id,
      farm: testProduct.farm,
      items: [{
        product: testProduct._id,
        quantity: 1,
        price: testProduct.price,
        unit: testProduct.unit
      }],
      totalAmount: testProduct.price,
      deliveryType: 'delivery',
      deliveryAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        phoneNumber: '1234567890'
      },
      deliverySlot: {
        date: new Date(),
        timeSlot: '10:00 - 11:00'
      },
      paymentMethod: 'cod',
      verificationCode: '123456',
      deliveryVerification: {
        required: true,
        verified: false
      },
      statusHistory: [{ status: 'placed' }]
    });
    
    console.log('✅ Test order created successfully:');
    console.log(JSON.stringify(testOrder, null, 2));
    
    // Cleanup: Delete the test order
    await Order.findByIdAndDelete(testOrder._id);
    console.log('Test order deleted');
    
  } catch (error) {
    console.error('Error testing order creation:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

// Run the test
testOrderCreation();