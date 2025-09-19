import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Price at time of order
      unit: { type: String, required: true }
    }],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // Discount amount applied
    discountCode: { type: String }, // Discount code if used
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      phoneNumber: String, // Added for delivery contact
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number]
      }
    },
    deliveryType: { type: String, enum: ['pickup', 'delivery'], required: true },
    deliverySlot: {
      date: Date,
      timeSlot: String
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['upi', 'card', 'cod'], required: true },
    orderStatus: { 
      type: String, 
      enum: ['placed', 'confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed'
    },
    verificationCode: { 
      code: { type: String },
      generatedAt: { type: Date },
      verifiedAt: { type: Date },
      verified: { type: Boolean, default: false }
    },
    deliveryVerification: {
      required: { type: Boolean, default: true },
      verified: { type: Boolean, default: false },
      verifiedBy: { type: String },
      verifiedAt: { type: Date }
    },
    statusHistory: [{
      status: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

// Create indexes
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ farm: 1, createdAt: -1 });
orderSchema.index({ "deliverySlot.date": 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
