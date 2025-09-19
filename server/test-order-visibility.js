import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Order from './models/Order.js';
import Farm from './models/Farm.js';
import Product from './models/Product.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stellarsoil')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Test function to simulate getBuyerOrders
async function testOrderVisibility() {
  try {
    // Find a test user
    const user = await User.findOne({ role: 'user' });
    
    if (!user) {
      console.log('No test user found');
      return;
    }
    
    console.log(`Testing order visibility for user: ${user.name} (${user._id})`);
    
    // Find orders for the user using the _id field
    let orders = await Order.find({ buyer: user._id })
      .populate('farm', 'name address contactPhone')
      .populate('items.product', 'name price unit image')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${orders.length} orders for user ${user._id}`);
    
    // If no orders found, create a test order
    if (orders.length === 0) {
      console.log('No orders found. Creating a test order...');
      
      // Find a farm
      const farm = await Farm.findOne();
      if (!farm) {
        console.log('No farm found to create test order');
        return;
      }
      
      // Find a product
      const product = await Product.findOne({ farm: farm._id });
      if (!product) {
        console.log('No product found to create test order');
        return;
      }
      
      // Create a test order
      const testOrder = new Order({
        buyer: user._id,
        farm: farm._id,
        items: [{
          product: product._id,
          quantity: 2,
          price: product.price || 100,
          unit: product.unit || 'kg'
        }],
        totalAmount: (product.price || 100) * 2,
        deliveryType: 'delivery',
        deliveryAddress: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '123456'
        },
        paymentMethod: 'upi', // Using a valid payment method from enum: ['upi', 'card', 'cod']
        paymentStatus: 'paid',
        orderStatus: 'placed',
        statusHistory: [{ status: 'placed' }]
      });
      
      await testOrder.save();
      console.log('Test order created with ID:', testOrder._id);
      
      // Get the orders again after creating test order
      orders = await Order.find({ buyer: user._id })
        .populate('farm', 'name address contactPhone')
        .populate('items.product', 'name price unit image')
        .sort({ createdAt: -1 });
      
      console.log(`Now found ${orders.length} orders for user ${user._id}`);
    }
    
    // List the orders
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`);
      console.log(`- ID: ${order._id}`);
      console.log(`- Status: ${order.orderStatus}`);
      console.log(`- Total Amount: ${order.totalAmount}`);
      console.log(`- Items: ${order.items.length}`);
      console.log('-------------------');
    });
    
    // Try with .id instead of _id to demonstrate the difference
    console.log('\nTesting with .id instead of _id (should not work properly):');
    const ordersWithId = await Order.find({ buyer: user.id })
      .populate('farm', 'name address contactPhone')
      .populate('items.product', 'name price unit image')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${ordersWithId.length} orders using .id property`);
    
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the test
testOrderVisibility();