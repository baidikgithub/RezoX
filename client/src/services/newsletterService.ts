import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface NewsletterSubscription {
  _id: string;
  email: string;
  isActive: boolean;
  preferences: {
    propertyTypes: string[];
    locations: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  subscribedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterSubscriptionRequest {
  email: string;
  preferences?: {
    propertyTypes: string[];
    locations: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export const subscribeToNewsletter = async (subscriptionData: NewsletterSubscriptionRequest): Promise<NewsletterSubscription> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/newsletter/subscribe`, subscriptionData);
    return response.data.data.subscription;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw new Error('Failed to subscribe to newsletter');
  }
};

export const unsubscribeFromNewsletter = async (email: string): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/newsletter/unsubscribe`, { email });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    throw new Error('Failed to unsubscribe from newsletter');
  }
};

// Admin functions
export const getAllSubscribers = async (page: number = 1, limit: number = 20, status?: 'active' | 'inactive', search?: string): Promise<{
  subscribers: NewsletterSubscription[];
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSubscribers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await axios.get(`${API_BASE_URL}/newsletter/subscribers?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    throw new Error('Failed to fetch subscribers');
  }
};

export const updateSubscriber = async (id: string, updates: {
  preferences?: NewsletterSubscription['preferences'];
  isActive?: boolean;
}): Promise<NewsletterSubscription> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/newsletter/subscribers/${id}`, updates);
    return response.data.data.subscriber;
  } catch (error) {
    console.error('Error updating subscriber:', error);
    throw new Error('Failed to update subscriber');
  }
};

export const deleteSubscriber = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/newsletter/subscribers/${id}`);
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    throw new Error('Failed to delete subscriber');
  }
};