const Property = require('../models/Property');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res, next) => {
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
  query = Property.find(JSON.parse(queryStr)).populate('owner', 'name email');

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
  const total = await Property.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const properties = await query;

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
    count: properties.length,
    data: {
      properties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProperties: total,
        hasNextPage: endIndex < total,
        hasPrevPage: startIndex > 0,
      },
    },
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id).populate(
    'owner',
    'name email phone'
  );

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      property,
    },
  });
});

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
exports.createProperty = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.owner = req.user.id;

  const property = await Property.create(req.body);

  res.status(201).json({
    success: true,
    data: {
      property,
    },
  });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = asyncHandler(async (req, res, next) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is property owner or admin
  if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this property`,
        401
      )
    );
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {
      property,
    },
  });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is property owner or admin
  if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this property`,
        401
      )
    );
  }

  await property.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = asyncHandler(async (req, res, next) => {
  const properties = await Property.find({ isFeatured: true })
    .populate('owner', 'name email')
    .limit(6);

  res.status(200).json({
    success: true,
    count: properties.length,
    data: {
      properties,
    },
  });
});

// @desc    Get properties by type
// @route   GET /api/properties/type/:type
// @access  Public
exports.getPropertiesByType = asyncHandler(async (req, res, next) => {
  const properties = await Property.find({
    propertyType: req.params.type,
  }).populate('owner', 'name email');

  res.status(200).json({
    success: true,
    count: properties.length,
    data: {
      properties,
    },
  });
});

// @desc    Search properties by location
// @route   GET /api/properties/search/location
// @access  Public
exports.searchPropertiesByLocation = asyncHandler(async (req, res, next) => {
  const { city, state, zipCode } = req.query;

  let query = {};

  if (city) {
    query['location.city'] = new RegExp(city, 'i');
  }
  if (state) {
    query['location.state'] = new RegExp(state, 'i');
  }
  if (zipCode) {
    query['location.zipCode'] = new RegExp(zipCode, 'i');
  }

  const properties = await Property.find(query).populate(
    'owner',
    'name email'
  );

  res.status(200).json({
    success: true,
    count: properties.length,
    data: {
      properties,
    },
  });
});

// @desc    Get similar properties
// @route   GET /api/properties/:id/similar
// @access  Public
exports.getSimilarProperties = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  const similarProperties = await Property.find({
    _id: { $ne: req.params.id },
    $or: [
      { propertyType: property.propertyType },
      { 'location.city': property.location.city },
      { 'location.state': property.location.state },
    ],
  })
    .populate('owner', 'name email')
    .limit(4);

  res.status(200).json({
    success: true,
    count: similarProperties.length,
    data: {
      properties: similarProperties,
    },
  });
});
