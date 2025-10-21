import { Property } from '../utils/types';

export const allProperties: Property[] = [
  {
    _id: '1',
    title: 'Modern Downtown Apartment',
    price: 3200,
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
    features: ['Hardwood Floors', 'Central AC'],
    availability: 'available',
    isFeatured: true,
    description: 'Beautiful modern apartment in the heart of downtown',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
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
    description: 'Spacious family home with modern amenities',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    _id: '3',
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
    features: ['Hardwood Floors', 'Central AC'],
    availability: 'available',
    isFeatured: false,
    description: 'Perfect for young professionals',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    _id: '4',
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
    features: ['Hardwood Floors', 'Central AC', 'Smart Home System'],
    availability: 'available',
    isFeatured: true,
    description: 'Luxurious penthouse with stunning city views',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    _id: '5',
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
    description: 'Historic townhouse with modern updates',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    _id: '6',
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
    description: 'Oceanfront luxury condo with amazing views',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    _id: '7',
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
    description: 'Industrial-style loft in trendy SoHo',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    _id: '8',
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
    description: 'Spacious suburban villa with pool and garden',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    _id: '9',
    title: 'Luxury Apartment',
    price: 2800,
    location: {
      address: '456 Sunset Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90028',
      coordinates: { lat: 34.0983, lng: -118.3267 }
    },
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    images: [{
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Luxury Apartment'
    }],
    amenities: ['Balcony', 'Parking', 'Pool', 'Gym'],
    features: ['Hardwood Floors', 'Central AC', 'City View'],
    availability: 'available',
    isFeatured: false,
    description: 'Modern apartment with stunning city views',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    _id: '10',
    title: 'Historic Brownstone',
    price: 650000,
    location: {
      address: '789 Park Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10021',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    images: [{
      url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Historic Brownstone'
    }],
    amenities: ['Garden', 'Garage'],
    features: ['Hardwood Floors', 'Fireplace', 'Historic Details'],
    availability: 'available',
    isFeatured: false,
    description: 'Beautiful historic brownstone in Upper East Side',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    _id: '11',
    title: 'Modern Studio',
    price: 1500,
    location: {
      address: '321 Market Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60606',
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },
    propertyType: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    images: [{
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Modern Studio'
    }],
    amenities: ['Parking'],
    features: ['Hardwood Floors', 'Central AC'],
    availability: 'available',
    isFeatured: false,  
    description: 'Compact studio perfect for urban living',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
  },
  {
    _id: '12',
    title: 'Waterfront Condo',
    price: 850000,
    location: {
      address: '654 Bayfront Drive',
      city: 'Miami',
      state: 'FL',
      zipCode: '33132',
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    propertyType: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    images: [{
      url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Waterfront Condo'
    }],
    amenities: ['Balcony', 'Parking', 'Pool', 'Gym'],
    features: ['Hardwood Floors', 'Central AC', 'Water View'],
    availability: 'available',
    isFeatured: true,
    description: 'Stunning waterfront condo with bay views',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  }
];

export const featuredProperties = allProperties.filter(p => p.isFeatured);
export const saleProperties = allProperties.filter(p => p.propertyType === 'house' || p.propertyType === 'condo');
export const rentProperties = allProperties.filter(p => p.propertyType === 'apartment' || p.propertyType === 'studio' || p.propertyType === 'loft');