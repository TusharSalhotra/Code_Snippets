/**
 * Roles Zustand Store
 */

import { create } from 'zustand';
import type { Role, Permission } from '@/modules/roles/types';

interface RolesState {
  roles: Role[];
  addRole: (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRole: (id: string, data: Partial<Role>) => void;
  deleteRole: (id: string) => void;
}

export const useRolesStore = create<RolesState>((set) => ({
  roles: [
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access with all permissions',
      type: 'system',
      userCount: 5,
      canEdit: false,
      canDelete: false,
      permissions: [
        { name: 'users.view', enabled: true },
        { name: 'users.create', enabled: true },
        { name: 'users.edit', enabled: true },
        { name: 'users.delete', enabled: true },
        { name: 'departments.view', enabled: true },
        { name: 'departments.create', enabled: true },
        { name: 'departments.edit', enabled: true },
        { name: 'departments.delete', enabled: true },
        { name: 'kpis.view', enabled: true },
        { name: 'kpis.create', enabled: true },
        { name: 'kpis.edit', enabled: true },
        { name: 'kpis.delete', enabled: true },
        { name: 'assessments.view', enabled: true },
        { name: 'assessments.create', enabled: true },
        { name: 'assessments.edit', enabled: true },
        { name: 'assessments.delete', enabled: true },
        { name: 'reports.view', enabled: true },
        { name: 'reports.create', enabled: true },
        { name: 'reports.export', enabled: true },
        { name: 'ai.access', enabled: true },
        { name: 'ai.configure', enabled: true },
        { name: 'settings.view', enabled: true },
        { name: 'settings.edit', enabled: true },
        { name: 'settings.security', enabled: true },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Department management and team oversight',
      type: 'custom',
      userCount: 12,
      canEdit: true,
      canDelete: true,
      permissions: [
        { name: 'users.view', enabled: true },
        { name: 'departments.view', enabled: true },
        { name: 'departments.edit', enabled: true },
        { name: 'kpis.view', enabled: true },
        { name: 'kpis.create', enabled: true },
        { name: 'kpis.edit', enabled: true },
        { name: 'assessments.view', enabled: true },
        { name: 'assessments.create', enabled: true },
        { name: 'assessments.edit', enabled: true },
        { name: 'reports.view', enabled: true },
        { name: 'reports.create', enabled: true },
      ],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'Employee',
      description: 'Standard employee access',
      type: 'system',
      userCount: 156,
      canEdit: false,
      canDelete: false,
      permissions: [
        { name: 'users.view', enabled: true },
        { name: 'departments.view', enabled: true },
        { name: 'kpis.view', enabled: true },
        { name: 'assessments.view', enabled: true },
        { name: 'reports.view', enabled: true },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ],
  addRole: (role) =>
    set((state) => ({
      roles: [
        ...state.roles,
        {
          ...role,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateRole: (id, data) =>
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id
          ? { ...role, ...data, updatedAt: new Date().toISOString() }
          : role
      ),
    })),
  deleteRole: (id) =>
    set((state) => ({
      roles: state.roles.filter((role) => role.id !== id),
    })),
}));
