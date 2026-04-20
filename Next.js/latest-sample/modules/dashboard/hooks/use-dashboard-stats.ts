'use client';

import { useState, useEffect } from 'react';
import { DashboardStats } from '../types';
import { dashboardApi } from '../api/dashboard-api';
import { REFRESH_INTERVAL } from '../constants';

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Auto-refresh
    const interval = setInterval(fetchStats, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return { stats, isLoading, error, refetch: fetchStats };
};
