import { cities, City } from '../data/cities';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getCities = async (): Promise<City[]> => {
  try {
    // Simulate API delay
    await delay(300);
    
    return [...cities];
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw new Error('Failed to fetch cities');
  }
};

export const addCity = async (name: string): Promise<City> => {
  try {
    // Simulate API delay
    await delay(500);
    
    const newCity: City = {
      _id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newCity;
  } catch (error) {
    console.error('Error adding city:', error);
    throw new Error('Failed to add city');
  }
};
