/**
 * Database Migration Helper
 * Run this script after model changes to migrate existing data
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stellarsoil';

console.log('🔄 Starting Database Migration...\n');

async function migrateUsers() {
  console.log('👤 Migrating User model...');
  
  const db = mongoose.connection.db;
  const usersCollection = db.collection('users');
  
  const users = await usersCollection.find({}).toArray();
  let migrated = 0;
  
  for (const user of users) {
    const updates = {};
    
    // Migrate location from {lat, lng} to GeoJSON format
    if (user.location && ('lat' in user.location || 'lng' in user.location)) {
      const lat = user.location.lat || 0;
      const lng = user.location.lng || 0;
      updates.location = {
        type: 'Point',
        coordinates: [lng, lat] // GeoJSON is [longitude, latitude]
      };
      console.log(`  ✓ User ${user.email}: Migrated location from {lat: ${lat}, lng: ${lng}} to GeoJSON`);
    }
    
    // Migrate verification fields
    if (!user.verification) {
      updates.verification = {
        email: {
          verified: user.emailVerified !== undefined ? user.emailVerified : true,
          verifiedAt: user.emailVerified ? new Date() : null,
          tokenHash: user.emailVerificationTokenHash || null,
          tokenExpires: user.emailVerificationExpires || null
        },
        kisan: {
          verified: user.kisanId?.verified || false,
          documentPath: user.kisanId?.documentPath || null,
          approvedBy: null,
          approvedAt: user.kisanId?.verified ? new Date() : null
        },
        kyc: {
          verified: false,
          documentType: null,
          documentNumber: null,
          approvedAt: null
        }
      };
      console.log(`  ✓ User ${user.email}: Consolidated verification fields`);
    }
    
    // Add default bank details if missing
    if (!user.bankDetails) {
      updates.bankDetails = {
        accountNumber: null,
        ifsc: null,
        accountHolderName: null,
        verified: false
      };
    }
    
    // Add notification preferences if missing
    if (!user.notifications) {
      updates.notifications = {
        email: true,
        sms: false,
        whatsapp: false,
        orders: true,
        offers: true
      };
    }
    
    if (Object.keys(updates).length > 0) {
      await usersCollection.updateOne({ _id: user._id }, { $set: updates });
      migrated++;
    }
  }
  
  console.log(`✅ Migrated ${migrated} users\n`);
}

async function migrateProducts() {
  console.log('📦 Migrating Product model...');
  
  const db = mongoose.connection.db;
  const productsCollection = db.collection('products');
  
  const products = await productsCollection.find({}).toArray();
  let migrated = 0;
  
  for (const product of products) {
    const updates = {};
    
    // Migrate pricing structure
    if (!product.pricing && product.price) {
      updates.pricing = {
        farmerPrice: product.price,
        displayPrice: product.price,
        reference: {
          governmentAverage: product.governmentPrice || null,
          marketTrend: product.predictedPrice || null,
          lastUpdated: new Date()
        }
      };
      // Keep old fields for backward compatibility but mark as deprecated
      console.log(`  ✓ Product ${product.name}: Migrated pricing structure (price: ${product.price})`);
    }
    
    // Consolidate quantity (remove duplicate stock field)
    if (product.stock !== undefined && product.quantity === undefined) {
      updates.quantity = product.stock;
      console.log(`  ✓ Product ${product.name}: Consolidated quantity from stock`);
    }
    
    // Add freshness tracking if missing
    if (!product.freshness) {
      updates.freshness = {
        harvestedAt: null,
        expiryDate: null,
        daysOld: null
      };
    }
    
    // Add batch info if missing
    if (!product.batchInfo) {
      updates.batchInfo = {
        batchId: null,
        lotNumber: null,
        harvestedDate: null
      };
    }
    
    if (Object.keys(updates).length > 0) {
      await productsCollection.updateOne({ _id: product._id }, { $set: updates });
      migrated++;
    }
  }
  
  console.log(`✅ Migrated ${migrated} products\n`);
}

async function migrateOrders() {
  console.log('📋 Migrating Order model...');
  
  const db = mongoose.connection.db;
  const ordersCollection = db.collection('orders');
  
  // Remove redundant farmer field (can be accessed via farm.ownerId)
  const result = await ordersCollection.updateMany(
    { farmer: { $exists: true } },
    { $unset: { farmer: '' } }
  );
  
  console.log(`✅ Removed redundant farmer field from ${result.modifiedCount} orders\n`);
}

async function migrateCarts() {
  console.log('🛒 Checking Cart model...');
  
  const db = mongoose.connection.db;
  const cartsCollection = db.collection('carts');
  
  // Find carts without farm reference
  const cartsWithoutFarm = await cartsCollection.countDocuments({ farm: { $exists: false } });
  
  if (cartsWithoutFarm > 0) {
    console.warn(`⚠️  Warning: ${cartsWithoutFarm} carts found without farm reference.`);
    console.warn('   These carts may need manual cleanup or reassignment.\n');
  } else {
    console.log(`✅ All carts have valid farm references\n`);
  }
}

async function createIndexes() {
  console.log('📇 Creating/updating indexes...');
  
  const db = mongoose.connection.db;
  
  // User indexes
  try {
    await db.collection('users').dropIndex('location.lat_1_location.lng_1');
    console.log('  ✓ Dropped old location index');
  } catch (err) {
    // Index doesn't exist, that's fine
  }
  
  await db.collection('users').createIndex({ location: '2dsphere' });
  console.log('  ✓ Created 2dsphere index on users.location');
  
  // Order indexes - drop redundant farmer index
  try {
    await db.collection('orders').dropIndex('farmer_1_createdAt_-1');
    console.log('  ✓ Dropped redundant farmer index from orders');
  } catch (err) {
    // Index doesn't exist, that's fine
  }
  
  console.log('✅ Indexes updated\n');
}

async function runMigration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Run migrations
    await migrateUsers();
    await migrateProducts();
    await migrateOrders();
    await migrateCarts();
    await createIndexes();
    
    console.log('✅ Migration completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - User locations converted to GeoJSON format');
    console.log('   - User verification fields consolidated');
    console.log('   - Product pricing structure consolidated');
    console.log('   - Order redundant farmer field removed');
    console.log('   - Database indexes updated');
    console.log('\n⚠️  Important: Test your application thoroughly before deploying!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run migration
runMigration();
