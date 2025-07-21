import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    address: { type: String, required: true },
    contactPhone: { type: String, required: true },
    businessHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    certifications: [String],
    images: [String],
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

const Farm = mongoose.model('Farm', farmSchema);
export default Farm;
