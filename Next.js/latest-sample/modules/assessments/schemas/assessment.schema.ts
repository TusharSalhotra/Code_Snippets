/**
 * Assessment Form Validation Schema
 */

import { z } from 'zod';

export const assessmentSchema = z.object({
  name: z.string().min(1, 'Assessment name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['skill', 'performance', 'knowledge', 'certification'], {
    required_error: 'Assessment type is required',
  }),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  participants: z.string().min(1, 'Participants selection is required'),
  status: z.enum(['draft', 'active', 'archived']).optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type AssessmentFormData = z.infer<typeof assessmentSchema>;
