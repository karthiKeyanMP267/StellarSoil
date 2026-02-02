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
import governmentPriceService from '../services/governmentPriceService.js';
import mlPriceService from '../services/mlPriceService.js';

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

    // Get government price and ML prediction for the product
    const govPrice = await governmentPriceService.getPrice(req.body.name);
    const predictedPrice = await mlPriceService.predictPrice(req.body.name);

    const product = await Product.create({
      ...req.body,
      farm: farm._id,
      governmentPrice: govPrice?.modalPrice || null,
      predictedPrice: predictedPrice || null
    });

    // Record price for future ML predictions
    await mlPriceService.recordPrice(product._id, product.name, product.price, product.quantity);

    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ 
      msg: 'Error creating product', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

/**
 * Get products by location - CORRECT IMPLEMENTATION
 * Uses MongoDB $geoNear for efficient geo-spatial querying
 * Distance is a FILTER, not a feature - computed by MongoDB
 */
export const getNearbyProducts = async (req, res) => {
  const { 
    longitude, 
    latitude, 
    radius = 10, // radius in kilometers
    minScore = 0, 
    query = '',
    limit = 20 
  } = req.query;
  
  try {
    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const maxDistanceKm = parseFloat(radius);
    
    if (isNaN(lng) || isNaN(lat)) {
      return res.status(400).json({ msg: 'Valid longitude and latitude required' });
    }
    
    // If user is a farmer, get their farm ID to exclude
    let excludeFarmId = null;
    if (req.user && req.user.role === 'farmer') {
      const ownFarm = await Farm.findOne({ ownerId: req.user._id }).select('_id');
      if (ownFarm) {
        excludeFarmId = ownFarm._id;
      }
    }
    
    // Step 1: Find farms near user using $geoNear (MUST be first stage)
    const pipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng, lat] // [longitude, latitude]
          },
          distanceField: 'distance', // MongoDB computes this
          maxDistance: maxDistanceKm * 1000, // Convert km to meters
          spherical: true,
          key: 'location',
          // Exclude farmer's own farm
          query: excludeFarmId ? { _id: { $ne: excludeFarmId } } : {}
        }
      },
      // Step 2: Lookup products for each farm
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'farm',
          as: 'products'
        }
      },
      // Step 3: Filter products by name if query provided
      {
        $addFields: {
          products: {
            $filter: {
              input: '$products',
              as: 'product',
              cond: {
                $and: [
                  { $eq: ['$$product.isActive', true] },
                  query && query.trim() !== '' 
                    ? { $regexMatch: { input: '$$product.name', regex: query, options: 'i' } }
                    : true
                ]
              }
            }
          }
        }
      },
      // Step 4: Only keep farms that have matching products
      {
        $match: {
          'products.0': { $exists: true },
          certificationScore: { $gte: parseFloat(minScore) }
        }
      },
      // Step 5: Compute certification score in DB (not application)
      {
        $addFields: {
          // Certification score ranking formula: score - (distance / 100)
          // Better certifications rank higher, closer farms rank higher
          finalScore: {
            $subtract: [
              { $ifNull: ['$certificationScore', 0] },
              { $divide: ['$distance', 100] }
            ]
          },
          // Convert distance from meters to km
          distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 1] }
        }
      },
      // Step 6: Sort by finalScore (DESC) - best certified closest farms first
      {
        $sort: { finalScore: -1 }
      },
      // Step 7: Limit to top N farms
      {
        $limit: parseInt(limit) || 20
      },
      // Step 8: Unwind products for flat list
      {
        $unwind: '$products'
      },
      // Step 9: Project final structure
      {
        $project: {
          _id: '$products._id',
          name: '$products.name',
          category: '$products.category',
          description: '$products.description',
          price: '$products.price',
          unit: '$products.unit',
          quantity: '$products.quantity',
          images: '$products.images',
          isOrganic: '$products.isOrganic',
          rating: '$products.rating',
          tags: '$products.tags',
          distanceKm: 1,
          finalScore: { $round: ['$finalScore', 2] },
          farm: {
            _id: '$_id',
            name: '$name',
            address: '$address',
            location: '$location',
            certificationScore: '$certificationScore',
            certifications: '$certifications',
            rating: '$rating'
          }
        }
      }
    ];
    
    const products = await Farm.aggregate(pipeline);
    
    res.json({
      count: products.length,
      radius: maxDistanceKm,
      userLocation: { longitude: lng, latitude: lat },
      products
    });
    
  } catch (err) {
    console.error('Get nearby products error:', err);
    res.status(500).json({ 
      msg: 'Error fetching nearby products', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Search products
// Product-first search with filtering and certification scoring
const searchProducts = async (req, res) => {
  const { 
    query, 
    category, 
    minPrice, 
    maxPrice, 
    isOrganic, 
    minCertScore = 0,
    latitude,
    longitude,
    radius,
    sortBy = 'distance' // 'distance', 'certScore', 'price'
  } = req.query;
  
  try {
    const Product = await getProductModel();
    
    // If user is a farmer, exclude their own products
    let excludeFarmId = null;
    if (req.user && req.user.role === 'farmer') {
      const ownFarm = await Farm.findOne({ ownerId: req.user._id }).select('_id');
      if (ownFarm) {
        excludeFarmId = ownFarm._id;
      }
    }
    
    // Build product match query
    const matchQuery = { isActive: true };
    
    // Exclude farmer's own products
    if (excludeFarmId) {
      matchQuery.farm = { $ne: excludeFarmId };
    }
    
    if (query && query.trim() !== '') {
      matchQuery.name = { $regex: query, $options: 'i' };
    }
    
    if (category && category.trim() !== '') {
      matchQuery.category = { $regex: `^${category}$`, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      matchQuery.price = {};
      if (minPrice) matchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) matchQuery.price.$lte = parseFloat(maxPrice);
    }
    
    if (isOrganic !== undefined && isOrganic !== '') {
      matchQuery.isOrganic = isOrganic === 'true';
    }
    
    // Build aggregation pipeline
    const pipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: 'farms',
          localField: 'farm',
          foreignField: '_id',
          as: 'farmData'
        }
      },
      { $unwind: '$farmData' },
      {
        $match: {
          'farmData.certificationScore': { $gte: parseFloat(minCertScore) }
        }
      }
    ];
    
    // Add distance calculation if location provided
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      
      pipeline.push({
        $addFields: {
          distance: {
            $let: {
              vars: {
                farmLng: { $arrayElemAt: ['$farmData.location.coordinates', 0] },
                farmLat: { $arrayElemAt: ['$farmData.location.coordinates', 1] },
                userLat: lat,
                userLng: lng
              },
              in: {
                $multiply: [
                  6371000,
                  {
                    $acos: {
                      $max: [
                        -1,
                        {
                          $min: [
                            1,
                            {
                              $add: [
                                {
                                  $multiply: [
                                    { $sin: { $multiply: [{ $degreesToRadians: '$$userLat' }] } },
                                    { $sin: { $multiply: [{ $degreesToRadians: '$$farmLat' }] } }
                                  ]
                                },
                                {
                                  $multiply: [
                                    { $cos: { $multiply: [{ $degreesToRadians: '$$userLat' }] } },
                                    { $cos: { $multiply: [{ $degreesToRadians: '$$farmLat' }] } },
                                    { $cos: { $multiply: [{ $degreesToRadians: { $subtract: ['$$farmLng', '$$userLng'] } }] } }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      });
      
      // Filter by radius if provided
      if (radius) {
        pipeline.push({
          $match: { distance: { $lte: parseFloat(radius) } }
        });
      }
    }
    
    // Sort based on preference
    const sortStage = {};
    if (sortBy === 'certScore') {
      sortStage['farmData.certificationScore'] = -1;
    } else if (sortBy === 'price') {
      sortStage.price = 1;
    } else if (latitude && longitude) {
      sortStage.distance = 1; // Default: sort by distance
    } else {
      sortStage.createdAt = -1; // No location: sort by newest
    }
    pipeline.push({ $sort: sortStage });
    
    // Project final structure
    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        category: 1,
        description: 1,
        price: 1,
        unit: 1,
        stock: 1,
        quantity: 1,
        predictedPrice: 1,
        governmentPrice: 1,
        images: 1,
        isOrganic: 1,
        isActive: 1,
        rating: 1,
        tags: 1,
        createdAt: 1,
        distance: latitude && longitude ? { $round: ['$distance', 0] } : { $literal: null },
        farm: {
          _id: '$farmData._id',
          name: '$farmData.name',
          address: '$farmData.address',
          location: '$farmData.location',
          certificationScore: '$farmData.certificationScore',
          certifications: '$farmData.certifications',
          rating: '$farmData.rating'
        }
      }
    });
    
    const products = await Product.aggregate(pipeline);
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

// Get price recommendation for a product
export const getPriceRecommendation = async (req, res) => {
  try {
    const { commodity, currentPrice } = req.query;
    
    if (!commodity || !currentPrice) {
      return res.status(400).json({ msg: 'Commodity and current price are required' });
    }

    const recommendation = await mlPriceService.getSellingRecommendation(
      commodity, 
      parseFloat(currentPrice)
    );

    if (!recommendation) {
      return res.status(404).json({ msg: 'Unable to generate recommendation' });
    }

    res.json(recommendation);
  } catch (err) {
    console.error('Get price recommendation error:', err);
    res.status(500).json({
      msg: 'Error getting price recommendation',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get government price for a commodity
export const getGovernmentPrice = async (req, res) => {
  try {
    const { commodity, state, district } = req.query;
    
    if (!commodity) {
      return res.status(400).json({ msg: 'Commodity is required' });
    }

    const govPrice = await governmentPriceService.getPrice(commodity, state, district);

    if (!govPrice) {
      return res.status(404).json({ msg: 'No government price data available' });
    }

    res.json(govPrice);
  } catch (err) {
    console.error('Get government price error:', err);
    res.status(500).json({
      msg: 'Error fetching government price',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get price trend for a commodity
export const getPriceTrend = async (req, res) => {
  try {
    const { commodity, days = 30 } = req.query;
    
    if (!commodity) {
      return res.status(400).json({ msg: 'Commodity is required' });
    }

    const trend = await mlPriceService.getPriceTrend(commodity, parseInt(days));
    res.json(trend);
  } catch (err) {
    console.error('Get price trend error:', err);
    res.status(500).json({
      msg: 'Error fetching price trend',
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
