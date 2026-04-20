'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '../constants';
import type { LoginCredentials } from '../types';

/**
 * Simple login hook without API calls
 * Handles form submission and navigation only
 */
export const useLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simple form submission - no API call
      // Just validate the form data exists
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to dashboard
      router.push(AUTH_ROUTES.DASHBOARD);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};
