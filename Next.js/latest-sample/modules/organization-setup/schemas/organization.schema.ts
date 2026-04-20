import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string().min(2).max(100),
  industry: z.string(),
  size: z.string(),
  country: z.string(),
});
