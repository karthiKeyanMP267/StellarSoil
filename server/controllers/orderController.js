import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryType, deliveryAddress, deliverySlot, paymentMethod } = req.body;

    // Validate and calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ msg: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ msg: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        unit: product.unit
      });

      totalAmount += product.price * item.quantity;

      // Update stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = await Order.create({
      buyer: req.user.id,
      farm: orderItems[0].product.farm, // Assuming all items are from same farm
      items: orderItems,
      totalAmount,
      deliveryType,
      deliveryAddress,
      deliverySlot,
      paymentMethod,
      statusHistory: [{ status: 'placed' }]
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating order' });
  }
};

// Get buyer's orders
export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('farm', 'name address')
      .populate('items.product', 'name price unit');
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching orders' });
  }
};

// Get farm's orders
export const getFarmOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farm: req.params.farmId })
      .populate('buyer', 'name phone')
      .populate('items.product', 'name price unit');
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching farm orders' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Verify farmer owns the farm
    if (order.farm.toString() !== req.user.farmId.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    order.orderStatus = status;
    order.statusHistory.push({ status });
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating order status' });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Only buyer can cancel order
    if (order.buyer.toString() !== req.user.id.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Can only cancel if order is not already delivered
    if (order.orderStatus === 'delivered') {
      return res.status(400).json({ msg: 'Cannot cancel delivered order' });
    }

    // Restore stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.orderStatus = 'cancelled';
    order.statusHistory.push({ status: 'cancelled' });
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Error cancelling order' });
  }
};
