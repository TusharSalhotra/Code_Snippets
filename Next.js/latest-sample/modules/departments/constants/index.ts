/**
 * Department Constants
 */

import { Department } from '../types';

export const DEPARTMENT_STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
} as const;

export const DEPARTMENT_STATUS_COLORS = {
  active: 'text-cyan-400',
  inactive: 'text-yellow-400',
  archived: 'text-gray-400',
} as const;

export const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development and technical infrastructure',
    headOfDepartment: 'Sarah Johnson',
    headOfDepartmentId: '1',
    employeeCount: 24,
    kpiCount: 8,
    status: 'active',
    budget: 2500000,
    location: 'Building A, Floor 3',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
  },
  {
    id: '2',
    name: 'Product',
    description: 'Product strategy and management',
    headOfDepartment: 'Emily Rodriguez',
    headOfDepartmentId: '2',
    employeeCount: 8,
    kpiCount: 6,
    status: 'active',
    budget: 1200000,
    location: 'Building A, Floor 2',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'Design',
    description: 'UX/UI design and creative direction',
    headOfDepartment: 'David Kim',
    headOfDepartmentId: '3',
    employeeCount: 6,
    kpiCount: 5,
    status: 'active',
    budget: 950000,
    location: 'Building B, Floor 1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'Sales',
    description: 'Revenue generation and client acquisition',
    headOfDepartment: 'Robert Martinez',
    headOfDepartmentId: '4',
    employeeCount: 12,
    kpiCount: 10,
    status: 'active',
    budget: 1800000,
    location: 'Building B, Floor 2',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
  },
  {
    id: '5',
    name: 'HR',
    description: 'Human resources and talent management',
    headOfDepartment: 'Jessica Taylor',
    headOfDepartmentId: '5',
    employeeCount: 4,
    kpiCount: 6,
    status: 'active',
    budget: 750000,
    location: 'Building A, Floor 1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
  },
  {
    id: '6',
    name: 'Marketing',
    description: 'Brand and marketing strategy',
    headOfDepartment: 'Alex Chen',
    headOfDepartmentId: '6',
    employeeCount: 7,
    kpiCount: 8,
    status: 'active',
    budget: 1100000,
    location: 'Building C, Floor 1',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
  },
];
