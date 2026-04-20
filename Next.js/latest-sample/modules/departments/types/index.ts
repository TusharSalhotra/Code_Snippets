/**
 * Department Types
 * Type definitions for department management
 */

export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string;
  headOfDepartmentId: string;
  employeeCount: number;
  kpiCount: number;
  status: DepartmentStatus;
  budget?: number;
  location?: string;
  createdAt: string;
  updatedAt: string;
  manager?: string; // Manager ID
  managerName?: string; // Manager display name
  goals?: string; // Department goals
}

export type DepartmentStatus = 'active' | 'inactive' | 'archived';

export interface DepartmentFilters {
  search?: string;
  status?: DepartmentStatus;
  minEmployees?: number;
  maxEmployees?: number;
}

export interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
  totalEmployees: number;
  averageEmployeesPerDept: number;
}

export interface CreateDepartmentInput {
  name: string;
  description: string;
  manager?: string;
  goals?: string;
}

export interface UpdateDepartmentInput extends Partial<CreateDepartmentInput> {
  id: string;
  status?: DepartmentStatus;
}
