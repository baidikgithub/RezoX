import { useState, useEffect, useCallback } from 'react';
import { 
  getUserBookings, 
  createBooking, 
  getBookingById, 
  updateBookingStatus, 
  cancelBooking 
} from '../services/bookingService';
import { Booking, BookingRequest } from '../utils/types';

export const useBookings = (page: number = 1, limit: number = 10, status?: string) => {
  const [data, setData] = useState<{
    bookings: Booking[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBookings: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>({
    bookings: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalBookings: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getUserBookings(page, limit, status);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [page, limit, status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createNewBooking = useCallback(async (bookingData: BookingRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const booking = await createBooking(bookingData);
      await fetchBookings(); // Refetch to get updated data
      return booking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBookings]);

  const updateBooking = useCallback(async (id: string, status: Booking['status']) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateBookingStatus(id, status);
      await fetchBookings(); // Refetch to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking');
    } finally {
      setLoading(false);
    }
  }, [fetchBookings]);

  const cancelBookingById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await cancelBooking(id);
      await fetchBookings(); // Refetch to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  }, [fetchBookings]);

  const refetch = useCallback(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    data,
    loading,
    error,
    createBooking: createNewBooking,
    updateBooking,
    cancelBooking: cancelBookingById,
    refetch,
  };
};

export const useBooking = (id: string) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getBookingById(id);
      setBooking(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch booking');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const updateBooking = useCallback(async (status: Booking['status']) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await updateBookingStatus(id, status);
      await fetchBooking(); // Refetch to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking');
    } finally {
      setLoading(false);
    }
  }, [id, fetchBooking]);

  const cancelBookingById = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await cancelBooking(id);
      await fetchBooking(); // Refetch to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  }, [id, fetchBooking]);

  const refetch = useCallback(() => {
    fetchBooking();
  }, [fetchBooking]);

  return {
    booking,
    loading,
    error,
    updateBooking,
    cancelBooking: cancelBookingById,
    refetch,
  };
};

