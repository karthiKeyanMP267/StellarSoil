# 📊 StellarSoil Database Models - Analysis & Overview

## ⚠️ Critical Issues Found

### 1. **Hardcoded/Redundant Fields**

#### User Model Issues:
```javascript
// PROBLEM: Two conflicting verification fields
emailVerified: { type: Boolean, default: true }        // Always true
isVerified: { type: Boolean, ... }                      // Varies by role

// PROBLEM: Location stored in two ways
location: { lat, lng }                                  // Simple format
defaultRegion: { state, district, market, variety }    // Separate fields
```

**Impact**: Confusing logic - which field is the source of truth?

---

#### Product Model Issues:
```javascript
// PROBLEM: Duplicate quantity fields
stock: { type: Number, required: true }                // Total stock
quantity: { type: Number, required: true }             // Available quantity

// PROBLEM: Both hardcoded and ML fields
price: { type: Number }                                // Farmer's price
predictedPrice: { type: Number }                       // ML prediction
governmentPrice: { type: Number }                      // External API

// Which price is used? No clear logic!
```

**Impact**: Query confusion - which price should be displayed?

---

#### Cart Model Issues:
```javascript
// PROBLEM: Farm can be null or missing
farm: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Farm',
  required: false  // Made optional for "chatbot integration"
}

// This breaks the cart-per-farm-per-user constraint
cartSchema.index({ user: 1, farm: 1 }, { unique: true });
```

**Impact**: Carts without farms cannot use unique index properly

---

### 2. **Missing Essential Fields**

#### User Model:
```javascript
// MISSING: Payment methods (UPI, Card, Bank)
// MISSING: KYC/Bank verification status
// MISSING: Subscription/Membership tier
// MISSING: Notification preferences
// MISSING: Privacy settings
```

#### Product Model:
```javascript
// MISSING: Harvest date / Freshness tracking
// MISSING: Certification reference (links to farm certificates)
// MISSING: Country/Origin of produce
// MISSING: Storage/Shelf life information
// MISSING: Batch/Lot number tracking
// MISSING: Expiry date for perishables
```

#### Order Model:
```javascript
// PROBLEM: Duplicate farmer reference
farm: { type: ObjectId, ref: 'Farm' }           // Farm reference
farmer: { type: ObjectId, ref: 'User' }         // Denormalized farmer

// PROBLEM: Redundant delivery data
deliveryAddress: { ... }                         // Full address
deliverySlot: { date, timeSlot }                // Separate date/time fields
verificationCode: { ... }                        // Verification logic
deliveryVerification: { ... }                    // Another verification

// Should consolidate delivery flow
```

---

### 3. **Inefficient Indexes**

#### Current Indexes:
```javascript
// User Model
index({ email: 1 })
index({ role: 1 })
index({ 'location.lat': 1, 'location.lng': 1 })  // NOT USED (no geo queries)

// Product Model
index({ name: 'text', description: 'text' })      // Text search
index({ farm: 1 })
index({ category: 1 })
index({ isActive: 1 })

// Order Model
index({ buyer: 1, createdAt: -1 })                // Good
index({ farm: 1, createdAt: -1 })                 // Good
index({ farmer: 1, createdAt: -1 })               // Redundant (farm is same)
```

**Problem**: The `location.lat/lng` index won't work with 2dsphere queries needed for distance calculation.

---

### 4. **Missing Relationships**

| Need | Missing | Impact |
|------|---------|--------|
| Product → Farmer (direct) | ❌ Only Product → Farm | Queries need 2 lookups |
| Farm → User (explicit) | ❌ Only User → Farm | Inconsistent references |
| Order → Delivery tracking | ❌ No delivery model | Can't track real-time location |
| Review → Rating system | ❌ No dedicated model | Reviews embedded (scaling issue) |

---

## 📋 Current Model Structure

```
User (auth + profile)
  ├── farmId → Farm
  └── favorites → [Products]

Farm (producer profile)
  ├── ownerId → User
  └── certifications → [String] (hardcoded!)

Product (catalog)
  ├── farm → Farm
  └── reviews → [embedded]

Order (transactions)
  ├── buyer → User
  ├── farm → Farm
  ├── farmer → User (redundant)
  └── items → [{product, quantity}]

Cart
  ├── user → User
  ├── items → [{product, quantity}]
  └── farm → Farm (optional!)

FarmManagement (separate models)
  ├── SensorData
  ├── PestAlert
  ├── CropHealth
  └── Recommendation

Doctor & Appointment (unrelated)
  └── Completely separate domain
```

---

## 🔧 Recommendations for Fixes

### PRIORITY 1: Eliminate Redundancy

#### Fix 1: User Model - Consolidate Verification
```javascript
// BEFORE
emailVerified: true
isVerified: conditional
emailVerificationTokenHash
emailVerificationExpires

// AFTER
verification: {
  email: {
    verified: Boolean,
    verifiedAt: Date,
    tokenHash: String,
    tokenExpires: Date
  },
  kisan: {
    verified: Boolean,
    documentPath: String,
    approvedBy: ObjectId
  }
}
```

#### Fix 2: Product Model - Single Price Logic
```javascript
// BEFORE
price: Number                    // Farmer sets
predictedPrice: Number          // ML generates
governmentPrice: Number         // API provides

// AFTER
pricing: {
  farmerPrice: Number,          // What farmer charges
  reference: {
    governmentAverage: Number,  // For comparison
    marketTrend: Number         // ML prediction
  },
  displayPrice: Number          // What customer sees (computed field)
}
```

#### Fix 3: Order Model - Single Farmer Reference
```javascript
// BEFORE
farm: ObjectId
farmer: ObjectId  // Denormalized copy

// AFTER - use virtual populate
order.populate('farm.ownerId')  // Get farmer via farm
// Or use aggregation pipeline for performance
```

#### Fix 4: Cart Model - Required Farm
```javascript
// BEFORE
farm: { required: false }       // Optional!

// AFTER
farm: { required: true },       // Must have farm
cartSchema.index({ user: 1, farm: 1 }, { unique: true })
```

---

### PRIORITY 2: Add Missing Fields

#### Product Model Enhancement
```javascript
freshness: {
  harvestedAt: Date,
  daysOld: Number,  // Calculated
  expiryDate: Date
},
certification: {
  farmCertScore: Number,  // Reference to farm's cert score
  organic: Boolean,
  certType: String        // Link to farm's certificate
},
batchInfo: {
  batchId: String,        // For traceability
  lotNumber: String,
  quantity: Number,
  harvestedDate: Date
}
```

#### User Model Enhancement
```javascript
kyc: {
  verified: Boolean,
  documentType: String,
  documentNumber: String,
  approvedAt: Date
},
bankDetails: {
  accountNumber: String,
  ifsc: String,
  verified: Boolean
},
notifications: {
  email: Boolean,
  sms: Boolean,
  whatsapp: Boolean,
  orders: Boolean,
  offers: Boolean
}
```

---

### PRIORITY 3: Fix Geo-Queries

#### Currently Broken
```javascript
// Farm.js tries to use this for distance:
location: {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], default: [0, 0] }
}
farmSchema.index({ location: '2dsphere' })

// BUT User model has different format!
location: { lat: Number, lng: Number }

// This is why geo-search doesn't work!
```

#### Fix: Standardize GeoJSON
```javascript
// Farm Model
location: {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number] }  // [lng, lat] in GeoJSON
}
farmSchema.index({ location: '2dsphere' })

// User Model
location: {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number] }  // [lng, lat] in GeoJSON
}
userSchema.index({ location: '2dsphere' })

// Query becomes consistent:
db.products.aggregate([
  { $geoNear: { near: { type: 'Point', coordinates: [lng, lat] }, ... } }
])
```

---

## 📊 Summary Table

| Model | Status | Issues | Fix Effort |
|-------|--------|--------|-----------|
| **User** | ⚠️ Partial | Duplicate fields, missing KYC | Medium |
| **Product** | ⚠️ Partial | Multiple prices, missing freshness | High |
| **Order** | ⚠️ Partial | Redundant references, complex delivery | Medium |
| **Cart** | ❌ Broken | Optional farm breaks constraints | Low |
| **Farm** | ✅ Good | Geo-index correct format | - |
| **FarmManagement** | ✅ Good | Well structured | - |
| **Doctor/Appointment** | ⚠️ Unknown | Unrelated to farm-to-consumer | N/A |

---

## 🎯 Recommended Action Plan

**Phase 1 (Critical)** - Next 1-2 hours:
- [ ] Fix Cart model: make farm required
- [ ] Standardize User location to GeoJSON
- [ ] Remove redundant farm reference from Order
- [ ] Consolidate Product prices with clear logic

**Phase 2 (Important)** - Next 2-4 hours:
- [ ] Consolidate User verification fields
- [ ] Add missing KYC/Bank fields
- [ ] Add freshness tracking to Product
- [ ] Create Delivery model for better tracking

**Phase 3 (Enhancement)** - Next session:
- [ ] Create Review model (separate from embedded)
- [ ] Add batch/lot tracking
- [ ] Implement full audit logging
- [ ] Consider removing Doctor/Appointment (unrelated)

---

**Overall Assessment**: Models are **70% hardcoded with redundant fields**. Core relationships exist but need consolidation and proper field validation. Geo-queries won't work with current User location format.
