import { z } from 'zod';

export const apiKeySchema = z.object({
  name: z.string().min(3),
  permissions: z.array(z.string()).min(1),
});
