import axios from 'axios';
import { User } from '../utils/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile`);
    return response.data.data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

export const updateUserProfile = async (updates: {
  name?: string;
  phone?: string;
  avatar?: string;
}): Promise<User> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/profile`, updates);
    return response.data.data.user;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/users/change-password`, {
      currentPassword,
      newPassword
    });
  } catch (error) {
    console.error('Error changing password:', error);
    throw new Error('Failed to change password');
  }
};

// Admin functions
export const getAllUsers = async (page: number = 1, limit: number = 10, role?: string, search?: string): Promise<{
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (role) params.append('role', role);
    if (search) params.append('search', search);

    const response = await axios.get(`${API_BASE_URL}/users?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data.data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
};

export const updateUserStatus = async (id: string, isActive: boolean): Promise<User> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}/status`, { isActive });
    return response.data.data.user;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw new Error('Failed to update user status');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};