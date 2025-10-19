import { useState, useEffect, useCallback } from 'react';
import { getProperties, getPropertyById, getFeaturedProperties } from '../services/propertyService';
import { Property, PropertyFilters, PropertyResponse } from '../utils/types';

export const useProperties = (filters: PropertyFilters = {}) => {
  const [data, setData] = useState<PropertyResponse>({
    properties: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalProperties: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getProperties(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const refetch = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export const useProperty = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getPropertyById(id);
      setProperty(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const refetch = useCallback(() => {
    fetchProperty();
  }, [fetchProperty]);

  return {
    property,
    loading,
    error,
    refetch,
  };
};

export const useFeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getFeaturedProperties();
      setProperties(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured properties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProperties();
  }, [fetchFeaturedProperties]);

  const refetch = useCallback(() => {
    fetchFeaturedProperties();
  }, [fetchFeaturedProperties]);

  return {
    properties,
    loading,
    error,
    refetch,
  };
};

