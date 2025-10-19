const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  preferences: {
    propertyTypes: [{
      type: String,
      enum: ['apartment', 'house', 'condo', 'townhouse', 'studio', 'loft']
    }],
    priceRange: {
      min: Number,
      max: Number
    },
    locations: [String]
  }
}, {
  timestamps: true
});

// Email index is automatically created by unique: true

module.exports = mongoose.model('Newsletter', newsletterSchema);
