import { z } from 'zod';

export const departmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').max(100, 'Name is too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  manager: z.string().optional(),
  goals: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;
