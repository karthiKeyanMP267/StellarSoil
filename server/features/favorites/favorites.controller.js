import Product from '../models/Product.js';
import User from '../models/User.js';

export const getFavorites = async (req, res) => {
  try {
  const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const products = await Product.find({ _id: { $in: user.favorites || [] } });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error loading favorites' });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
  const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (!user.favorites) user.favorites = [];
    const alreadyFavorited = user.favorites.some(id => id.toString() === productId.toString());
    if (!alreadyFavorited) {
      user.favorites.push(productId);
      await user.save();
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error adding favorite' });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
  const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.favorites = (user.favorites || []).filter(id => id.toString() !== productId);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error removing favorite' });
  }
};
