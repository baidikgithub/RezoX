import { Property, PropertyFilters, PropertyResponse } from '../utils/types';
import axios from 'axios';

export const getProperties = async (filters: PropertyFilters = {}): Promise<PropertyResponse> => {
  try {
    const params = {
      propertyType: filters.type !== 'all' ? filters.type : undefined,
      location: filters.location !== 'all' ? filters.location : undefined,
      priceRange: filters.priceRange !== 'all' ? filters.priceRange : undefined,
      bedrooms: filters.bedrooms !== undefined ? filters.bedrooms : undefined,
      searchTerm: filters.searchTerm || undefined,
      sortBy: filters.sortBy || 'newest',
      page: filters.page || 1,
      limit: filters.limit || 8
    };

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    const response = await axios.get('/api/properties', {
      params: cleanParams,
    });

    const { properties, totalCount, currentPage, totalPages } = response.data;

    return {
      properties,
      pagination: {
        currentPage,
        totalPages,
        totalProperties: totalCount,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error('Failed to fetch properties');
  }
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const response = await axios.get(`/api/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

export const getFeaturedProperties = async (): Promise<Property[]> => {
  try {
    const response = await axios.get('/api/properties?isFeatured=true');
    return response.data.properties || [];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
};

// Admin functions (require authentication)
export const createProperty = async (propertyData: Partial<Property>): Promise<Property> => {
  try {
    const response = await axios.post('/api/properties', propertyData);
    return response.data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }
};

export const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property> => {
  try {
    const response = await axios.put(`/api/properties/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating property:', error);
    throw new Error('Failed to update property');
  }
};

export const deleteProperty = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/properties/${id}`);
  } catch (error) {
    console.error('Error deleting property:', error);
    throw new Error('Failed to delete property');
  }
};