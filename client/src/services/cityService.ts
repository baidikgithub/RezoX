import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface City {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const getCities = async (): Promise<City[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw new Error('Failed to fetch cities');
  }
};

export const addCity = async (name: string): Promise<City> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cities`, { name });
    return response.data.city;
  } catch (error) {
    console.error('Error adding city:', error);
    throw new Error('Failed to add city');
  }
};
