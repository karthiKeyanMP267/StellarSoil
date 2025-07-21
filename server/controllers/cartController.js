import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ msg: 'Insufficient stock' });
    }

    // Find or create cart for this user and farm
    let cart = await Cart.findOne({
      user: req.user.id,
      farm: product.farm
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        farm: product.farm,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity if product exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    // Populate product details
    await cart.populate('items.product');
    await cart.populate('farm', 'name');

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error adding to cart' });
  }
};

// Get user's carts
export const getCarts = async (req, res) => {
  try {
    const carts = await Cart.find({ user: req.user.id })
      .populate('items.product')
      .populate('farm', 'name');
    
    res.json(carts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching carts' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cartId, productId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({ msg: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({
      _id: cartId,
      user: req.user.id
    });

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Product not found in cart' });
    }

    // Validate stock
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({ msg: 'Insufficient stock' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate('items.product');
    await cart.populate('farm', 'name');

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error updating cart' });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await Cart.findOne({
      _id: cartId,
      user: req.user.id
    });

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    // Delete cart if empty
    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cartId);
      return res.json({ msg: 'Cart deleted' });
    }

    await cart.save();
    await cart.populate('items.product');
    await cart.populate('farm', 'name');

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error removing from cart' });
  }
};
