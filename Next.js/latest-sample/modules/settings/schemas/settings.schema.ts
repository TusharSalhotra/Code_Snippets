import { z } from 'zod';

export const settingsSchema = z.object({
  profile: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }),
  preferences: z.object({
    language: z.string(),
    timezone: z.string(),
    theme: z.enum(['light', 'dark']),
  }),
});
