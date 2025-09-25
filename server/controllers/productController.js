// Ensure we have a proper Mongoose model for Product regardless of ESM/CJS
import mongoose from 'mongoose';
// Helper to ensure we have the Product model regardless of ESM/CJS load order
const getProductModel = async () => {
  if (mongoose.models && mongoose.models.Product) return mongoose.models.Product;
  // Dynamically import ESM model if not yet registered
  const mod = await import('../models/Product.js');
  const Product = mod && mod.default ? mod.default : mod;
  return Product;
};
import Farm from '../models/Farm.js';

// Get products for the authenticated farmer
export const getMyProducts = async (req, res) => {
  try {
    const Product = await getProductModel();
    const farm = await Farm.findOne({ ownerId: req.user._id }).select('_id');
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
    const Product = await getProductModel();
    const farm = await Farm.findOne({ ownerId: req.user._id });
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
// Now considers certification score for visibility
export const getNearbyProducts = async (req, res) => {
  const { longitude, latitude, radius = 10000, minScore = 0 } = req.query; // radius in meters, minScore is minimum certification score
  try {
    const Product = await getProductModel();
    // Find farms within radius and with minimum certification score
    const farms = await Farm.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius
        }
      },
      certificationScore: { $gte: parseFloat(minScore) }
    }).sort({ certificationScore: -1 }); // Sort by certification score

    const farmIds = farms.map(farm => farm._id);
    const products = await Product.find({ farm: { $in: farmIds } })
      .populate('farm', 'name address location rating certificationScore');

    // Attach the farm's certification score to each product for client-side sorting
    const productsWithScores = products.map(product => {
      const farmData = product.farm.toObject();
      return {
        ...product.toObject(),
        farmCertificationScore: farmData.certificationScore || 0
      };
    });

    res.json(productsWithScores);
  } catch (err) {
    console.error('Get nearby products error:', err);
    res.status(500).json({ 
      msg: 'Error fetching nearby products', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Search products
// Enhanced with certification score filtering and sorting
const searchProducts = async (req, res) => {
  const { 
    query, 
    category, 
    minPrice, 
    maxPrice, 
    isOrganic, 
    minCertScore = 0, 
    sortByCertScore = false 
  } = req.query;
  
  try {
    const Product = await getProductModel();
    // First find farms that meet certification criteria
    const farmQuery = {};
    if (minCertScore > 0) {
      farmQuery.certificationScore = { $gte: parseFloat(minCertScore) };
    }
    
    // Find qualified farms
    const farms = await Farm.find(farmQuery)
      .sort(sortByCertScore ? { certificationScore: -1 } : {});
    
    const farmIds = farms.map(farm => farm._id);
    
    // Product search query
    let searchQuery = { farm: { $in: farmIds } };

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
      .populate('farm', 'name address location rating certificationScore');

    // Construct a farm map for faster lookups
    const farmMap = {};
    farms.forEach(farm => {
      farmMap[farm._id.toString()] = farm;
    });

    // Attach the farm's certification score to each product
    const productsWithScores = products.map(product => {
      const farm = farmMap[product.farm._id.toString()];
      return {
        ...product.toObject(),
        farmCertificationScore: farm ? farm.certificationScore || 0 : 0
      };
    });

    // If sorting by certification score is requested, sort the results
    if (sortByCertScore === 'true') {
      productsWithScores.sort((a, b) => b.farmCertificationScore - a.farmCertificationScore);
    }

    res.json(productsWithScores);
  } catch (err) {
    console.error('Search products error:', err);
    res.status(500).json({ 
      msg: 'Error searching products', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const Product = await getProductModel();
    const farm = await Farm.findOne({ ownerId: req.user._id });
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
const deleteProduct = async (req, res) => {
  try {
    const Product = await getProductModel();
    const farm = await Farm.findOne({ ownerId: req.user._id });
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
const uploadProductImages = async (req, res) => {
  try {
    const Product = await getProductModel();
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'No files uploaded' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Verify farm ownership
    const farm = await Farm.findOne({ ownerId: req.user._id });
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
const deleteProductImage = async (req, res) => {
  try {
    const Product = await getProductModel();
    const { imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Verify farm ownership
    const farm = await Farm.findOne({ ownerId: req.user._id });
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

/**
 * Get top certified products
 * Returns products from farms with highest certification scores
 */
// Get top certified products function
const getTopCertifiedProducts = async (req, res) => {
  try {
    const Product = await getProductModel();
    const { limit = 10, category } = req.query;
    
    // Find farms with high certification scores
    const highScoredFarms = await Farm.find({
      certificationScore: { $gt: 70 } // Only farms with good certification scores
    })
    .sort({ certificationScore: -1 })
    .limit(20); // Get more farms than needed
    
    const farmIds = highScoredFarms.map(farm => farm._id);
    
    // Build product query
    let productQuery = { farm: { $in: farmIds } };
    if (category) {
      productQuery.category = category;
    }
    
    // Find products from those farms
    const products = await Product.find(productQuery)
      .populate('farm', 'name address rating certificationScore')
      .limit(parseInt(limit));
      
    // Attach certification scores
    const productsWithScores = products.map(product => {
      return {
        ...product.toObject(),
        farmCertificationScore: product.farm.certificationScore || 0
      };
    });
    
    // Sort by certification score
    productsWithScores.sort((a, b) => b.farmCertificationScore - a.farmCertificationScore);
    
    res.json(productsWithScores);
  } catch (err) {
    console.error('Get top certified products error:', err);
    res.status(500).json({
      msg: 'Error fetching top certified products',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Export as module
// ...existing code...
export {
 
 
  searchProducts,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  getTopCertifiedProducts
};
