import { z } from 'zod';

export const securitySchema = z.object({
  twoFactorEnabled: z.boolean(),
  ssoEnabled: z.boolean(),
  passwordPolicy: z.enum(['weak', 'medium', 'strong']),
});
