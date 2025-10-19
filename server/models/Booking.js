const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be more than 500 characters']
  },
  contactInfo: {
    name: {
      type: String,
      required: [true, 'Contact name is required']
    },
    email: {
      type: String,
      required: [true, 'Contact email is required']
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    }
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  }
}, {
  timestamps: true
});

// Validate that end date is after start date
bookingSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

// Index for user bookings
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ property: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
