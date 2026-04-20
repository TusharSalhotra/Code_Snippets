import { z } from 'zod';

export const billingSchema = z.object({
  plan: z.enum(['free', 'pro', 'enterprise']),
  billingCycle: z.enum(['monthly', 'annual']),
});
