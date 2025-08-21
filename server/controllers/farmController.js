// Get farm stats
// ...existing code...
export const getFarmStats = async (req, res) => {
  try {
    const totalFarms = await Farm.countDocuments();
    const farms = await Farm.find({}, 'rating');
    const avgRating = farms.length > 0 ? (farms.reduce((sum, f) => sum + (f.rating || 0), 0) / farms.length) : 0;
    res.json({ totalFarms, avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching farm stats' });
  }
};
import Farm from '../models/Farm.js';
import User from '../models/User.js';

// Get farm profile
export const getFarmProfile = async (req, res) => {
  try {
    const farm = await Farm.findOne({ owner: req.user.id })
      .populate('owner', 'name email phone');
    
    if (!farm) {
      return res.status(404).json({ msg: 'Farm profile not found' });
    }

    res.json(farm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching farm profile' });
  }
};

// Update farm profile
export const updateFarmProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    const {
      farmName,
      farmType,
      description,
      location,
      address,
      contactPhone,
      specialties,
      certifications,
      images
    } = req.body;

    let farm = await Farm.findOne({ owner: req.user.id });
    
    const farmData = {
      owner: req.user.id, // Explicitly set the owner
      name: farmName,
      type: farmType,
      description,
      location,
      address,
      contactPhone,
      specialties,
      certifications,
      images: images || []
    };

    if (!farm) {
      // Create new farm if it doesn't exist
      farm = new Farm(farmData);
    } else {
      // Update existing farm
      farm.name = farmName;
      farm.type = farmType;
      farm.description = description;
      farm.location = location;
      farm.address = address;
      farm.contactPhone = contactPhone;
      farm.specialties = specialties;
      farm.certifications = certifications;
      farm.owner = req.user.id; // Ensure owner is set
      if (images) {
        farm.images = images;
      }
    }

    const updatedFarm = await farm.save();
    
    // Update user's farmName if it's different
    if (req.user.farmName !== farmName) {
      await User.findByIdAndUpdate(req.user.id, { farmName });
    }

    res.json({
      msg: 'Farm profile updated successfully',
      farm: updatedFarm
    });
  } catch (err) {
    console.error('Farm profile update error:', err);
    res.status(500).json({ msg: 'Error updating farm profile: ' + err.message });
  }
};

// Farm image upload handler
export const uploadFarmImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'No files uploaded' });
    }

    const farm = await Farm.findOne({ owner: req.user.id });
    if (!farm) {
      return res.status(404).json({ msg: 'Farm profile not found' });
    }

    // Get file paths
    const imagePaths = req.files.map(file => file.path.replace(/\\/g, '/'));

    // Add new images to farm's images array
    farm.images = [...farm.images, ...imagePaths];
    await farm.save();

    res.json({ 
      msg: 'Images uploaded successfully',
      images: imagePaths
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error uploading farm images' });
  }
};

// Farm image delete handler
export const deleteFarmImage = async (req, res) => {
  try {
    const { imagePath } = req.body;
    if (!imagePath) {
      return res.status(400).json({ msg: 'Image path is required' });
    }

    const farm = await Farm.findOne({ owner: req.user.id });
    if (!farm) {
      return res.status(404).json({ msg: 'Farm profile not found' });
    }

    // Remove image from farm's images array
    farm.images = farm.images.filter(img => img !== imagePath);
    await farm.save();

    // You might want to also delete the file from the filesystem
    // This requires the fs module and proper error handling
    // fs.unlink(imagePath, (err) => {
    //   if (err) console.error('Error deleting file:', err);
    // });

    res.json({ msg: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error deleting farm image' });
  }
};
// Get nearby farms
export const getNearbyFarms = async (req, res) => {
  try {
    const { longitude, latitude, radius = 10000 } = req.query; // radius in meters

    const farms = await Farm.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).populate('owner', 'name');

    res.json(farms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching nearby farms' });
  }
};

// Get farm by ID (public route)
export const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id)
      .populate('owner', 'name')
      .select('-businessHours.monday -businessHours.tuesday -businessHours.wednesday -businessHours.thursday -businessHours.friday -businessHours.saturday -businessHours.sunday');

    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    res.json(farm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching farm' });
  }
};

// Add/update farm review
export const addFarmReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    // Check if user has already reviewed
    const reviewIndex = farm.reviews.findIndex(
      review => review.user.toString() === req.user.id
    );

    if (reviewIndex > -1) {
      // Update existing review
      farm.reviews[reviewIndex].rating = rating;
      farm.reviews[reviewIndex].comment = comment;
    } else {
      // Add new review
      farm.reviews.push({
        user: req.user.id,
        rating,
        comment
      });
    }

    // Update average rating
    const totalRating = farm.reviews.reduce((sum, review) => sum + review.rating, 0);
    farm.rating = totalRating / farm.reviews.length;

    await farm.save();
    res.json(farm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error adding review' });
  }
};

export const getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.find();
    res.json(farms);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load farms' });
  }
};

// End of file
