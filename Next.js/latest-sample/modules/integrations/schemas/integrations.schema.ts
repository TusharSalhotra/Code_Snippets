import { z } from 'zod';

export const integrationSchema = z.object({
  name: z.string(),
  provider: z.string(),
  category: z.enum(['hr', 'communication', 'analytics', 'storage']),
});
