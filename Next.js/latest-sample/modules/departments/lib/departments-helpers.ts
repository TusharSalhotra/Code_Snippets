/**
 * Department Helper Functions
 */

import { Department, DepartmentFilters, DepartmentStats, DepartmentStatus } from '../types';

/**
 * Filter departments by search query
 */
export function filterDepartmentsBySearch(
  departments: Department[],
  search: string
): Department[] {
  const searchLower = search.toLowerCase().trim();
  if (!searchLower) return departments;
  
  return departments.filter(
    dept =>
      dept.name.toLowerCase().includes(searchLower) ||
      dept.description.toLowerCase().includes(searchLower) ||
      dept.headOfDepartment.toLowerCase().includes(searchLower) ||
      dept.location?.toLowerCase().includes(searchLower)
  );
}

/**
 * Filter departments by status
 */
export function filterDepartmentsByStatus(
  departments: Department[],
  status: DepartmentStatus
): Department[] {
  return departments.filter(dept => dept.status === status);
}

/**
 * Sort departments by employee count
 */
export function sortDepartmentsByEmployeeCount(
  departments: Department[],
  order: 'asc' | 'desc' = 'desc'
): Department[] {
  return [...departments].sort((a, b) => {
    return order === 'desc' 
      ? b.employeeCount - a.employeeCount
      : a.employeeCount - b.employeeCount;
  });
}

/**
 * Sort departments by name
 */
export function sortDepartmentsByName(
  departments: Department[],
  order: 'asc' | 'desc' = 'asc'
): Department[] {
  return [...departments].sort((a, b) => {
    return order === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });
}

/**
 * Get department statistics
 */
export function getDepartmentStats(departments: Department[]): DepartmentStats {
  const activeDepartments = departments.filter(dept => dept.status === 'active');
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);
  
  return {
    totalDepartments: departments.length,
    activeDepartments: activeDepartments.length,
    totalEmployees,
    averageEmployeesPerDept: departments.length > 0 
      ? Math.round(totalEmployees / departments.length) 
      : 0,
  };
}

/**
 * Calculate total budget across departments
 */
export function getTotalBudget(departments: Department[]): number {
  return departments.reduce((sum, dept) => sum + (dept.budget || 0), 0);
}

/**
 * Get departments with most employees
 */
export function getTopDepartmentsBySize(
  departments: Department[],
  limit: number = 5
): Department[] {
  return sortDepartmentsByEmployeeCount(departments, 'desc').slice(0, limit);
}

/**
 * Validate department filters
 */
export function validateFilters(filters: DepartmentFilters): boolean {
  if (filters.minEmployees !== undefined && filters.maxEmployees !== undefined) {
    return filters.minEmployees <= filters.maxEmployees;
  }
  return true;
}

/**
 * Format budget as currency
 */
export function formatBudget(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get department by ID
 */
export function getDepartmentById(
  departments: Department[],
  id: string
): Department | undefined {
  return departments.find(dept => dept.id === id);
}
