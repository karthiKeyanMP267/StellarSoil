#!/usr/bin/env node
/**
 * Backfill farmer field on legacy orders.
 *
 * This script finds orders missing the `farmer` field and sets it
 * by resolving the farm's owner (order.farm -> Farm.ownerId or legacy Farm.owner).
 *
 * Usage (Windows PowerShell):
 *   # Ensure MONGO_URI is set in your environment or .env
 *   npm run backfill:farmer-orders
 *
 * Safety:
 * - Runs in batches to avoid memory spikes
 * - Skips orders that already have `farmer`
 * - Skips orders with missing/invalid farm
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import Order from '../models/Order.js';
import Farm from '../models/Farm.js';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const BATCH_SIZE = 200;

async function backfill() {
  try {
    await connectDB();

    const filter = { $or: [ { farmer: { $exists: false } }, { farmer: null } ] };
    const total = await Order.countDocuments(filter);
    console.log(`Found ${total} orders to backfill.`);

    let processed = 0;
    while (processed < total) {
      const orders = await Order.find(filter)
        .sort({ createdAt: 1 })
        .limit(BATCH_SIZE)
        .lean();

      if (!orders.length) break;

      const farmIds = [...new Set(orders.map(o => o.farm).filter(Boolean).map(id => id.toString()))];
  const farms = await Farm.find({ _id: { $in: farmIds } }).select('_id ownerId owner').lean();
  const ownerByFarm = new Map(farms.map(f => [f._id.toString(), f.ownerId || f.owner]));

      const bulkOps = [];
      for (const o of orders) {
        const owner = ownerByFarm.get(o.farm?.toString());
        if (!owner) continue;
        bulkOps.push({
          updateOne: {
            filter: { _id: o._id },
            update: { $set: { farmer: owner } }
          }
        });
      }

      if (bulkOps.length) {
        const res = await Order.bulkWrite(bulkOps, { ordered: false });
        processed += orders.length;
        console.log(`Processed ${processed}/${total}. Matched: ${res.matchedCount}, Modified: ${res.modifiedCount}`);
      } else {
        // Avoid tight loop if no updates possible in this batch
        processed += orders.length;
        console.log(`Processed ${processed}/${total}. No applicable updates in this batch.`);
      }
    }

    console.log('Backfill complete.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Backfill error:', err);
    try { await mongoose.connection.close(); } catch {}
    process.exit(1);
  }
}

backfill();
