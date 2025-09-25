import express from 'express';
import chatController from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/chat/message
// @desc    Send message to AI chatbot
// @access  Public (can work without auth for general queries)
router.post('/message', async (req, res) => {
  // Make auth optional for general queries
  if (req.headers.authorization) {
    try {
      await protect(req, res, () => {});
    } catch (error) {
      // Continue without auth for general queries
    }
  }
  chatController.sendMessage(req, res);
});

// @route   POST /api/chat/add-to-cart
// @desc    Add product to cart via chat
// @access  Private
router.post('/add-to-cart', protect, chatController.addToCart);

// @route   GET /api/chat/nearby-products
// @desc    Get nearby products for chat recommendations
// @access  Public
router.get('/nearby-products', chatController.getNearbyProducts);

// @route PATCH /api/chat/preferences/language
// @desc  Update preferred chat language (en|ta|hi)
// @access Private
router.patch('/preferences/language', protect, async (req, res) => {
  try {
    const { preferredLanguage } = req.body;
    if (!['en', 'ta', 'hi'].includes(preferredLanguage)) {
      return res.status(400).json({ success: false, message: 'Invalid language. Allowed: en, ta, hi' });
    }
    req.user.preferredLanguage = preferredLanguage;
    await req.user.save();
    res.json({ success: true, message: 'Preferred language updated', preferredLanguage });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to update preferred language', error: e.message });
  }
});

export default router;
