const Booking = require('../models/Booking');
const Property = require('../models/Property');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin only)
exports.getBookings = asyncHandler(async (req, res, next) => {
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
  query = Booking.find(JSON.parse(queryStr))
    .populate('property', 'title price images location')
    .populate('user', 'name email phone');

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
  const total = await Booking.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bookings = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: {
      bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBookings: total,
        hasNextPage: endIndex < total,
        hasPrevPage: startIndex > 0,
      },
    },
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('property', 'title price images location')
    .populate('user', 'name email phone');

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this booking`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: {
      booking,
    },
  });
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check if property exists
  const property = await Property.findById(req.body.property);
  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.body.property}`, 404)
    );
  }

  // Check if property is available
  if (property.availability !== 'available') {
    return next(
      new ErrorResponse(`Property is not available for booking`, 400)
    );
  }

  // Check for existing booking for the same property by the same user
  const existingBooking = await Booking.findOne({
    property: req.body.property,
    user: req.user.id,
    status: { $in: ['pending', 'confirmed'] },
  });

  if (existingBooking) {
    return next(
      new ErrorResponse(
        `You already have a booking for this property`,
        400
      )
    );
  }

  const booking = await Booking.create(req.body);

  // Populate the booking with property and user details
  await booking.populate('property', 'title price images location');
  await booking.populate('user', 'name email phone');

  res.status(201).json({
    success: true,
    data: {
      booking,
    },
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this booking`,
        401
      )
    );
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('property', 'title price images location')
    .populate('user', 'name email phone');

  res.status(200).json({
    success: true,
    data: {
      booking,
    },
  });
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this booking`,
        401
      )
    );
  }

  await booking.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get bookings by user
// @route   GET /api/bookings/user/:userId
// @access  Private
exports.getBookingsByUser = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Make sure user can only access their own bookings unless admin
  if (req.params.userId !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access these bookings`,
        401
      )
    );
  }

  const total = await Booking.countDocuments({ user: req.params.userId });

  const bookings = await Booking.find({ user: req.params.userId })
    .populate('property', 'title price images location')
    .populate('user', 'name email phone')
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: {
      bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBookings: total,
        hasNextPage: endIndex < total,
        hasPrevPage: startIndex > 0,
      },
    },
  });
});

// @desc    Get bookings by property
// @route   GET /api/bookings/property/:propertyId
// @access  Private (Admin only)
exports.getBookingsByProperty = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ property: req.params.propertyId })
    .populate('property', 'title price images location')
    .populate('user', 'name email phone')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: {
      bookings,
    },
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin only)
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  booking.status = req.body.status;
  await booking.save();

  await booking.populate('property', 'title price images location');
  await booking.populate('user', 'name email phone');

  res.status(200).json({
    success: true,
    data: {
      booking,
    },
  });
});

// @desc    Get pending bookings
// @route   GET /api/bookings/pending
// @access  Private (Admin only)
exports.getPendingBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ status: 'pending' })
    .populate('property', 'title price images location')
    .populate('user', 'name email phone')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: {
      bookings,
    },
  });
});

// @desc    Check if user has existing booking for property
// @route   GET /api/bookings/check-existing/:propertyId
// @access  Private
exports.hasExistingBooking = asyncHandler(async (req, res, next) => {
  const existingBooking = await Booking.findOne({
    property: req.params.propertyId,
    user: req.user.id,
    status: { $in: ['pending', 'confirmed'] },
  });

  res.status(200).json({
    success: true,
    data: {
      hasExistingBooking: !!existingBooking,
      booking: existingBooking || null,
    },
  });
});
