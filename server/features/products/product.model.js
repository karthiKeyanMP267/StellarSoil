import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // cropName
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true }, // farmId
    category: { type: String, required: true },
    description: { type: String },
    // Consolidated pricing structure
    pricing: {
      farmerPrice: { type: Number, required: true }, // What farmer charges
      displayPrice: { type: Number }, // Calculated: farmerPrice or special offer
      reference: {
        governmentAverage: { type: Number }, // From govt API
        marketTrend: { type: Number }, // From ML prediction
        lastUpdated: { type: Date }
      }
    },
    // Backward compatibility fields (deprecated)
    price: { type: Number }, // Use pricing.farmerPrice instead
    unit: { type: String, required: true }, // kg, piece, bundle, etc.
    // Consolidated quantity field
    quantity: { type: Number, required: true, default: 0 }, // Available for sale
    stock: { type: Number }, // Deprecated - use quantity
    images: [String],
    isOrganic: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    // Freshness tracking
    freshness: {
      harvestedAt: { type: Date },
      expiryDate: { type: Date },
      daysOld: { type: Number } // Calculated field
    },
    // Batch information for traceability
    batchInfo: {
      batchId: { type: String },
      lotNumber: { type: String },
      harvestedDate: { type: Date }
    },
    seasonality: {
      start: { type: Date },
      end: { type: Date }
    },
    tags: [String],
    rating: { type: Number, default: 0 },
    reviews: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String,
      date: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

// Add text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ farm: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
