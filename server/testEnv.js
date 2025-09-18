import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import axios from 'axios';
import cloudinary from 'cloudinary';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

// Initialize results object
const results = {
  mongodb: { status: 'Not tested', message: '' },
  firebase: { status: 'Not tested', message: '' },
  cloudinary: { status: 'Not tested', message: '' },
  googleGemini: { status: 'Not tested', message: '' },
  weatherAPI: { status: 'Not tested', message: '' },
  openWeatherAPI: { status: 'Not tested', message: '' }
};

// Test MongoDB connection
const testMongoDB = async () => {
  try {
    console.log('\nTesting MongoDB connection...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    results.mongodb.status = 'SUCCESS';
    results.mongodb.message = `Connected to MongoDB at ${conn.connection.host}`;
    console.log(`✓ ${results.mongodb.message}`);
    await mongoose.connection.close();
  } catch (err) {
    results.mongodb.status = 'FAILED';
    results.mongodb.message = err.message;
    console.error(`✗ MongoDB Connection Error: ${err.message}`);
  }
};

// Test Firebase
const testFirebase = async () => {
  try {
    console.log('\nTesting Firebase configuration...');
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    results.firebase.status = 'SUCCESS';
    results.firebase.message = 'Firebase initialized successfully';
    console.log(`✓ ${results.firebase.message}`);
    
    // Test creating a temp user (will fail if already exists, which is fine)
    try {
      console.log('  Attempting to create a test user (may fail if already exists)...');
      const testEmail = `test_${Date.now()}@example.com`;
      await createUserWithEmailAndPassword(auth, testEmail, 'Password123!');
      console.log('  ✓ Test user created successfully');
    } catch (authErr) {
      console.log(`  ℹ Authentication test: ${authErr.message}`);
    }
  } catch (err) {
    results.firebase.status = 'FAILED';
    results.firebase.message = err.message;
    console.error(`✗ Firebase Error: ${err.message}`);
  }
};

// Test Cloudinary
const testCloudinary = async () => {
  try {
    console.log('\nTesting Cloudinary configuration...');
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    const result = await cloudinary.v2.api.ping();
    results.cloudinary.status = 'SUCCESS';
    results.cloudinary.message = 'Cloudinary configured correctly. Ping successful.';
    console.log(`✓ ${results.cloudinary.message}`);
  } catch (err) {
    results.cloudinary.status = 'FAILED';
    results.cloudinary.message = err.message;
    console.error(`✗ Cloudinary Error: ${err.message}`);
  }
};

// Test Google Gemini API
const testGoogleGemini = async () => {
  try {
    console.log('\nTesting Google Gemini API...');
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY not found in environment variables');
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    
    // Try to list available models first to check API key
    try {
      console.log('  Checking available models...');
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models',
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GOOGLE_GEMINI_API_KEY,
          },
        }
      );
      
      const data = await response.json();
      if (data.models && data.models.length > 0) {
        // Filter for models that support text generation
        const generationModels = data.models.filter(model => 
          model.name.includes('gemini') && 
          !model.name.includes('embedding') &&
          !model.name.includes('tts')
        );
        
        if (generationModels.length > 0) {
          console.log(`  Found text generation models: ${generationModels.slice(0, 3).map(m => m.name.split('/').pop()).join(', ')}...`);
          
          // Specifically try gemini-1.5-flash or gemini-1.5-pro
          const preferredModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-pro-latest'];
          let modelToUse = null;
          
          for (const preferred of preferredModels) {
            const match = generationModels.find(m => m.name.includes(preferred));
            if (match) {
              modelToUse = match.name.split('/').pop();
              console.log(`  Using preferred model: ${modelToUse}`);
              break;
            }
          }
          
          // If no preferred model found, use the first generation model
          if (!modelToUse) {
            modelToUse = generationModels[0].name.split('/').pop();
            console.log(`  Using available model: ${modelToUse}`);
          }
          
          // Now try to generate content
          const model = genAI.getGenerativeModel({ model: modelToUse });
          
          const prompt = 'Write a short greeting about farming (2-3 words only)';
          const result = await model.generateContent(prompt);
          const textResponse = await result.response;
          const text = textResponse.text();
          
          results.googleGemini.status = 'SUCCESS';
          results.googleGemini.message = `Google Gemini API working with model ${modelToUse}. Response: "${text}"`;
          console.log(`✓ ${results.googleGemini.message}`);
        } else {
          throw new Error('No text generation models found for your API key');
        }
      } else {
        throw new Error('No models available for your API key');
      }
    } catch (modelErr) {
      console.log(`  ℹ Model check error: ${modelErr.message}`);
      throw modelErr;
    }
  } catch (err) {
    results.googleGemini.status = 'FAILED';
    results.googleGemini.message = err.message;
    console.error(`✗ Google Gemini API Error: ${err.message}`);
  }
};

// Test OpenWeather API
const testOpenWeatherAPI = async () => {
  try {
    console.log('\nTesting OpenWeather API...');
    if (!process.env.OPENWEATHER_API_KEY) {
      throw new Error('OPENWEATHER_API_KEY not found in environment variables');
    }
    
    // Try current weather API endpoint
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: 'London',
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric'
        }
      });
      
      results.openWeatherAPI.status = 'SUCCESS';
      results.openWeatherAPI.message = `OpenWeather API working. Current temp in London: ${response.data.main.temp}°C`;
      console.log(`✓ ${results.openWeatherAPI.message}`);
    } catch (err) {
      // If that fails, try OneCall API (may be a different subscription)
      console.log('  ℹ Current weather API failed, trying OneCall API...');
      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/onecall', {
          params: {
            lat: 51.5074,  // London coordinates
            lon: -0.1278,
            exclude: 'minutely,hourly',
            appid: process.env.OPENWEATHER_API_KEY,
            units: 'metric'
          }
        });
        
        results.openWeatherAPI.status = 'SUCCESS';
        results.openWeatherAPI.message = `OpenWeather OneCall API working. Current temp in London: ${response.data.current.temp}°C`;
        console.log(`✓ ${results.openWeatherAPI.message}`);
      } catch (oneCallErr) {
        // Check if API key is at least recognized
        console.log('  ℹ Checking if API key is valid...');
        try {
          const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
              q: 'London',
              appid: process.env.OPENWEATHER_API_KEY,
              cnt: 1
            }
          });
          
          results.openWeatherAPI.status = 'SUCCESS';
          results.openWeatherAPI.message = 'OpenWeather API key is valid, but may have limited access.';
          console.log(`✓ ${results.openWeatherAPI.message}`);
        } catch (checkErr) {
          throw checkErr;
        }
      }
    }
  } catch (err) {
    results.openWeatherAPI.status = 'FAILED';
    results.openWeatherAPI.message = err.response ? err.response.data.message : err.message;
    
    // Provide more helpful information if the key is new
    if (err.response && err.response.status === 401) {
      results.openWeatherAPI.message += ' Note: New API keys may take up to 2 hours to activate.';
    }
    
    console.error(`✗ OpenWeather API Error: ${results.openWeatherAPI.message}`);
  }
};

// Test Weather API
const testWeatherAPI = async () => {
  try {
    console.log('\nTesting Weather API...');
    if (!process.env.WEATHER_API_KEY) {
      throw new Error('WEATHER_API_KEY not found in environment variables');
    }
    
    const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: 'London',
        aqi: 'no'
      }
    });
    
    results.weatherAPI.status = 'SUCCESS';
    results.weatherAPI.message = `Weather API working. Current temp in London: ${response.data.current.temp_c}°C`;
    console.log(`✓ ${results.weatherAPI.message}`);
  } catch (err) {
    results.weatherAPI.status = 'FAILED';
    results.weatherAPI.message = err.response ? err.response.data.error.message : err.message;
    console.error(`✗ Weather API Error: ${err.response ? err.response.data.error.message : err.message}`);
  }
};

// Run all tests
const runTests = async () => {
  console.log('===============================================');
  console.log('        STELLARSOIL ENV VARIABLES TEST         ');
  console.log('===============================================');
  
  await testMongoDB();
  await testFirebase();
  await testCloudinary();
  await testGoogleGemini();
  await testOpenWeatherAPI();
  await testWeatherAPI();
  
  console.log('\n===============================================');
  console.log('                 TEST SUMMARY                  ');
  console.log('===============================================');
  
  for (const [service, result] of Object.entries(results)) {
    const statusSymbol = result.status === 'SUCCESS' ? '✓' : '✗';
    const statusColor = result.status === 'SUCCESS' ? '\x1b[32m' : '\x1b[31m';
    console.log(`${statusColor}${statusSymbol} ${service}\x1b[0m: ${result.status}`);
    if (result.message) {
      console.log(`   ${result.message}`);
    }
  }
  
  console.log('\n===============================================');
  process.exit();
};

// Execute tests
runTests();