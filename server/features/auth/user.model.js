import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['consumer', 'admin', 'farmer'], default: 'consumer' },
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', default: null },
    // Consolidated verification fields
    verification: {
      email: {
        verified: { type: Boolean, default: true },
        verifiedAt: { type: Date },
        tokenHash: { type: String },
        tokenExpires: { type: Date }
      },
      kisan: {
        verified: { type: Boolean, default: false },
        documentPath: { type: String },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        approvedAt: { type: Date }
      },
      kyc: {
        verified: { type: Boolean, default: false },
        documentType: { type: String },
        documentNumber: { type: String },
        approvedAt: { type: Date }
      }
    },
    isActive: { type: Boolean, default: true },
    // Backward compatibility - computed from verification.kisan.verified
    isVerified: { type: Boolean, default: function() {
      return this.role !== 'farmer';
    }},
    address: { type: String },
    phone: { type: String },
    // GeoJSON format for geo-spatial queries
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    preferredLanguage: { type: String, enum: ['en', 'ta', 'hi'], default: 'en' },
    // Bank and payment details
    bankDetails: {
      accountNumber: { type: String },
      ifsc: { type: String },
      accountHolderName: { type: String },
      verified: { type: Boolean, default: false }
    },
    // Notification preferences
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
      orders: { type: Boolean, default: true },
      offers: { type: Boolean, default: true }
    },
    // Market region for price queries
    defaultRegion: {
      state: { type: String },
      district: { type: String },
      market: { type: String },
      variety: { type: String }
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ location: '2dsphere' }); // Geo-spatial index for location queries

const User = mongoose.model('User', userSchema);
export default User;
