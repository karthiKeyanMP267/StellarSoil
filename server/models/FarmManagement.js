import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  temperature: Number,
  humidity: Number,
  soilMoisture: Number,
  soilPH: Number,
  rainfall: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const pestAlertSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pestType: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  location: String,
  detectedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
  },
  images: [String],
  notes: String
});

const cropHealthSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropType: String,
  plantingDate: Date,
  expectedHarvestDate: Date,
  growthStage: {
    type: String,
    enum: ['seeding', 'growing', 'flowering', 'harvesting']
  },
  healthStatus: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor']
  },
  diseaseDetections: [{
    disease: String,
    detectedAt: Date,
    severity: String,
    treatment: String
  }],
  images: [String],
  notes: String
});

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['product', 'farm', 'seasonal']
  },
  items: [{
    itemId: mongoose.Schema.Types.ObjectId,
    score: Number,
    reason: String
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Recommendations expire after 24 hours
  }
});

// Create indexes
sensorDataSchema.index({ farmId: 1, timestamp: -1 });
pestAlertSchema.index({ farmId: 1, status: 1 });
cropHealthSchema.index({ farmId: 1 });
recommendationSchema.index({ location: '2dsphere' });
recommendationSchema.index({ userId: 1, type: 1 });

export const SensorData = mongoose.model('SensorData', sensorDataSchema);
export const PestAlert = mongoose.model('PestAlert', pestAlertSchema);
export const CropHealth = mongoose.model('CropHealth', cropHealthSchema);
export const Recommendation = mongoose.model('Recommendation', recommendationSchema);
