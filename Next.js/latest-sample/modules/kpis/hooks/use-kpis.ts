'use client';

import { useState, useEffect, useCallback } from 'react';
import { KPI } from '../types';
import { fetchKPIs, createKPI, updateKPI, deleteKPI } from '../api/kpis-api';
import { filterKPIsBySearch, getKPIStats } from '../lib/kpis-helpers';

interface UseKPIsOptions {
  autoFetch?: boolean;
}

export function useKPIs(options: UseKPIsOptions = {}) {
  const { autoFetch = true } = options;

  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [filteredKPIs, setFilteredKPIs] = useState<KPI[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch KPIs from API
  const loadKPIs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchKPIs();
      setKPIs(data);
      setFilteredKPIs(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load KPIs'));
      console.error('Error loading KPIs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new KPI
  const addKPI = useCallback(
    async (kpi: Omit<KPI, 'id'>) => {
      setIsLoading(true);
      setError(null);

      try {
        const newKPI = await createKPI(kpi);
        setKPIs((prev) => [...prev, newKPI]);
        setFilteredKPIs((prev) => [...prev, newKPI]);
        return newKPI;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create KPI'));
        console.error('Error creating KPI:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update an existing KPI
  const editKPI = useCallback(
    async (id: string, updates: Partial<KPI>) => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedKPI = await updateKPI(id, updates);
        setKPIs((prev) => prev.map((kpi) => (kpi.id === id ? updatedKPI : kpi)));
        setFilteredKPIs((prev) => prev.map((kpi) => (kpi.id === id ? updatedKPI : kpi)));
        return updatedKPI;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update KPI'));
        console.error('Error updating KPI:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Delete a KPI
  const removeKPI = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteKPI(id);
      setKPIs((prev) => prev.filter((kpi) => kpi.id !== id));
      setFilteredKPIs((prev) => prev.filter((kpi) => kpi.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete KPI'));
      console.error('Error deleting KPI:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search KPIs
  const search = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const filtered = filterKPIsBySearch(kpis, query);
      setFilteredKPIs(filtered);
    },
    [kpis]
  );

  // Get KPI statistics
  const stats = getKPIStats(filteredKPIs);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      loadKPIs();
    }
  }, [autoFetch, loadKPIs]);

  return {
    kpis: filteredKPIs,
    allKPIs: kpis,
    isLoading,
    error,
    stats,
    searchQuery,
    // Actions
    loadKPIs,
    addKPI,
    editKPI,
    removeKPI,
    search,
  };
}
