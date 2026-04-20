import { RoleType } from '../types';

/**
 * Default permissions available in the system
 */
export const DEFAULT_PERMISSIONS = [
  { name: 'Users & Teams', enabled: true },
  { name: 'Departments', enabled: true },
  { name: 'KPI Management', enabled: true },
  { name: 'Assessments', enabled: true },
  { name: 'Reports & Analytics', enabled: true },
  { name: 'AI Management', enabled: true },
  { name: 'Settings & Security', enabled: true },
] as const;

/**
 * System role names that cannot be deleted
 */
export const SYSTEM_ROLE_NAMES = ['Super Admin', 'Manager', 'Employee'] as const;

/**
 * Role type display labels
 */
export const ROLE_TYPE_LABELS: Record<RoleType, string> = {
  system: 'System',
  custom: 'Custom',
};

/**
 * Role type color classes for badges
 */
export const ROLE_TYPE_COLORS: Record<RoleType, string> = {
  system: 'border-[#00AEEF]/30 text-[#00AEEF]',
  custom: 'border-[#00F5C6]/30 text-[#00F5C6]',
};

/**
 * Maximum number of custom roles allowed
 */
export const MAX_CUSTOM_ROLES = 50;

/**
 * Minimum permissions required for a role
 */
export const MIN_PERMISSIONS = 1;

/**
 * Role name validation regex
 */
export const ROLE_NAME_REGEX = /^[a-zA-Z0-9\s-_]+$/;
