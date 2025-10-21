export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse' | 'studio' | 'loft';
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
  amenities: string[];
  features: string[];
  availability: 'available' | 'rented' | 'sold' | 'maintenance';
  isFeatured: boolean;
  agent?: {
    name: string;
    email: string;
    phone: string;
  };
  owner?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatWeDoCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface NewsletterForm {
  email: string;
}

export interface PropertyFilters {
  type?: 'sale' | 'rent';
  propertyType?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  searchTerm?: string;
  sortBy?: 'price' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PropertySort {
  field: 'price' | 'createdAt' | 'title';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  lastDoc?: any;
}

export interface PropertyResponse {
  properties: Property[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProperties: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Booking {
  _id: string;
  property: {
    _id: string;
    title: string;
    price: number;
    images: Array<{
      url: string;
      alt: string;
    }>;
    location: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  specialRequests?: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingRequest {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  notes?: string;
}
