import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().email('Invalid email address'),
  department: z.string().min(1, 'Department is required'),
  role: z.string().min(1, 'Role is required'),
  manager: z.string().optional(),
  sendInvite: z.boolean().optional().default(true),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
