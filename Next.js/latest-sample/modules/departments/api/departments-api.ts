/**
 * Department API
 * API functions for department management
 */

import { Department, DepartmentFilters } from '../types';
import { DEFAULT_DEPARTMENTS } from '../constants';
import { DepartmentFormData, UpdateDepartmentFormData } from '../schemas/departments.schema';

/**
 * Fetch all departments
 */
export async function fetchDepartments(filters?: DepartmentFilters): Promise<Department[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let departments = [...DEFAULT_DEPARTMENTS];
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    departments = departments.filter(
      dept => 
        dept.name.toLowerCase().includes(searchLower) ||
        dept.description.toLowerCase().includes(searchLower) ||
        dept.headOfDepartment.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters?.status) {
    departments = departments.filter(dept => dept.status === filters.status);
  }
  
  if (filters?.minEmployees !== undefined) {
    departments = departments.filter(dept => dept.employeeCount >= filters.minEmployees!);
  }
  
  if (filters?.maxEmployees !== undefined) {
    departments = departments.filter(dept => dept.employeeCount <= filters.maxEmployees!);
  }
  
  return departments;
}

/**
 * Fetch a single department by ID
 */
export async function fetchDepartmentById(id: string): Promise<Department | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return DEFAULT_DEPARTMENTS.find(dept => dept.id === id) || null;
}

/**
 * Create a new department
 */
export async function createDepartment(data: DepartmentFormData): Promise<Department> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newDepartment: Department = {
    id: String(Date.now()),
    ...data,
    headOfDepartment: 'New Manager', // Would come from user lookup
    employeeCount: 0,
    kpiCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return newDepartment;
}

/**
 * Update an existing department
 */
export async function updateDepartment(
  id: string,
  data: UpdateDepartmentFormData
): Promise<Department> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const department = DEFAULT_DEPARTMENTS.find(dept => dept.id === id);
  if (!department) {
    throw new Error('Department not found');
  }
  
  return {
    ...department,
    ...data,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Delete a department
 */
export async function deleteDepartment(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const department = DEFAULT_DEPARTMENTS.find(dept => dept.id === id);
  if (!department) {
    throw new Error('Department not found');
  }
  
  if (department.employeeCount > 0) {
    throw new Error('Cannot delete department with active employees');
  }
}

/**
 * Archive a department
 */
export async function archiveDepartment(id: string): Promise<Department> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const department = DEFAULT_DEPARTMENTS.find(dept => dept.id === id);
  if (!department) {
    throw new Error('Department not found');
  }
  
  return {
    ...department,
    status: 'archived',
    updatedAt: new Date().toISOString(),
  };
}
