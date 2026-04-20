import { z } from 'zod';

/**
 * KPI status schema
 */
export const kpiStatusSchema = z.enum(['active', 'draft', 'inactive']);

/**
 * KPI schema for validation
 */
export const kpiSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'KPI name is required').max(200, 'KPI name is too long'),
  department: z.string().min(1, 'Department is required'),
  weight: z.number().int().min(0).max(100, 'Weight must be between 0 and 100'),
  status: kpiStatusSchema,
  isAIGenerated: z.boolean().optional(),
});

/**
 * KPI Pack schema
 */
export const kpiPackSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Pack name is required'),
  emoji: z.string().min(1, 'Emoji is required'),
  description: z.string().min(1, 'Description is required').max(300),
  kpiCount: z.number().int().min(0),
});

/**
 * Schema for creating a new KPI
 */
export const createKPISchema = kpiSchema.omit({ id: true });

/**
 * Schema for updating a KPI
 */
export const updateKPISchema = kpiSchema.partial().omit({ id: true });

/**
 * Schema for KPI search/filter
 */
export const kpiFilterSchema = z.object({
  search: z.string().optional(),
  department: z.string().optional(),
  status: kpiStatusSchema.optional(),
  isAIGenerated: z.boolean().optional(),
  minWeight: z.number().int().min(0).max(100).optional(),
  maxWeight: z.number().int().min(0).max(100).optional(),
});

// Infer types from schemas
export type KPIInput = z.infer<typeof kpiSchema>;
export type CreateKPIInput = z.infer<typeof createKPISchema>;
export type UpdateKPIInput = z.infer<typeof updateKPISchema>;
export type KPIFilterInput = z.infer<typeof kpiFilterSchema>;
export type KPIPackInput = z.infer<typeof kpiPackSchema>;
