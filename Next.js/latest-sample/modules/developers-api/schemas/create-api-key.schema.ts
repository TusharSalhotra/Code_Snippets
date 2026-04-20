import { z } from 'zod';

export const createAPIKeySchema = z.object({
  name: z.string().min(1, 'Key name is required').max(50, 'Key name must be less than 50 characters'),
  permissions: z.enum(['read-only', 'read-write', 'full-access'], {
    required_error: 'Please select permissions',
  }),
});

export type CreateAPIKeyFormData = z.infer<typeof createAPIKeySchema>;
