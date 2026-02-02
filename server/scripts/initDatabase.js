// Initialize database with required indexes
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Create 2dsphere index on farms.location
    await db.collection('farms').createIndex({ location: '2dsphere' });
    console.log('✓ Created 2dsphere index on farms.location');

    // Create index on farm certificationScore
    await db.collection('farms').createIndex({ certificationScore: -1 });
    console.log('✓ Created index on farms.certificationScore');

    // Create text index on products
    await db.collection('products').createIndex({ 
      name: 'text', 
      description: 'text', 
      tags: 'text' 
    });
    console.log('✓ Created text index on products');

    // Create indexes on products
    await db.collection('products').createIndex({ farm: 1 });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ isActive: 1 });
    console.log('✓ Created indexes on products');

    // Create user indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    console.log('✓ Created indexes on users');

    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

initDatabase();
