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
    role: { type: String, enum: ['user', 'admin', 'farmer'], default: 'user' },
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', default: null },
    kisanId: {
      documentPath: { type: String },
      verified: { type: Boolean, default: false }
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: function() {
      return this.role !== 'farmer'; // Non-farmer accounts are verified by default
    }},
    emailVerified: { type: Boolean, default: true },
    emailVerificationTokenHash: { type: String },
    emailVerificationExpires: { type: Date },
    address: { type: String },
    phone: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
    ,
    preferredLanguage: { type: String, enum: ['en', 'ta', 'hi'], default: 'en' },
    // Structured default market region for live price queries
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
userSchema.index({ "location.coordinates": "2dsphere" });

const User = mongoose.model('User', userSchema);
export default User;
