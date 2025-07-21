import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    unit: { type: String, required: true }, // kg, piece, bundle, etc.
    stock: { type: Number, required: true },
    images: [String],
    isOrganic: { type: Boolean, default: false },
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

const Product = mongoose.model('Product', productSchema);
export default Product;
