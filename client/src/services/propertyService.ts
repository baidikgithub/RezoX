import { Property, PropertyFilters, PropertyResponse } from '../utils/types';
import { allProperties } from '../data/properties';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProperties = async (filters: PropertyFilters = {}): Promise<PropertyResponse> => {
  try {
    // Simulate API delay
    await delay(500);
    
    let filteredProperties = [...allProperties];
    
    // Apply filters
    if (filters.type) {
      if (filters.type === 'sale') {
        filteredProperties = filteredProperties.filter(p => 
          p.propertyType === 'house' || p.propertyType === 'condo' || p.propertyType === 'townhouse'
        );
      } else if (filters.type === 'rent') {
        filteredProperties = filteredProperties.filter(p => 
          p.propertyType === 'apartment' || p.propertyType === 'studio' || p.propertyType === 'loft'
        );
      }
    }
    
    if (filters.location) {
      filteredProperties = filteredProperties.filter(p => 
        p.location.city.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.minPrice !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice!);
    }
    
    if (filters.bedrooms !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= filters.bedrooms!);
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredProperties = filteredProperties.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.location.city.toLowerCase().includes(searchLower) ||
        p.location.address.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredProperties.sort((a, b) => {
        if (filters.sortBy === 'price') {
          return filters.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (filters.sortBy === 'createdAt') {
          return filters.sortOrder === 'asc' 
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
    }
    
    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 8;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
    
    return {
      properties: paginatedProperties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredProperties.length / limit),
        totalProperties: filteredProperties.length,
        hasNextPage: endIndex < filteredProperties.length,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error('Failed to fetch properties');
  }
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    // Simulate API delay
    await delay(300);
    
    const property = allProperties.find(p => p._id === id);
    return property || null;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

export const getFeaturedProperties = async (): Promise<Property[]> => {
  try {
    // Simulate API delay
    await delay(300);
    
    return allProperties.filter(p => p.isFeatured);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
};

// Admin functions (require authentication) - Mock implementations
export const createProperty = async (propertyData: Partial<Property>): Promise<Property> => {
  try {
    // Simulate API delay
    await delay(500);
    
    const newProperty: Property = {
      _id: Date.now().toString(),
      title: propertyData.title || 'New Property',
      description: propertyData.description || '',
      price: propertyData.price || 0,
      location: propertyData.location || {
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      propertyType: propertyData.propertyType || 'apartment',
      bedrooms: propertyData.bedrooms || 1,
      bathrooms: propertyData.bathrooms || 1,
      area: propertyData.area || 0,
      images: propertyData.images || [],
      amenities: propertyData.amenities || [],
      features: propertyData.features || [],
      availability: propertyData.availability || 'available',
      isFeatured: propertyData.isFeatured || false,
      owner: propertyData.owner || {
        _id: 'admin',
        name: 'Admin User',
        email: 'admin@rezo.com'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newProperty;
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }
};

export const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property> => {
  try {
    // Simulate API delay
    await delay(500);
    
    const property = allProperties.find(p => p._id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    
    const updatedProperty = { ...property, ...updates, updatedAt: new Date() };
    return updatedProperty;
  } catch (error) {
    console.error('Error updating property:', error);
    throw new Error('Failed to update property');
  }
};

export const deleteProperty = async (id: string): Promise<void> => {
  try {
    // Simulate API delay
    await delay(500);
    
    const propertyIndex = allProperties.findIndex(p => p._id === id);
    if (propertyIndex === -1) {
      throw new Error('Property not found');
    }
    
    // In a real app, this would delete from the database
    console.log(`Property ${id} would be deleted`);
  } catch (error) {
    console.error('Error deleting property:', error);
    throw new Error('Failed to delete property');
  }
};