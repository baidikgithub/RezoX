import axios from 'axios';
import { Booking, BookingRequest } from '../utils/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const createBooking = async (bookingData: BookingRequest): Promise<Booking> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
    return response.data.data.booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/${id}`);
    return response.data.data.booking;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
};

export const getUserBookings = async (page: number = 1, limit: number = 10, status?: string): Promise<{
  bookings: Booking[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBookings: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);

    const response = await axios.get(`${API_BASE_URL}/bookings?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw new Error('Failed to fetch user bookings');
  }
};

export const updateBookingStatus = async (id: string, status: Booking['status']): Promise<Booking> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/bookings/${id}/status`, { status });
    return response.data.data.booking;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking status');
  }
};

export const cancelBooking = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/bookings/${id}`);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw new Error('Failed to cancel booking');
  }
};

// Admin functions
export const getAllBookings = async (page: number = 1, limit: number = 10, status?: string): Promise<{
  bookings: Booking[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBookings: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);

    const response = await axios.get(`${API_BASE_URL}/bookings/admin/all?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw new Error('Failed to fetch all bookings');
  }
};