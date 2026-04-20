/**
 * Departments Zustand Store
 */

import { create } from 'zustand';
import type { Department } from '@/modules/departments/types';

interface DepartmentsState {
  departments: Department[];
  addDepartment: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDepartment: (id: string, data: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
}

export const useDepartmentsStore = create<DepartmentsState>((set) => ({
  departments: [
    {
      id: '1',
      name: 'Engineering',
      description: 'Software development and technical operations',
      headOfDepartment: 'John Doe',
      headOfDepartmentId: '1',
      manager: '1',
      managerName: 'John Doe',
      employeeCount: 45,
      kpiCount: 8,
      status: 'active',
      goals: 'Build scalable products and maintain high code quality',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '2',
      name: 'Product',
      description: 'Product strategy and roadmap planning',
      headOfDepartment: 'Jane Smith',
      headOfDepartmentId: '2',
      manager: '2',
      managerName: 'Jane Smith',
      employeeCount: 12,
      kpiCount: 5,
      status: 'active',
      goals: 'Define product vision and prioritize features',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '3',
      name: 'Sales',
      description: 'Revenue generation and client relationships',
      headOfDepartment: 'Mike Wilson',
      headOfDepartmentId: '3',
      manager: '3',
      managerName: 'Mike Wilson',
      employeeCount: 28,
      kpiCount: 6,
      status: 'active',
      goals: 'Increase revenue by 30% and expand client base',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
  ],
  addDepartment: (department) =>
    set((state) => ({
      departments: [
        ...state.departments,
        {
          ...department,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateDepartment: (id, data) =>
    set((state) => ({
      departments: state.departments.map((dept) =>
        dept.id === id ? { ...dept, ...data } : dept
      ),
    })),
  deleteDepartment: (id) =>
    set((state) => ({
      departments: state.departments.filter((dept) => dept.id !== id),
    })),
}));
