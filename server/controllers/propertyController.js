import Property from "../models/propertyModel.js";

// GET all properties
export const getProperties = async (req, res) => {
  try {
    const { 
      propertyType, 
      location, 
      priceRange, 
      bedrooms, 
      searchTerm, 
      sortBy = 'newest',
      page = 1,
      limit = 8
    } = req.query;

    // Build filter object
    let filter = {};
    
    if (propertyType && propertyType !== 'all') {
      filter.propertyType = propertyType;
    }
    
    if (location && location !== 'all') {
      filter['location.city'] = { $regex: location, $options: 'i' };
    }
    
    if (bedrooms && bedrooms !== 'all') {
      filter.bedrooms = parseInt(bedrooms);
    }
    
    if (priceRange && priceRange !== 'all') {
      switch (priceRange) {
        case '0-500k':
          filter.price = { $lte: 500000 };
          break;
        case '500k-1m':
          filter.price = { $gt: 500000, $lte: 1000000 };
          break;
        case '1m-2m':
          filter.price = { $gt: 1000000, $lte: 2000000 };
          break;
        case '2m+':
          filter.price = { $gt: 2000000 };
          break;
      }
    }
    
    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { 'location.city': { $regex: searchTerm, $options: 'i' } },
        { 'location.state': { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'price-asc':
        sort.price = 1;
        break;
      case 'price-desc':
        sort.price = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'oldest':
        sort.createdAt = 1;
        break;
      default:
        sort.createdAt = -1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const totalCount = await Property.countDocuments(filter);
    
    // Get properties with pagination and sorting
    const properties = await Property.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      properties,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET single property by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST new property
export const createProperty = async (req, res) => {
    try {
      const newProperty = new Property(req.body);
      const savedProperty = await newProperty.save();
      res.status(201).json(savedProperty);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(400).json({ message: error.message });
    }
  };

// PUT update property
export const updateProperty = async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedProperty) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE property
export const deleteProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
