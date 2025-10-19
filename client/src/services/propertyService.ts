import axios from 'axios';
import { Property, PropertyFilters, PropertyResponse } from '../utils/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const getProperties = async (filters: PropertyFilters = {}): Promise<PropertyResponse> => {
  try {
    const params = new URLSearchParams();
    
    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await axios.get(`${API_BASE_URL}/properties?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error('Failed to fetch properties');
  }
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/properties/${id}`);
    return response.data.data.property;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

export const getFeaturedProperties = async (): Promise<Property[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/properties/featured`);
    return response.data.data.properties;
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
};

// Admin functions (require authentication)
export const createProperty = async (propertyData: Partial<Property>): Promise<Property> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/properties`, propertyData);
    return response.data.data.property;
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }
};

export const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/properties/${id}`, updates);
    return response.data.data.property;
  } catch (error) {
    console.error('Error updating property:', error);
    throw new Error('Failed to update property');
  }
};

export const deleteProperty = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/properties/${id}`);
  } catch (error) {
    console.error('Error deleting property:', error);
    throw new Error('Failed to delete property');
  }
};