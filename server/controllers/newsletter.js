const Newsletter = require('../models/Newsletter');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribeNewsletter = asyncHandler(async (req, res, next) => {
  const { email, preferences } = req.body;

  // Check if email already exists
  let subscription = await Newsletter.findOne({ email });

  if (subscription) {
    if (subscription.isActive) {
      return next(
        new ErrorResponse('Email is already subscribed to newsletter', 400)
      );
    } else {
      // Reactivate subscription
      subscription.isActive = true;
      subscription.unsubscribedAt = undefined;
      subscription.preferences = preferences || subscription.preferences;
      await subscription.save();

      return res.status(200).json({
        success: true,
        message: 'Successfully resubscribed to newsletter',
        data: {
          subscription,
        },
      });
    }
  }

  // Create new subscription
  subscription = await Newsletter.create({
    email,
    preferences: preferences || {
      propertyTypes: [],
      locations: [],
      priceRange: { min: 0, max: 10000000 },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Successfully subscribed to newsletter',
    data: {
      subscription,
    },
  });
});

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribeNewsletter = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const subscription = await Newsletter.findOne({ email });

  if (!subscription) {
    return next(
      new ErrorResponse('Email is not subscribed to newsletter', 404)
    );
  }

  if (!subscription.isActive) {
    return next(
      new ErrorResponse('Email is already unsubscribed from newsletter', 400)
    );
  }

  subscription.isActive = false;
  subscription.unsubscribedAt = new Date();
  await subscription.save();

  res.status(200).json({
    success: true,
    message: 'Successfully unsubscribed from newsletter',
    data: {
      subscription,
    },
  });
});

// @desc    Update newsletter preferences
// @route   PUT /api/newsletter/preferences
// @access  Private
exports.updateNewsletterPreferences = asyncHandler(async (req, res, next) => {
  const subscription = await Newsletter.findOne({ email: req.user.email });

  if (!subscription) {
    return next(
      new ErrorResponse('Email is not subscribed to newsletter', 404)
    );
  }

  subscription.preferences = req.body.preferences;
  await subscription.save();

  res.status(200).json({
    success: true,
    message: 'Newsletter preferences updated successfully',
    data: {
      subscription,
    },
  });
});

// @desc    Get all active subscriptions
// @route   GET /api/newsletter/active
// @access  Private (Admin only)
exports.getActiveSubscriptions = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const total = await Newsletter.countDocuments({ isActive: true });

  const subscriptions = await Newsletter.find({ isActive: true })
    .sort('-subscribedAt')
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: subscriptions.length,
    data: {
      subscriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSubscriptions: total,
        hasNextPage: endIndex < total,
        hasPrevPage: startIndex > 0,
      },
    },
  });
});

// @desc    Get subscription statistics
// @route   GET /api/newsletter/stats
// @access  Private (Admin only)
exports.getSubscriptionStats = asyncHandler(async (req, res, next) => {
  const totalSubscriptions = await Newsletter.countDocuments();
  const activeSubscriptions = await Newsletter.countDocuments({
    isActive: true,
  });
  const inactiveSubscriptions = totalSubscriptions - activeSubscriptions;

  // Get subscriptions by month for the last 12 months
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const monthlyStats = await Newsletter.aggregate([
    {
      $match: {
        subscribedAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$subscribedAt' },
          month: { $month: '$subscribedAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalSubscriptions,
      activeSubscriptions,
      inactiveSubscriptions,
      monthlyStats,
    },
  });
});

// @desc    Delete subscription
// @route   DELETE /api/newsletter/:id
// @access  Private (Admin only)
exports.deleteSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Newsletter.findById(req.params.id);

  if (!subscription) {
    return next(
      new ErrorResponse(`Subscription not found with id of ${req.params.id}`, 404)
    );
  }

  await subscription.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Subscription deleted successfully',
    data: {},
  });
});
