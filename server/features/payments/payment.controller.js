import { createPaymentOrder, verifyPaymentSignature } from '../utils/payment.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Farm from '../models/Farm.js';

// Initialize payment
export const initializePayment = async (req, res) => {
  try {
    const { cartId, cartIds } = req.body;

    let carts = [];
    if (Array.isArray(cartIds) && cartIds.length > 0) {
      carts = await Cart.find({ _id: { $in: cartIds }, user: req.user._id }).populate('items.product');
    } else if (cartId) {
      const one = await Cart.findOne({ _id: cartId, user: req.user._id }).populate('items.product');
      if (one) carts = [one];
    } else {
      // Fallback: use all carts for this user
      carts = await Cart.find({ user: req.user._id }).populate('items.product');
    }

    if (!carts || carts.length === 0) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const totalAmount = carts.reduce((acc, c) => (
      acc + c.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    ), 0);

    // Create Razorpay order
    const order = await createPaymentOrder(totalAmount);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error initializing payment' });
  }
};

// Verify payment and create order
export const verifyPayment = async (req, res) => {
  try {
    const {
      cartId,
      cartIds,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      deliveryAddress,
      deliveryType,
      deliverySlot
    } = req.body;

    // Verify payment signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ msg: 'Invalid payment signature' });
    }

    // Get carts
    let carts = [];
    if (Array.isArray(cartIds) && cartIds.length > 0) {
      carts = await Cart.find({ _id: { $in: cartIds }, user: req.user._id }).populate('items.product');
    } else if (cartId) {
      const one = await Cart.findOne({ _id: cartId, user: req.user._id }).populate('items.product');
      if (one) carts = [one];
    } else {
      carts = await Cart.find({ user: req.user._id }).populate('items.product');
    }

    if (!carts || carts.length === 0) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    // Group cart items by farm
    const groups = new Map();
    for (const cart of carts) {
      for (const item of cart.items) {
        const farmKey = item.product.farm.toString();
        if (!groups.has(farmKey)) groups.set(farmKey, { items: [], subtotal: 0 });
        const g = groups.get(farmKey);
        g.items.push({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          unit: item.product.unit
        });
        g.subtotal += item.product.price * item.quantity;
      }
    }

    // Create one order per farm
    const orders = [];
    for (const [farmKey, g] of groups) {
      let farmerId = null;
      try {
        const farmDoc = await Farm.findById(farmKey).select('owner');
        farmerId = farmDoc?.owner || null;
      } catch {}

      const order = await Order.create({
        buyer: req.user._id,
        farm: farmKey,
        farmer: farmerId || undefined,
        items: g.items,
        totalAmount: g.subtotal,
        deliveryAddress,
        deliveryType,
        deliverySlot,
        paymentStatus: 'paid',
        paymentMethod: 'online',
        orderStatus: 'confirmed',
        statusHistory: [{ status: 'confirmed' }],
        paymentDetails: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature
        }
      });
      orders.push(order);
    }

    // Update product stock
    for (const cart of carts) {
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    // Delete cart(s) after successful order(s)
    if (Array.isArray(cartIds) && cartIds.length > 0) {
      await Cart.deleteMany({ _id: { $in: cartIds } });
    } else if (cartId) {
      await Cart.findByIdAndDelete(cartId);
    } else {
      await Cart.deleteMany({ user: req.user._id });
    }

    if (orders.length === 1) return res.json(orders[0]);
    return res.json({ multi: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error verifying payment' });
  }
};

// Handle UPI payment status
export const handleUPIStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (status === 'success') {
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.statusHistory.push({ status: 'confirmed' });
    } else {
      order.paymentStatus = 'failed';
      order.orderStatus = 'cancelled';
      order.statusHistory.push({ status: 'cancelled' });
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error updating UPI payment status' });
  }
};
