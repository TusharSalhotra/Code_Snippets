import { z } from 'zod';

export const notificationSchema = z.object({
  title: z.string(),
  message: z.string(),
  type: z.enum(['info', 'success', 'warning', 'error']),
});
