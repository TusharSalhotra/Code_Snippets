/**
 * Assessment Schemas
 */

import { z } from 'zod';

export const assessmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10),
  type: z.enum(['skill', 'performance', 'knowledge', 'certification']),
  duration: z.number().min(5).max(180),
  passingScore: z.number().min(0).max(100),
});
