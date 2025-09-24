const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    address: { type: String, required: true },
    contactPhone: { type: String, required: true },
    email: { type: String },
    farmType: { 
      type: String, 
      enum: ['organic', 'conventional', 'hydroponic', 'mixed'], 
      default: 'organic' 
    },
    farmSize: { 
      value: { type: Number },
      unit: { type: String, enum: ['hectare', 'acre', 'bigha', 'katha'], default: 'hectare' }
    },
    businessHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    specialCrops: { type: String },
    certifications: [String], // Simple string list for backward compatibility
    // New detailed certificate information
    certificates: [{
      file: { type: String }, // Filename of the uploaded certificate
      uploadDate: { type: Date, default: Date.now },
      score: { type: Number, default: 0 },
      grade: { type: String },
      details: {
        certificateType: { type: String },
        issuer: { type: String },
        validUntil: { type: String },
        farmerName: { type: String },
        farmSize: { type: String },
        location: { type: String },
        crops: { type: String },
        isOrganic: { type: Boolean, default: false }
      }
    }],
    // Overall certification score (highest of all certificates)
    certificationScore: { type: Number, default: 0 },
    images: [String],
    website: { type: String },
    socialMedia: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String }
    },
    rating: { type: Number, default: 0 },
    reviews: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String,
      date: { type: Date, default: Date.now }
    }],
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Create a 2dsphere index for geo queries
farmSchema.index({ location: '2dsphere' });

// Create an index on certification score for sorting products by farmer score
farmSchema.index({ certificationScore: -1 });

const Farm = mongoose.model('Farm', farmSchema);
module.exports = Farm;
