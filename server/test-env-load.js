import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Print environment variables
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GOOGLE_GEMINI_API_KEY:', process.env.GOOGLE_GEMINI_API_KEY ? 'Set (first 5 chars: ' + process.env.GOOGLE_GEMINI_API_KEY.substring(0, 5) + '...)' : 'Not set');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? 'Set (first 5 chars: ' + process.env.FIREBASE_API_KEY.substring(0, 5) + '...)' : 'Not set');
console.log('WEATHER_API_KEY:', process.env.WEATHER_API_KEY ? 'Set (first 5 chars: ' + process.env.WEATHER_API_KEY.substring(0, 5) + '...)' : 'Not set');