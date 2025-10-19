const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
exports.getUsers = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from filtering
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = User.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await User.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const users = await query;

  res.status(200).json({
    success: true,
    count: users.length,
    data: {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNextPage: endIndex < total,
        hasPrevPage: startIndex > 0,
      },
    },
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin only)
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin only)
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    avatar: req.body.avatar,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Update user preferences
// @route   PUT /api/users/profile/preferences
// @access  Private
exports.updateUserPreferences = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { preferences: req.body.preferences },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Add property to favorites
// @route   POST /api/users/favorites/:propertyId
// @access  Private
exports.addToFavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user.favorites) {
    user.favorites = [];
  }

  if (!user.favorites.includes(req.params.propertyId)) {
    user.favorites.push(req.params.propertyId);
    await user.save();
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Remove property from favorites
// @route   DELETE /api/users/favorites/:propertyId
// @access  Private
exports.removeFromFavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.favorites) {
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.propertyId
    );
    await user.save();
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Get favorite properties
// @route   GET /api/users/favorites
// @access  Private
exports.getFavoriteProperties = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('favorites');

  res.status(200).json({
    success: true,
    data: {
      properties: user.favorites || [],
    },
  });
});

// @desc    Check if property is favorite
// @route   GET /api/users/favorites/check/:propertyId
// @access  Private
exports.isPropertyFavorite = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const isFavorite = user.favorites
    ? user.favorites.includes(req.params.propertyId)
    : false;

  res.status(200).json({
    success: true,
    data: {
      isFavorite,
    },
  });
});

// @desc    Get user search history
// @route   GET /api/users/search-history
// @access  Private
exports.getSearchHistory = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      searchHistory: user.searchHistory || [],
    },
  });
});

// @desc    Add search to history
// @route   POST /api/users/search-history
// @access  Private
exports.addSearchToHistory = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user.searchHistory) {
    user.searchHistory = [];
  }

  const searchEntry = {
    query: req.body.query,
    filters: req.body.filters,
    timestamp: new Date(),
  };

  user.searchHistory.unshift(searchEntry);

  // Keep only last 50 searches
  if (user.searchHistory.length > 50) {
    user.searchHistory = user.searchHistory.slice(0, 50);
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: {
      searchHistory: user.searchHistory,
    },
  });
});
