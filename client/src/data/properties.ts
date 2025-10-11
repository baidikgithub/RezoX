import { Property } from '../utils/types';

export const allProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 450000,
    location: 'Downtown, New York',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: 'sale',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Beautiful modern apartment in the heart of downtown'
  },
  {
    id: '2',
    title: 'Luxury Family Home',
    price: 850000,
    location: 'Suburbs, California',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    type: 'sale',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Spacious family home with modern amenities'
  },
  {
    id: '3',
    title: 'Cozy Studio Apartment',
    price: 1800,
    location: 'Midtown, Chicago',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    type: 'rent',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Perfect for young professionals'
  },
  {
    id: '4',
    title: 'Penthouse with City View',
    price: 1200000,
    location: 'Financial District, New York',
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    type: 'sale',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Luxurious penthouse with stunning city views'
  },
  {
    id: '5',
    title: 'Charming Townhouse',
    price: 2200,
    location: 'Brooklyn, New York',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: 'rent',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Historic townhouse with modern updates'
  },
  {
    id: '6',
    title: 'Luxury Condo',
    price: 750000,
    location: 'Miami, Florida',
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    type: 'sale',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Oceanfront luxury condo with amazing views'
  },
  {
    id: '7',
    title: 'Modern Loft',
    price: 3200,
    location: 'SoHo, New York',
    bedrooms: 1,
    bathrooms: 1,
    area: 1000,
    type: 'rent',
    image: 'https://images.unsplash.com/photo-1505843513577-35bb1d430e1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Industrial-style loft in trendy SoHo'
  },
  {
    id: '8',
    title: 'Suburban Villa',
    price: 950000,
    location: 'Austin, Texas',
    bedrooms: 5,
    bathrooms: 4,
    area: 3000,
    type: 'sale',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Spacious suburban villa with pool and garden'
  }
];

export const featuredProperties = allProperties.slice(0, 4);
export const saleProperties = allProperties.filter(p => p.type === 'sale');
export const rentProperties = allProperties.filter(p => p.type === 'rent');

