'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '../constants';
import type { RegisterData } from '../types';

/**
 * Simple registration hook without API calls
 * Handles form submission and navigation only
 */
export const useRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!data.name || !data.email || !data.password || !data.confirmPassword) {
        throw new Error('All fields are required');
      }

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (data.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // Redirect to dashboard
      router.push(AUTH_ROUTES.DASHBOARD);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
};
