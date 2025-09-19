// Test script to verify order creation using fetch API
import dotenv from 'dotenv';
// Node.js 22+ has native fetch
// import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';

const testOrderCreation = async () => {
  try {
    // Step 1: Login to get a token
    console.log('Getting authentication token...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com',  // Replace with actual test user credentials
        password: 'password123'
      }),
    });

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.error('Login failed:', loginData);
      return;
    }
    
    const token = loginData.token;
    console.log('Got token:', token.substring(0, 20) + '...');
    
    // Step 2: Get a product ID to order
    console.log('Fetching available products...');
    const productsResponse = await fetch(`${BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const productsData = await productsResponse.json();
    
    if (!productsResponse.ok || !productsData.products || productsData.products.length === 0) {
      console.error('Failed to get products:', productsData);
      return;
    }
    
    const testProduct = productsData.products[0];
    console.log(`Found test product: ${testProduct.name} (${testProduct._id})`);
    
    // Step 3: Create an order
    console.log('Creating test order...');
    const orderResponse = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [
          {
            productId: testProduct._id,
            quantity: 1
          }
        ],
        deliveryType: 'delivery',
        deliveryAddress: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          phoneNumber: '1234567890'
        },
        deliverySlot: {
          date: new Date().toISOString(),
          timeSlot: '10:00 - 11:00'
        },
        paymentMethod: 'cod'
      }),
    });

    const orderData = await orderResponse.json();
    
    if (!orderResponse.ok) {
      console.error('Order creation failed:', orderData);
      return;
    }
    
    console.log('✅ Order created successfully:');
    console.log(JSON.stringify(orderData, null, 2));
    
  } catch (error) {
    console.error('Error in test script:', error);
  }
};

// Run the test
testOrderCreation();