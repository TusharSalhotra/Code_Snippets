import { z } from 'zod';

// Step 1: Basic Information
export const kpiBasicInfoSchema = z.object({
  name: z.string().min(1, 'KPI name is required').max(100, 'Name is too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  formula: z.string().min(1, 'Formula is required').max(200, 'Formula is too long'),
});

// Step 2: Configuration
export const kpiConfigSchema = z.object({
  type: z.enum(['number', 'percentage', 'currency', 'boolean'], {
    required_error: 'KPI type is required',
  }),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'], {
    required_error: 'Frequency is required',
  }),
  unit: z.string().optional(),
});

// Step 3: Target & Assignment
export const kpiTargetSchema = z.object({
  target: z.number().min(0, 'Target must be positive'),
  department: z.string().optional(),
  owner: z.string().optional(),
});

// Complete KPI Schema
export const kpiSchema = z.object({
  name: z.string().min(1, 'KPI name is required').max(100, 'Name is too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  formula: z.string().min(1, 'Formula is required').max(200, 'Formula is too long'),
  type: z.enum(['number', 'percentage', 'currency', 'boolean']),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  target: z.number().min(0, 'Target must be positive'),
  unit: z.string().optional(),
  department: z.string().optional(),
  owner: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
});

export type KPIFormData = z.infer<typeof kpiSchema>;
