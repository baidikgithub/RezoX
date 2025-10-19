'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { User } from '../utils/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Configure axios defaults
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor to include auth token
axios.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth state
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await axios.get('/auth/me');
          setUser(response.data.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          Cookies.remove('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      
      setUser(user);
      Cookies.set('token', token, { expires: 7 }); // 7 days
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post('/auth/register', { name, email, password });
      const { user, token } = response.data.data;
      
      setUser(user);
      Cookies.set('token', token, { expires: 7 }); // 7 days
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      Cookies.remove('token');
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await axios.post('/auth/forgot-password', { email });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password reset failed';
      throw new Error(message);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

