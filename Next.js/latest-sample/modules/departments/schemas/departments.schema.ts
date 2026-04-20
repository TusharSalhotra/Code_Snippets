/**
 * Department Schemas
 * Zod validation schemas for department data
 */

import { z } from 'zod';

export const departmentStatusSchema = z.enum(['active', 'inactive', 'archived']);

export const departmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Department name is required'),
  description: z.string().min(1, 'Description is required'),
  headOfDepartment: z.string().min(1, 'Head of department is required'),
  headOfDepartmentId: z.string(),
  employeeCount: z.number().int().min(0),
  kpiCount: z.number().int().min(0),
  status: departmentStatusSchema,
  budget: z.number().optional(),
  location: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createDepartmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  headOfDepartmentId: z.string().min(1, 'Head of department is required'),
  budget: z.number().positive('Budget must be positive').optional(),
  location: z.string().optional(),
  status: departmentStatusSchema.default('active'),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const departmentFilterSchema = z.object({
  search: z.string().optional(),
  status: departmentStatusSchema.optional(),
  minEmployees: z.number().int().min(0).optional(),
  maxEmployees: z.number().int().min(0).optional(),
});

export type DepartmentFormData = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;
export type DepartmentFilterData = z.infer<typeof departmentFilterSchema>;
