import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Farm from '../models/Farm.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import { generateAlphanumericOTP, isOTPExpired } from '../utils/otpGenerator.js';
import notificationService from '../services/notificationService.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { 
      items, 
      deliveryType, 
      deliveryAddress, 
      deliverySlot, 
      paymentMethod, 
      discountCode 
    } = req.body;

    // Validate items, group by farm, and calculate totals
    const groups = new Map(); // farmId -> { items: [], subtotal: number }
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ msg: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ msg: `Insufficient stock for ${product.name}` });
      }

      const farmKey = product.farm.toString();
      if (!groups.has(farmKey)) {
        groups.set(farmKey, { items: [], subtotal: 0 });
      }
      const g = groups.get(farmKey);
      g.items.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        unit: product.unit
      });
      g.subtotal += product.price * item.quantity;

      // Update stock immediately (simple approach; for production, use transactions)
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }

    // Compute overall discount once
    let overallSubtotal = 0;
    for (const [, g] of groups) overallSubtotal += g.subtotal;
    let overallDiscount = 0;
    if (discountCode) {
      if (discountCode === 'WELCOME10') overallDiscount = overallSubtotal * 0.1;
      else if (discountCode === 'FARM20') overallDiscount = overallSubtotal * 0.2;
      overallDiscount = Math.min(overallDiscount, 500);
    }

    // For COD orders, prepare per-order verification
    const isCOD = paymentMethod === 'cod';

    // Debug information to help diagnose the issue
    console.log('Creating order with buyer:', {
      userId: req.user?._id,
      userIdType: typeof req.user?._id,
      userIdString: req.user?._id?.toString(),
      userObj: JSON.stringify(req.user),
      authHeader: req.headers.authorization ? 'Present' : 'Missing'
    });
    
    // Create one order per farm group
    const ordersCreated = [];
    for (const [farmKey, g] of groups) {
      let farmerId = null;
      try {
        // Prefer ownerId; fall back to legacy owner if present
        const farmDoc = await Farm.findById(farmKey).select('ownerId owner');
        farmerId = farmDoc?.ownerId || farmDoc?.owner || null;
      } catch (e) {
        console.warn('Failed to resolve farm owner for order:', e?.message);
      }

      // Allocate proportional discount
      const proportionalDiscount = overallSubtotal > 0
        ? Math.round((g.subtotal / overallSubtotal) * overallDiscount)
        : 0;

      const verificationCode = isCOD
        ? { code: generateAlphanumericOTP(6), generatedAt: new Date(), verified: false }
        : null;

      const order = await Order.create({
        buyer: req.user._id,
        farm: farmKey,
        farmer: farmerId || undefined,
        items: g.items,
        totalAmount: g.subtotal,
        discount: proportionalDiscount,
        discountCode: proportionalDiscount > 0 ? discountCode : null,
        deliveryType,
        deliveryAddress,
        deliverySlot,
        paymentMethod,
        verificationCode,
        deliveryVerification: {
          required: isCOD,
          verified: false
        },
        statusHistory: [{ status: 'placed' }]
      });

      // Notify buyer with verification code if COD
      if (isCOD && verificationCode) {
        try {
          await notificationService.sendVerificationCodeNotification(
            req.user._id,
            order._id,
            verificationCode.code
          );
        } catch (notifError) {
          console.error('Failed to send verification code notification:', notifError);
        }
      }

      // Notify farmer of the order
      try {
        const farm = await Farm.findById(farmKey).populate('ownerId');
        const buyer = await User.findById(req.user._id);
        const farmerOwner = farm?.ownerId || farm?.owner; // support legacy data
        if (farm && farmerOwner) {
          await notificationService.sendFarmerOrderNotification(
            farmerOwner._id || farmerOwner,
            order._id,
            buyer?.name,
            g.subtotal,
            deliveryAddress
          );
        }
      } catch (notifError) {
        console.error('Failed to send farmer notification:', notifError);
      }

      ordersCreated.push(order);
    }
    
    // Clear the user's cart after successful order creation
    try {
      // Get cart IDs from the request, fallback to finding by user ID
      const cartIds = req.body.cartIds || [];
      
      if (cartIds.length > 0) {
        // Delete specific carts if IDs provided
        await Cart.deleteMany({ _id: { $in: cartIds } });
        console.log(`Cleared ${cartIds.length} specific carts after order creation`);
      } else {
        // Delete all carts for this user
        const result = await Cart.deleteMany({ user: req.user._id });
        console.log(`Cleared ${result.deletedCount} carts for user after order creation`);
      }
    } catch (cartError) {
      console.error('Failed to clear cart after order creation:', cartError);
      // Continue anyway as the order was created successfully
    }
    
    // Respond: single object for one order, multi payload otherwise
    if (ordersCreated.length === 1) {
      return res.status(201).json(ordersCreated[0]);
    }
    return res.status(201).json({ multi: true, orders: ordersCreated });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ msg: 'Error creating order' });
  }
};

// Get buyer's orders
export const getBuyerOrders = async (req, res) => {
  try {
    // Use req.user._id instead of req.user.id to match MongoDB ObjectId format
    const orders = await Order.find({ buyer: req.user._id })
      .populate('farm', 'name address contactPhone')
      .populate('items.product', 'name price unit image')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    console.log(`Fetched ${orders.length} orders for user ${req.user._id}`);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching buyer orders:', err);
    res.status(500).json({ msg: 'Error fetching orders' });
  }
};

// Get farm's orders
export const getFarmOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farm: req.params.farmId })
      .populate('buyer', 'name phone email')
      .populate('items.product', 'name price unit image')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching farm orders:', err);
    res.status(500).json({ 
      msg: 'Error fetching farm orders',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Get single order by ID (buyer, farmer owner, or admin only)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('farm', 'name address contactPhone')
      .populate('items.product', 'name price unit image');

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    const isBuyer = order.buyer?.toString() === req.user._id?.toString();
    let isFarmer = false;
    if (req.user.role === 'farmer') {
      if (order.farmer) {
        isFarmer = order.farmer.toString() === req.user._id.toString();
      } else {
        // Farm schema uses ownerId
        const farm = await Farm.findById(order.farm).select('ownerId');
        isFarmer = !!farm && farm.ownerId?.toString() === req.user._id.toString();
      }
    }
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isFarmer && !isAdmin) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error fetching order by id:', err);
    res.status(500).json({ msg: 'Error fetching order' });
  }
};

// Get farmer's orders with detailed information
export const getFarmerOrders = async (req, res) => {
  try {
    // Prefer denormalized query by farmer for performance & robustness
    const directOrders = await Order.find({ farmer: req.user._id })
      .populate('buyer', 'name phone email')
      .populate('items.product', 'name price unit image')
      .sort({ createdAt: -1 }); // Sort by newest first

    if (directOrders.length > 0) {
      return res.json(directOrders);
    }

    // Fallback for legacy orders without the farmer field
  // Farms may have ownerId (new) or owner (legacy)
  const farms = await Farm.find({ $or: [ { ownerId: req.user._id }, { owner: req.user._id } ] }).select('_id');
    const farmIds = farms.map(f => f._id);
    const fallbackOrders = farmIds.length
      ? await Order.find({ farm: { $in: farmIds } })
          .populate('buyer', 'name phone email')
          .populate('items.product', 'name price unit image')
          .sort({ createdAt: -1 })
      : [];

    res.json(fallbackOrders);
  } catch (err) {
    console.error('Error fetching farmer orders:', err);
    res.status(500).json({ msg: 'Error fetching farmer orders' });
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

    // Authorization: allow admin, the denormalized farmer owner, or any user whose farmId matches
    const isAdmin = req.user.role === 'admin';
    const isDenormalizedOwner = order.farmer && order.farmer.toString() === req.user._id.toString();
    const sameFarmUser = req.user.farmId && order.farm && order.farm.toString() === req.user.farmId.toString();

    let isFarmOwner = false;
    if (!isAdmin && !isDenormalizedOwner && !sameFarmUser) {
      // Fallback to checking actual farm owner against current user
      const farm = await Farm.findById(order.farm).select('ownerId');
      isFarmOwner = !!farm && farm.ownerId?.toString() === req.user._id.toString();
    }

    if (!(isAdmin || isDenormalizedOwner || sameFarmUser || isFarmOwner)) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Enforce COD flow: cannot mark delivered via status update unless verified
    if (status === 'delivered' && order.paymentMethod === 'cod' && !order?.deliveryVerification?.verified) {
      return res.status(400).json({ msg: 'COD orders must be verified with the code before marking as delivered' });
    }

    order.orderStatus = status;
    order.statusHistory.push({ status });
    await order.save();

    // Send notification to user when order status changes to "ready"
    if (status === 'ready') {
      try {
        await notificationService.sendOrderNotification(
          order.buyer,
          order._id,
          'ready',
          `Your order is ready! ${order.deliveryType === 'pickup' ? 'You can now pick it up from the farm.' : 'It will be out for delivery soon.'}`,
          {
            orderId: order._id,
            deliveryType: order.deliveryType,
            totalAmount: order.totalAmount
          }
        );
      } catch (notifError) {
        console.error('Failed to send ready notification:', notifError);
        // Don't fail the request if notification fails
      }
    }

    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ 
      msg: 'Error updating order status',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
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
    if (order.buyer.toString() !== req.user._id.toString()) {
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
    console.error('Error cancelling order:', err);
    res.status(500).json({ 
      msg: 'Error cancelling order',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Verify order delivery using OTP/verification code
export const verifyOrderDelivery = async (req, res) => {
  try {
    const { orderId, verificationCode } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Authorization: buyer can verify their own order; farmer/admin can verify if they own/operate the farm
    const isBuyer = order.buyer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isDenormalizedOwner = order.farmer && order.farmer.toString() === req.user._id.toString();
    const sameFarmUser = req.user.farmId && order.farm && order.farm.toString() === req.user.farmId.toString();
    let isFarmOwner = false;
    if (!isAdmin && !isDenormalizedOwner && !sameFarmUser && req.user.role === 'farmer') {
      const farm = await Farm.findById(order.farm).select('ownerId');
      isFarmOwner = !!farm && farm.ownerId?.toString() === req.user._id.toString();
    }

    const isAuthorized = isBuyer || isAdmin || isDenormalizedOwner || sameFarmUser || isFarmOwner;
    if (!isAuthorized) {
      return res.status(403).json({ msg: 'Not authorized to verify this order' });
    }

    // Check if order requires verification
    if (!order.deliveryVerification.required) {
      return res.status(400).json({ msg: 'This order does not require verification' });
    }

    // Check if order is already verified
    if (order.deliveryVerification.verified) {
      return res.status(400).json({ msg: 'This order is already verified' });
    }

    // Check if order is in a state that can be verified
    if (!['out_for_delivery', 'ready'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        msg: 'This order cannot be verified in its current state',
        currentStatus: order.orderStatus
      });
    }

    // Verify the code
    if (!order.verificationCode || order.verificationCode.code !== verificationCode) {
      return res.status(400).json({ msg: 'Invalid verification code' });
    }
    
    // Check if the verification code has already been used
    if (order.verificationCode.verified) {
      return res.status(400).json({ msg: 'This verification code has already been used and cannot be reused' });
    }

    // Check if code is expired (30 minutes)
    if (isOTPExpired(order.verificationCode.generatedAt)) {
      return res.status(400).json({ msg: 'Verification code has expired' });
    }

    // Update order verification status
    order.verificationCode.verified = true;
    order.verificationCode.verifiedAt = new Date();
    order.deliveryVerification.verified = true;
    order.deliveryVerification.verifiedBy = req.user.role;
    order.deliveryVerification.verifiedAt = new Date();
    order.orderStatus = 'delivered';
    order.statusHistory.push({ status: 'delivered' });
    
    // If it was a COD order, also mark it as paid
    if (order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    // Send confirmation notification to the user
    try {
      await sendNotification(order.buyer, {
        type: 'order_delivered',
        title: 'Order Delivered Successfully',
        message: `Your order #${order._id.toString().slice(-6)} has been delivered and verified.`,
        data: { orderId: order._id }
      });
    } catch (notifError) {
      console.error('Failed to send delivery notification:', notifError);
    }

    res.json({
      success: true,
      order: {
        _id: order._id,
        status: order.orderStatus,
        verificationStatus: order.deliveryVerification
      },
      msg: 'Order verified and marked as delivered'
    });
  } catch (err) {
    console.error('Error verifying order:', err);
    res.status(500).json({ msg: 'Error verifying order' });
  }
};

// Regenerate verification code for an order
export const regenerateVerificationCode = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Only the buyer or farm owner can regenerate codes
    const isBuyer = order.buyer.toString() === req.user._id.toString();
  const isFarmer = req.user.role === 'farmer' && order.farm.toString() === req.user.farmId?.toString();
    
    if (!isBuyer && !isFarmer) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Check if order requires verification
    if (!order.deliveryVerification.required) {
      return res.status(400).json({ msg: 'This order does not require verification' });
    }

    // Check if order is already verified
    if (order.deliveryVerification.verified) {
      return res.status(400).json({ msg: 'This order is already verified' });
    }

    // Check if order is in a state that can be verified
    if (!['out_for_delivery', 'ready', 'processing'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        msg: 'Cannot regenerate verification code for this order in its current state',
        currentStatus: order.orderStatus
      });
    }

    // Generate a new code
    const code = generateAlphanumericOTP(6);
    order.verificationCode = {
      code,
      generatedAt: new Date(),
      verified: false
    };

    await order.save();

    // Send notification to the user with the new code
    try {
      await sendNotification(order.buyer, {
        type: 'order_verification',
        title: 'New Verification Code',
        message: `Your new verification code for order #${order._id.toString().slice(-6)} is: ${code}. Please show this to the delivery person.`,
        data: {
          orderId: order._id,
          code
        }
      });
    } catch (notifError) {
      console.error('Failed to send new verification code notification:', notifError);
    }

    res.json({
      success: true,
      msg: 'New verification code generated',
      // Only return the code to the buyer, not to the farmer
      code: isBuyer ? code : undefined
    });
  } catch (err) {
    console.error('Error regenerating verification code:', err);
    res.status(500).json({ msg: 'Error regenerating verification code' });
  }
};

// Update delivery address
export const updateDeliveryAddress = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryAddress } = req.body;
    
    if (!deliveryAddress) {
      return res.status(400).json({ msg: 'Delivery address is required' });
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Only allow address updates for orders that aren't delivered or cancelled
    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ msg: 'Cannot update address for completed orders' });
    }
    
    // Update the address
    order.deliveryAddress = deliveryAddress;
    await order.save();
    
    // Send notification to buyer about address change
    try {
      await notificationService.sendNotification({
        recipient: order.user,
        type: 'address_update',
        title: 'Delivery Address Updated',
        content: 'Your order delivery address has been updated.',
        data: {
          orderId: order._id
        }
      });
    } catch (notifError) {
      console.error('Failed to send address update notification:', notifError);
    }
    
    res.json({
      success: true,
      msg: 'Delivery address updated',
      order
    });
  } catch (err) {
    console.error('Error updating delivery address:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
