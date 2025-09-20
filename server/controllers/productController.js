import Product from '../models/Product.js';
import Farm from '../models/Farm.js';

// Get products for the authenticated farmer
export const getMyProducts = async (req, res) => {
  try {
    const farm = await Farm.findOne({ owner: req.user._id }).select('_id');
    if (!farm) {
      return res.json([]);
    }
    const products = await Product.find({ farm: farm._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Get my products error:', err);
    res.status(500).json({ msg: 'Error fetching products' });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const farm = await Farm.findOne({ owner: req.user._id });
    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    const product = await Product.create({
      ...req.body,
      farm: farm._id
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ 
      msg: 'Error creating product', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Get products by location and radius
export const getNearbyProducts = async (req, res) => {
  const { longitude, latitude, radius = 10000 } = req.query; // radius in meters
  try {
    const farms = await Farm.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius
        }
      }
    });

    const farmIds = farms.map(farm => farm._id);
    const products = await Product.find({ farm: { $in: farmIds } })
      .populate('farm', 'name address location rating');

    res.json(products);
  } catch (err) {
    console.error('Get nearby products error:', err);
    res.status(500).json({ 
      msg: 'Error fetching nearby products', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Search products
export const searchProducts = async (req, res) => {

  const { query, category, minPrice, maxPrice, isOrganic } = req.query;
  try {
    let searchQuery = {};

    if (query && query.trim() !== '') {
      searchQuery.name = { $regex: query, $options: 'i' };
    }

    if (category && category.trim() !== '') {
      searchQuery.category = { $regex: `^${category}$`, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
    }

    if (isOrganic !== undefined && isOrganic !== '') {
      searchQuery.isOrganic = isOrganic === 'true';
    }

    const products = await Product.find(searchQuery)
      .populate('farm', 'name address location rating');

    res.json(products);
  } catch (err) {
    console.error('Search products error:', err);
    res.status(500).json({ 
      msg: 'Error searching products', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const farm = await Farm.findOne({ owner: req.user._id });
    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, farm: farm._id },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ msg: 'Product not found or unauthorized' });
    }

    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ 
      msg: 'Error updating product', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const farm = await Farm.findOne({ owner: req.user._id });
    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      farm: farm._id
    });

    if (!product) {
      return res.status(404).json({ msg: 'Product not found or unauthorized' });
    }

    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ 
      msg: 'Error deleting product', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Upload product images
export const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'No files uploaded' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Verify farm ownership
    const farm = await Farm.findOne({ owner: req.user._id });
    if (!farm || farm._id.toString() !== product.farm.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Add new image paths to product
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    product.images = [...product.images, ...imagePaths];

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error uploading images' });
  }
};

// Delete product image
export const deleteProductImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Verify farm ownership
    const farm = await Farm.findOne({ owner: req.user._id });
    if (!farm || farm._id.toString() !== product.farm.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    product.images = product.images.filter(img => img !== imageUrl);
    await product.save();
    
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error deleting image' });
  }
};
