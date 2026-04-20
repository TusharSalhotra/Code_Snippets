/**
 * useDepartments Hook
 * React hook for department management
 */

import { useState, useEffect, useCallback } from 'react';
import { Department, DepartmentFilters } from '../types';
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment } from '../api/departments-api';
import { DepartmentFormData, UpdateDepartmentFormData } from '../schemas/departments.schema';

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DepartmentFilters>({});

  // Load departments
  const loadDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDepartments(filters);
      setDepartments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  // Add department
  const addDepartment = async (data: DepartmentFormData) => {
    try {
      const newDepartment = await createDepartment(data);
      setDepartments(prev => [newDepartment, ...prev]);
      return newDepartment;
    } catch (err) {
      throw err;
    }
  };

  // Edit department
  const editDepartment = async (id: string, data: UpdateDepartmentFormData) => {
    try {
      const updated = await updateDepartment(id, data);
      setDepartments(prev =>
        prev.map(dept => (dept.id === id ? updated : dept))
      );
      return updated;
    } catch (err) {
      throw err;
    }
  };

  // Remove department
  const removeDepartment = async (id: string) => {
    try {
      await deleteDepartment(id);
      setDepartments(prev => prev.filter(dept => dept.id !== id));
    } catch (err) {
      throw err;
    }
  };

  // Search departments
  const search = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  // Filter by status
  const filterByStatus = (status: Department['status'] | undefined) => {
    setFilters(prev => ({ ...prev, status }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
  };

  return {
    departments,
    loading,
    error,
    filters,
    loadDepartments,
    addDepartment,
    editDepartment,
    removeDepartment,
    search,
    filterByStatus,
    clearFilters,
  };
}
