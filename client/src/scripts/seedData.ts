import { createProperty } from '../services/propertyService';
import { Property } from '../utils/types';

const sampleProperties: Omit<Property, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Modern Downtown Apartment',
    price: 450000,
    location: {
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [{
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Modern Downtown Apartment'
    }],
    amenities: ['Balcony', 'Parking', 'Gym'],
    features: ['Hardwood Floors', 'Central AC', 'City View'],
    availability: 'available',
    isFeatured: true,
    owner: {
      _id: 'admin',
      name: 'Admin User',
      email: 'admin@rezo.com'
    },
    description: 'Beautiful modern apartment in the heart of downtown with stunning city views and premium amenities.',
    agent: {
      name: 'Sarah Johnson',
      email: 'sarah@rezo.com',
      phone: '+1 (555) 123-4567'
    }
  },
  {
    title: 'Luxury Family Home',
    price: 850000,
    location: {
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    images: [{
      url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Luxury Family Home'
    }],
    amenities: ['Pool', 'Garage', 'Garden'],
    features: ['Hardwood Floors', 'Fireplace', 'Spacious Backyard'],
    availability: 'available',
    isFeatured: true,
    owner: {
      _id: 'admin',
      name: 'Admin User',
      email: 'admin@rezo.com'
    },
    description: 'Spacious family home with modern amenities, large backyard, and excellent school district.',
    agent: {
      name: 'Michael Chen',
      email: 'michael@rezo.com',
      phone: '+1 (555) 234-5678'
    }
  },
  {
    title: 'Cozy Studio Apartment',
    price: 1800,
    location: {
      address: '789 State Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },
    propertyType: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    images: [{
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Cozy Studio Apartment'
    }],
    amenities: ['Balcony', 'Parking'],
    features: ['Hardwood Floors', 'Central AC', 'Large Windows'],
    availability: 'available',
    isFeatured: false,
    owner: {
      _id: 'admin',
      name: 'Admin User',
      email: 'admin@rezo.com'
    },
    description: 'Perfect for young professionals, this studio offers modern amenities in a great location.',
    agent: {
      name: 'Emily Rodriguez',
      email: 'emily@rezo.com',
      phone: '+1 (555) 345-6789'
    }
  },
  {
    title: 'Penthouse with City View',
    price: 1200000,
    location: {
      address: '321 Wall Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10005',
      coordinates: { lat: 40.7074, lng: -74.0113 }
    },
    propertyType: 'condo',
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    images: [{
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Penthouse with City View'
    }],
    amenities: ['Balcony', 'Parking', 'Gym', '24/7 Security'],
    features: ['Hardwood Floors', 'Central AC', 'Smart Home System', 'City Views'],
    availability: 'available',
    isFeatured: true,
    owner: {
      _id: 'admin',
      name: 'Admin User',
      email: 'admin@rezo.com'
    },
    description: 'Luxurious penthouse with stunning city views, premium finishes, and exclusive amenities.',
    agent: {
      name: 'Sarah Johnson',
      email: 'sarah@rezo.com',
      phone: '+1 (555) 123-4567'
    }
  },
  {
    title: 'Charming Townhouse',
    price: 2200,
    location: {
      address: '654 Brooklyn Heights',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      coordinates: { lat: 40.6962, lng: -73.9969 }
    },
    propertyType: 'townhouse',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    images: [{
      url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Charming Townhouse'
    }],
    amenities: ['Garden', 'Garage'],
    features: ['Hardwood Floors', 'Fireplace', 'Historic Details'],
    availability: 'available',
    isFeatured: false,
    owner: {
      _id: 'admin',
      name: 'Admin User',
      email: 'admin@rezo.com'
    },
    description: 'Historic townhouse with modern updates, featuring original details and contemporary amenities.',
    agent: {
      name: 'Michael Chen',
      email: 'michael@rezo.com',
      phone: '+1 (555) 234-5678'
    }
  },
  {
    title: 'Luxury Condo',
    price: 750000,
    location: {
      address: '987 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      zipCode: '33139',
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    propertyType: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    images: [{
      url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Luxury Condo'
    }],
    amenities: ['Balcony', 'Parking', 'Pool', 'Gym'],
    features: ['Hardwood Floors', 'Central AC', 'Ocean View'],
    availability: 'available',
    isFeatured: true,
    owner: {
      _id: 'admin',
      name: 'Admin User',
      email: 'admin@rezo.com'
    },
    description: 'Oceanfront luxury condo with amazing views, resort-style amenities, and modern design.',
    agent: {
      name: 'Emily Rodriguez',
      email: 'emily@rezo.com',
      phone: '+1 (555) 345-6789'
    }
  },
  {
    title: 'Modern Loft',
    price: 3200,
    location: {
      address: '147 Spring Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10012',
      coordinates: { lat: 40.7231, lng: -74.0023 }
    },
    propertyType: 'loft',
    bedrooms: 1,
    bathrooms: 1,
    area: 1000,
    images: [{
      url: 'https://images.unsplash.com/photo-1505843513577-35bb1d430e1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Modern Loft'
    }],
    amenities: ['Balcony', 'Parking'],
    features: ['Hardwood Floors', 'Central AC', 'Industrial Style'],
    availability: 'available',
    isFeatured: false,
    owner: {
      _id: 'admin',
      name: 'Admin User',
      email: 'admin@rezo.com'
    },
    description: 'Industrial-style loft in trendy SoHo with exposed brick, high ceilings, and modern amenities.',
    agent: {
      name: 'Sarah Johnson',
      email: 'sarah@rezo.com',
      phone: '+1 (555) 123-4567'
    }
  },
  {
    title: 'Suburban Villa',
    price: 950000,
    location: {
      address: '258 Villa Lane',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      coordinates: { lat: 30.2672, lng: -97.7431 }
    },
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 4,
    area: 3000,
    images: [{
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Suburban Villa'
    }],
    amenities: ['Pool', 'Garage', 'Garden', 'Pet Friendly'],
    features: ['Hardwood Floors', 'Fireplace', 'Spacious Backyard', 'Pool'],
    availability: 'available',
    isFeatured: true,
    owner: {
      _id: 'admin',
      name: 'Admin User',
      email: 'admin@rezo.com'
    },
    description: 'Spacious suburban villa with pool, garden, and modern amenities perfect for large families.',
    agent: {
      name: 'Michael Chen',
      email: 'michael@rezo.com',
      phone: '+1 (555) 234-5678'
    }
  }
];

export const seedProperties = async () => {
  try {
    console.log('Starting to seed properties...');
    
    for (const property of sampleProperties) {
      await createProperty(property);
      console.log(`Created property: ${property.title}`);
    }
    
    console.log('Successfully seeded all properties!');
  } catch (error) {
    console.error('Error seeding properties:', error);
  }
};

// Run seeding if this file is executed directly
if (typeof window === 'undefined') {
  seedProperties();
}