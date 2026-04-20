import { z } from 'zod';

/**
 * Permission schema
 */
export const permissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required'),
  enabled: z.boolean(),
});

/**
 * Role type schema
 */
export const roleTypeSchema = z.enum(['system', 'custom']);

/**
 * Role schema for validation
 */
export const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Role name is required').max(100, 'Role name is too long'),
  type: roleTypeSchema,
  userCount: z.number().int().min(0).default(0),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  permissions: z.array(permissionSchema).min(1, 'At least one permission is required'),
  canEdit: z.boolean().default(true),
  canDelete: z.boolean().default(true),
});

/**
 * Schema for creating a new role
 */
export const createRoleSchema = roleSchema.omit({ id: true, userCount: true });

/**
 * Schema for updating a role
 */
export const updateRoleSchema = roleSchema.partial().omit({ id: true });

/**
 * Schema for role search/filter
 */
export const roleFilterSchema = z.object({
  search: z.string().optional(),
  type: roleTypeSchema.optional(),
  minUsers: z.number().int().min(0).optional(),
  maxUsers: z.number().int().min(0).optional(),
});

// Infer types from schemas
export type RoleInput = z.infer<typeof roleSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type RoleFilterInput = z.infer<typeof roleFilterSchema>;
