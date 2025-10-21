import { Booking, BookingRequest } from '../utils/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock bookings data
const mockBookings: Booking[] = [
  {
    _id: '1',
    property: {
      _id: '1',
      title: 'Modern Downtown Apartment',
      price: 3200,
      images: [{ url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', alt: 'Modern Downtown Apartment' }],
      location: {
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      }
    },
    user: {
      _id: 'user1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    startDate: new Date('2024-02-01T10:00:00Z'),
    endDate: new Date('2024-02-01T11:00:00Z'),
    totalAmount: 0,
    status: 'confirmed',
    paymentStatus: 'paid',
    contactInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

export const createBooking = async (bookingData: BookingRequest): Promise<Booking> => {
  try {
    // Simulate API delay
    await delay(500);
    
    const newBooking: Booking = {
      _id: Date.now().toString(),
      property: {
        _id: bookingData.propertyId,
        title: 'Property Title',
        price: 0,
        images: [],
        location: {
          address: '',
          city: '',
          state: '',
          zipCode: ''
        }
      },
      user: {
        _id: 'user1',
        name: bookingData.contactInfo.name,
        email: bookingData.contactInfo.email
      },
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      totalAmount: 0,
      status: 'pending',
      paymentStatus: 'pending',
      contactInfo: bookingData.contactInfo,
      specialRequests: bookingData.specialRequests,
      notes: bookingData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockBookings.push(newBooking);
    return newBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  try {
    // Simulate API delay
    await delay(300);
    
    const booking = mockBookings.find(b => b._id === id);
    return booking || null;
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
    // Simulate API delay
    await delay(500);
    
    let filteredBookings = [...mockBookings];
    
    if (status) {
      filteredBookings = filteredBookings.filter(b => b.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
    
    return {
      bookings: paginatedBookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredBookings.length / limit),
        totalBookings: filteredBookings.length,
        hasNextPage: endIndex < filteredBookings.length,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw new Error('Failed to fetch user bookings');
  }
};

export const updateBookingStatus = async (id: string, status: Booking['status']): Promise<Booking> => {
  try {
    // Simulate API delay
    await delay(500);
    
    const booking = mockBookings.find(b => b._id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    booking.status = status;
    booking.updatedAt = new Date();
    return booking;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking status');
  }
};

export const cancelBooking = async (id: string): Promise<void> => {
  try {
    // Simulate API delay
    await delay(500);
    
    const bookingIndex = mockBookings.findIndex(b => b._id === id);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }
    
    mockBookings[bookingIndex].status = 'cancelled';
    mockBookings[bookingIndex].updatedAt = new Date();
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
    // Simulate API delay
    await delay(500);
    
    let filteredBookings = [...mockBookings];
    
    if (status) {
      filteredBookings = filteredBookings.filter(b => b.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
    
    return {
      bookings: paginatedBookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredBookings.length / limit),
        totalBookings: filteredBookings.length,
        hasNextPage: endIndex < filteredBookings.length,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw new Error('Failed to fetch all bookings');
  }
};