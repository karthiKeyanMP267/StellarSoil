import { createPaymentOrder, verifyPaymentSignature } from '../utils/payment.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// Initialize payment
export const initializePayment = async (req, res) => {
  try {
    const { cartId } = req.body;
    
    // Get cart and validate
    const cart = await Cart.findOne({
      _id: cartId,
      user: req.user.id
    }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );

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

    // Get cart
    const cart = await Cart.findOne({
      _id: cartId,
      user: req.user.id
    }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    // Create order
    const order = await Order.create({
      buyer: req.user.id,
      farm: cart.farm,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        unit: item.product.unit
      })),
      totalAmount: cart.items.reduce(
        (sum, item) => sum + (item.product.price * item.quantity),
        0
      ),
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

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Delete cart after successful order
    await Cart.findByIdAndDelete(cartId);

    res.json(order);
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
