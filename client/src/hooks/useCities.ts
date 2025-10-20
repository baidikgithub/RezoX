import { useState, useEffect, useCallback } from 'react';
import { getCities, addCity, City } from '../services/cityService';

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getCities();
      setCities(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cities');
    } finally {
      setLoading(false);
    }
  }, []);

  const addNewCity = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const newCity = await addCity(name);
      setCities(prev => [...prev, newCity]);
      return newCity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add city');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return {
    cities,
    loading,
    error,
    refetch: fetchCities,
    addCity: addNewCity,
  };
};

