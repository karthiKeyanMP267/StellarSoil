import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import { generateAlphanumericOTP } from './utils/otpGenerator.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stellarsoil')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Simulate a verification code check
async function testVerificationCode() {
  try {
    // Find a test order with a verification code
    const order = await Order.findOne({ 
      verificationCode: { $exists: true },
      'verificationCode.code': { $ne: null }
    });

    if (!order) {
      console.log('No order with verification code found. Creating a test order...');
      // Create a test order with a verification code
      const newOrder = new Order({
        buyer: new mongoose.Types.ObjectId(),
        farm: new mongoose.Types.ObjectId(),
        items: [{
          product: new mongoose.Types.ObjectId(),
          quantity: 1,
          price: 100,
          unit: 'kg'
        }],
        totalAmount: 100,
        deliveryType: 'delivery',
        deliveryAddress: {
          street: 'Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '123456'
        },
        paymentMethod: 'cod',
        verificationCode: {
          code: generateAlphanumericOTP(6),
          generatedAt: new Date(),
          verified: false
        },
        deliveryVerification: {
          required: true,
          verified: false
        },
        statusHistory: [{ status: 'placed' }]
      });

      await newOrder.save();
      console.log('Test order created with verification code:', newOrder.verificationCode.code);
      
      // Test first verification attempt (should succeed)
      console.log('Testing first verification attempt...');
      const firstAttempt = await simulateVerification(newOrder._id, newOrder.verificationCode.code);
      console.log('First attempt result:', firstAttempt);
      
      // Test second verification attempt (should fail)
      console.log('Testing second verification attempt...');
      const secondAttempt = await simulateVerification(newOrder._id, newOrder.verificationCode.code);
      console.log('Second attempt result:', secondAttempt);
    } else {
      console.log('Found order with verification code:', order.verificationCode.code);
      console.log('Verification status:', order.verificationCode.verified ? 'Already verified' : 'Not verified');
      
      if (!order.verificationCode.verified) {
        // Test first verification attempt (should succeed)
        console.log('Testing first verification attempt...');
        const firstAttempt = await simulateVerification(order._id, order.verificationCode.code);
        console.log('First attempt result:', firstAttempt);
      }
      
      // Test verification attempt (should fail if already verified)
      console.log('Testing verification attempt...');
      const attempt = await simulateVerification(order._id, order.verificationCode.code);
      console.log('Verification attempt result:', attempt);
    }
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Simulate the verification process
async function simulateVerification(orderId, code) {
  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return { success: false, message: 'Order not found' };
    }
    
    // Check if the verification code matches
    if (!order.verificationCode || order.verificationCode.code !== code) {
      return { success: false, message: 'Invalid verification code' };
    }
    
    // Check if code is already verified (our new check)
    if (order.verificationCode.verified) {
      return { success: false, message: 'This verification code has already been used and cannot be reused' };
    }
    
    // Mark code as verified
    order.verificationCode.verified = true;
    order.verificationCode.verifiedAt = new Date();
    order.deliveryVerification.verified = true;
    order.deliveryVerification.verifiedAt = new Date();
    order.orderStatus = 'delivered';
    order.statusHistory.push({ status: 'delivered' });
    
    await order.save();
    return { success: true, message: 'Verification successful' };
  } catch (error) {
    console.error('Error in verification simulation:', error);
    return { success: false, message: 'Verification error', error: error.message };
  }
}

// Run the test
testVerificationCode();