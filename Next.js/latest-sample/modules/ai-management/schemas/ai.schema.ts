import { z } from 'zod';

export const aiModelSchema = z.object({
  name: z.string().min(2),
  provider: z.enum(['openai', 'anthropic', 'custom']),
});
