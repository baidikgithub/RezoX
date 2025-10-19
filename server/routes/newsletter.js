const express = require('express');
const { body, query } = require('express-validator');
const Newsletter = require('../models/Newsletter');
const { handleValidationErrors } = require('../middlewares/validation');
const { auth, adminAuth } = require('../middlewares/auth');

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('preferences.propertyTypes')
    .optional()
    .isArray()
    .withMessage('Property types must be an array'),
  body('preferences.priceRange.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  body('preferences.priceRange.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  body('preferences.locations')
    .optional()
    .isArray()
    .withMessage('Locations must be an array'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { email, preferences = {} } = req.body;

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed to newsletter'
        });
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.preferences = preferences;
        await existingSubscription.save();

        return res.json({
          success: true,
          message: 'Successfully resubscribed to newsletter',
          data: { subscription: existingSubscription }
        });
      }
    }

    // Create new subscription
    const subscription = new Newsletter({
      email,
      preferences
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: { subscription }
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while subscribing to newsletter'
    });
  }
});

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post('/unsubscribe', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { email } = req.body;

    const subscription = await Newsletter.findOne({ email });
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in newsletter subscriptions'
      });
    }

    if (!subscription.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Email is already unsubscribed'
      });
    }

    subscription.isActive = false;
    await subscription.save();

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while unsubscribing from newsletter'
    });
  }
});

// @route   GET /api/newsletter/subscribers
// @desc    Get all newsletter subscribers (Admin only)
// @access  Private (Admin)
router.get('/subscribers', [
  auth,
  adminAuth,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['active', 'inactive']),
  handleValidationErrors
], async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const filter = {};
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (search) {
      filter.email = new RegExp(search, 'i');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const subscribers = await Newsletter.find(filter)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Newsletter.countDocuments(filter);
    const activeCount = await Newsletter.countDocuments({ isActive: true });
    const inactiveCount = await Newsletter.countDocuments({ isActive: false });

    res.json({
      success: true,
      data: {
        subscribers,
        stats: {
          total,
          active: activeCount,
          inactive: inactiveCount
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalSubscribers: total,
          hasNextPage: skip + parseInt(limit) < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subscribers'
    });
  }
});

// @route   PUT /api/newsletter/subscribers/:id
// @desc    Update subscriber preferences (Admin only)
// @access  Private (Admin)
router.put('/subscribers/:id', [
  auth,
  adminAuth,
  body('preferences.propertyTypes')
    .optional()
    .isArray()
    .withMessage('Property types must be an array'),
  body('preferences.priceRange.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  body('preferences.priceRange.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  body('preferences.locations')
    .optional()
    .isArray()
    .withMessage('Locations must be an array'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { preferences, isActive } = req.body;

    const subscriber = await Newsletter.findByIdAndUpdate(
      req.params.id,
      { preferences, isActive },
      { new: true, runValidators: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    res.json({
      success: true,
      message: 'Subscriber updated successfully',
      data: { subscriber }
    });
  } catch (error) {
    console.error('Update subscriber error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating subscriber'
    });
  }
});

// @route   DELETE /api/newsletter/subscribers/:id
// @desc    Delete subscriber (Admin only)
// @access  Private (Admin)
router.delete('/subscribers/:id', [auth, adminAuth], async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    res.json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting subscriber'
    });
  }
});

module.exports = router;
