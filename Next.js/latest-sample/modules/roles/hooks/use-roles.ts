'use client';

import { useState, useEffect, useCallback } from 'react';
import { Role } from '../types';
import { fetchRoles, createRole, updateRole, deleteRole } from '../api/roles-api';
import { filterRolesBySearch, getRoleStats } from '../lib/roles-helpers';

interface UseRolesOptions {
  autoFetch?: boolean;
}

export function useRoles(options: UseRolesOptions = {}) {
  const { autoFetch = true } = options;

  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch roles from API
  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchRoles();
      setRoles(data);
      setFilteredRoles(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load roles'));
      console.error('Error loading roles:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new role
  const addRole = useCallback(
    async (role: Omit<Role, 'id'>) => {
      setIsLoading(true);
      setError(null);

      try {
        const newRole = await createRole(role);
        setRoles((prev) => [...prev, newRole]);
        setFilteredRoles((prev) => [...prev, newRole]);
        return newRole;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create role'));
        console.error('Error creating role:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update an existing role
  const editRole = useCallback(
    async (id: string, updates: Partial<Role>) => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedRole = await updateRole(id, updates);
        setRoles((prev) => prev.map((role) => (role.id === id ? updatedRole : role)));
        setFilteredRoles((prev) => prev.map((role) => (role.id === id ? updatedRole : role)));
        return updatedRole;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update role'));
        console.error('Error updating role:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Delete a role
  const removeRole = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteRole(id);
      setRoles((prev) => prev.filter((role) => role.id !== id));
      setFilteredRoles((prev) => prev.filter((role) => role.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete role'));
      console.error('Error deleting role:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search roles
  const search = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const filtered = filterRolesBySearch(roles, query);
      setFilteredRoles(filtered);
    },
    [roles]
  );

  // Get role statistics
  const stats = getRoleStats(filteredRoles);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      loadRoles();
    }
  }, [autoFetch, loadRoles]);

  return {
    roles: filteredRoles,
    allRoles: roles,
    isLoading,
    error,
    stats,
    searchQuery,
    // Actions
    loadRoles,
    addRole,
    editRole,
    removeRole,
    search,
  };
}
