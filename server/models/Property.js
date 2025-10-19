const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['apartment', 'house', 'condo', 'townhouse', 'studio', 'loft']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative']
  },
  area: {
    type: Number,
    required: [true, 'Property area is required'],
    min: [0, 'Area cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  amenities: [{
    type: String
  }],
  features: [{
    type: String
  }],
  availability: {
    type: String,
    enum: ['available', 'rented', 'sold', 'maintenance'],
    default: 'available'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    name: String,
    email: String,
    phone: String
  }
}, {
  timestamps: true
});

// Index for search functionality
propertySchema.index({ 
  title: 'text', 
  description: 'text', 
  'location.city': 'text',
  'location.state': 'text'
});

// Index for filtering
propertySchema.index({ propertyType: 1, bedrooms: 1, bathrooms: 1, price: 1 });

module.exports = mongoose.model('Property', propertySchema);
