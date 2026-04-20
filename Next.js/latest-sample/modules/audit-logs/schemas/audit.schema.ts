import { z } from 'zod';

export const auditLogSchema = z.object({
  action: z.string(),
  resource: z.string(),
  status: z.enum(['success', 'failed']),
});
