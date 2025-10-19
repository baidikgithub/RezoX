const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data
const mockProperties = [
  {
    _id: '1',
    title: 'Modern Apartment in Downtown',
    description: 'Beautiful modern apartment with stunning city views.',
    price: 2500,
    location: {
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', alt: 'Modern apartment' }
    ],
    amenities: ['Balcony', 'Parking', 'Gym'],
    features: ['Hardwood Floors', 'Central AC'],
    availability: 'available',
    isFeatured: true,
    owner: { _id: 'admin', name: 'Admin', email: 'admin@rezo.com' },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    title: 'Cozy House with Garden',
    description: 'Charming house with a beautiful garden.',
    price: 450000,
    location: {
      address: '456 Oak Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    images: [
      { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', alt: 'Cozy house' }
    ],
    amenities: ['Garden', 'Garage'],
    features: ['Hardwood Floors', 'Fireplace'],
    availability: 'available',
    isFeatured: false,
    owner: { _id: 'admin', name: 'Admin', email: 'admin@rezo.com' },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RezoX API Server is running (Mock Mode)',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/properties', (req, res) => {
  const { page = 1, limit = 10, propertyType, city, minPrice, maxPrice, bedrooms, bathrooms, search } = req.query;
  
  let filteredProperties = [...mockProperties];
  
  if (propertyType) {
    filteredProperties = filteredProperties.filter(p => p.propertyType === propertyType);
  }
  if (city) {
    filteredProperties = filteredProperties.filter(p => p.location.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (minPrice) {
    filteredProperties = filteredProperties.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filteredProperties = filteredProperties.filter(p => p.price <= parseInt(maxPrice));
  }
  if (bedrooms) {
    filteredProperties = filteredProperties.filter(p => p.bedrooms >= parseInt(bedrooms));
  }
  if (bathrooms) {
    filteredProperties = filteredProperties.filter(p => p.bathrooms >= parseInt(bathrooms));
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProperties = filteredProperties.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.location.city.toLowerCase().includes(searchLower)
    );
  }
  
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      properties: paginatedProperties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProperties.length / parseInt(limit)),
        totalProperties: filteredProperties.length,
        hasNextPage: endIndex < filteredProperties.length,
        hasPrevPage: parseInt(page) > 1
      }
    }
  });
});

app.get('/api/properties/featured', (req, res) => {
  const featuredProperties = mockProperties.filter(p => p.isFeatured);
  res.json({
    success: true,
    data: { properties: featuredProperties }
  });
});

app.get('/api/properties/:id', (req, res) => {
  const property = mockProperties.find(p => p._id === req.params.id);
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }
  res.json({
    success: true,
    data: { property }
  });
});

// Mock auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    });
  }
  
  // Mock successful registration
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: 'mock-user-id',
        name,
        email,
        role: 'user'
      },
      token: 'mock-jwt-token'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  // Mock successful login
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: 'mock-user-id',
        name: 'Mock User',
        email,
        role: 'user'
      },
      token: 'mock-jwt-token'
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        _id: 'mock-user-id',
        name: 'Mock User',
        email: 'user@example.com',
        role: 'user'
      }
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Mock newsletter endpoints
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  res.status(201).json({
    success: true,
    message: 'Successfully subscribed to newsletter',
    data: {
      subscription: {
        _id: 'mock-subscription-id',
        email,
        isActive: true,
        subscribedAt: new Date()
      }
    }
  });
});

app.post('/api/newsletter/unsubscribe', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  res.json({
    success: true,
    message: 'Successfully unsubscribed from newsletter'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} (Mock Mode)`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
