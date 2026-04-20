'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authHelpers } from '../lib/auth-helpers';
import { AUTH_ROUTES } from '../constants';
import type { User } from '../types';

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedUser = authHelpers.getUser();
    const token = authHelpers.getToken();
    
    if (storedUser && token) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    authHelpers.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    router.push(AUTH_ROUTES.LOGIN);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuth,
    logout,
  };
};
