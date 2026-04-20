import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(100, 'Name is too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  status: z.enum(['active', 'inactive']).optional(),
});

export type RoleFormData = z.infer<typeof roleSchema>;
