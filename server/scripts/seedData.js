const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Property = require('../models/Property');
const Newsletter = require('../models/Newsletter');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://baidikmazumdar789_db_user:evNwjoT5ia9nv4zq@cluster0.j1fz7es.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Newsletter.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@rezo.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1-555-0001'
    });
    await adminUser.save();
    console.log('👤 Created admin user');

    // Create regular users
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+1-555-0002'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+1-555-0003'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        phone: '+1-555-0004'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log('👥 Created regular users');

    // Create properties
    const properties = [
      {
        title: 'Modern Apartment in Downtown',
        description: 'Beautiful modern apartment with stunning city views. Located in the heart of downtown with easy access to restaurants, shopping, and public transportation.',
        price: 2500,
        location: {
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          coordinates: { lat: 40.7589, lng: -73.9851 }
        },
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        images: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', alt: 'Modern apartment living room' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', alt: 'Modern apartment kitchen' }
        ],
        amenities: ['Balcony', 'Parking', 'Gym', 'Pool', 'Concierge'],
        features: ['Hardwood Floors', 'Central AC', 'Dishwasher', 'In-Unit Laundry'],
        availability: 'available',
        isFeatured: true,
        owner: adminUser._id,
        agent: {
          name: 'Sarah Wilson',
          email: 'sarah@rezo.com',
          phone: '+1-555-0101'
        }
      },
      {
        title: 'Cozy House with Garden',
        description: 'Charming house with a beautiful garden and modern amenities. Perfect for families looking for a quiet neighborhood with excellent schools nearby.',
        price: 450000,
        location: {
          address: '456 Oak Avenue',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        propertyType: 'house',
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        images: [
          { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', alt: 'Cozy house exterior' },
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', alt: 'House garden' }
        ],
        amenities: ['Garden', 'Garage', 'Fireplace', 'Patio'],
        features: ['Hardwood Floors', 'Updated Kitchen', 'Master Suite', 'Storage'],
        availability: 'available',
        isFeatured: false,
        owner: adminUser._id,
        agent: {
          name: 'David Brown',
          email: 'david@rezo.com',
          phone: '+1-555-0102'
        }
      },
      {
        title: 'Luxury Condo with Ocean View',
        description: 'Stunning oceanfront condo with panoramic views. High-end finishes and amenities make this the perfect luxury living experience.',
        price: 3200,
        location: {
          address: '789 Ocean Drive',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101',
          coordinates: { lat: 25.7617, lng: -80.1918 }
        },
        propertyType: 'condo',
        bedrooms: 2,
        bathrooms: 2,
        area: 1500,
        images: [
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', alt: 'Luxury condo ocean view' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', alt: 'Luxury condo interior' }
        ],
        amenities: ['Ocean View', 'Balcony', 'Concierge', 'Pool', 'Spa'],
        features: ['Marble Floors', 'Gourmet Kitchen', 'Walk-in Closets', 'Smart Home'],
        availability: 'available',
        isFeatured: true,
        owner: adminUser._id,
        agent: {
          name: 'Lisa Garcia',
          email: 'lisa@rezo.com',
          phone: '+1-555-0103'
        }
      },
      {
        title: 'Charming Studio in Arts District',
        description: 'Perfect for young professionals, this studio offers modern amenities in a vibrant arts district with plenty of entertainment options.',
        price: 1800,
        location: {
          address: '321 Art Street',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90013',
          coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        propertyType: 'studio',
        bedrooms: 0,
        bathrooms: 1,
        area: 600,
        images: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', alt: 'Studio apartment' },
          { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', alt: 'Studio kitchen' }
        ],
        amenities: ['Rooftop Deck', 'Fitness Center', 'Laundry Room'],
        features: ['Open Floor Plan', 'High Ceilings', 'Large Windows', 'Modern Appliances'],
        availability: 'available',
        isFeatured: false,
        owner: adminUser._id,
        agent: {
          name: 'Tom Wilson',
          email: 'tom@rezo.com',
          phone: '+1-555-0104'
        }
      },
      {
        title: 'Spacious Townhouse with Rooftop',
        description: 'Multi-level townhouse with private rooftop terrace. Great for entertaining with open concept living and modern finishes throughout.',
        price: 2800,
        location: {
          address: '654 Pine Street',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          coordinates: { lat: 47.6062, lng: -122.3321 }
        },
        propertyType: 'townhouse',
        bedrooms: 3,
        bathrooms: 2.5,
        area: 2000,
        images: [
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', alt: 'Townhouse exterior' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', alt: 'Townhouse living room' }
        ],
        amenities: ['Rooftop Terrace', 'Garage', 'Private Entrance'],
        features: ['Open Floor Plan', 'Hardwood Floors', 'Updated Kitchen', 'Master Suite'],
        availability: 'available',
        isFeatured: true,
        owner: adminUser._id,
        agent: {
          name: 'Emma Davis',
          email: 'emma@rezo.com',
          phone: '+1-555-0105'
        }
      },
      {
        title: 'Industrial Loft in Historic Building',
        description: 'Converted industrial loft with exposed brick and high ceilings. Located in a historic building with character and modern amenities.',
        price: 2200,
        location: {
          address: '987 Industrial Blvd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          coordinates: { lat: 41.8781, lng: -87.6298 }
        },
        propertyType: 'loft',
        bedrooms: 1,
        bathrooms: 1,
        area: 1100,
        images: [
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', alt: 'Industrial loft interior' },
          { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', alt: 'Loft kitchen' }
        ],
        amenities: ['Exposed Brick', 'High Ceilings', 'Large Windows'],
        features: ['Open Floor Plan', 'Concrete Floors', 'Modern Kitchen', 'City Views'],
        availability: 'available',
        isFeatured: false,
        owner: adminUser._id,
        agent: {
          name: 'Alex Rodriguez',
          email: 'alex@rezo.com',
          phone: '+1-555-0106'
        }
      }
    ];

    for (const propertyData of properties) {
      const property = new Property(propertyData);
      await property.save();
    }
    console.log('🏠 Created properties');

    // Create newsletter subscriptions
    const newsletterSubscriptions = [
      {
        email: 'subscriber1@example.com',
        preferences: {
          propertyTypes: ['apartment', 'condo'],
          priceRange: { min: 2000, max: 3000 },
          locations: ['New York', 'Miami']
        }
      },
      {
        email: 'subscriber2@example.com',
        preferences: {
          propertyTypes: ['house', 'townhouse'],
          priceRange: { min: 300000, max: 600000 },
          locations: ['San Francisco', 'Seattle']
        }
      },
      {
        email: 'subscriber3@example.com',
        preferences: {
          propertyTypes: ['studio', 'loft'],
          priceRange: { min: 1500, max: 2500 },
          locations: ['Los Angeles', 'Chicago']
        }
      }
    ];

    for (const subscriptionData of newsletterSubscriptions) {
      const subscription = new Newsletter(subscriptionData);
      await subscription.save();
    }
    console.log('📧 Created newsletter subscriptions');

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`👤 Users: ${await User.countDocuments()}`);
    console.log(`🏠 Properties: ${await Property.countDocuments()}`);
    console.log(`📧 Newsletter subscriptions: ${await Newsletter.countDocuments()}`);
    console.log('\n🔑 Admin credentials:');
    console.log('Email: admin@rezo.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedData();

