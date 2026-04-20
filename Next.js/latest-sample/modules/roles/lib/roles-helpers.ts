import { Role, RoleType, Permission } from '../types';
import { SYSTEM_ROLE_NAMES, ROLE_TYPE_COLORS } from '../constants';

/**
 * Check if a role is a system role
 */
export function isSystemRole(role: Role): boolean {
  return role.type === 'system' || SYSTEM_ROLE_NAMES.includes(role.name as any);
}

/**
 * Check if a role can be deleted
 */
export function canDeleteRole(role: Role): boolean {
  // System roles cannot be deleted
  if (isSystemRole(role)) {
    return false;
  }
  
  // Roles with users might need confirmation but are technically deletable
  return role.canDelete;
}

/**
 * Check if a role can be edited
 */
export function canEditRole(role: Role): boolean {
  return role.canEdit;
}

/**
 * Get role type badge classes
 */
export function getRoleTypeBadgeClasses(type: RoleType): string {
  return ROLE_TYPE_COLORS[type] || 'border-white/10 text-[#B0B6C1]';
}

/**
 * Filter roles by search query
 */
export function filterRolesBySearch(roles: Role[], query: string): Role[] {
  if (!query.trim()) {
    return roles;
  }

  const searchLower = query.toLowerCase();
  
  return roles.filter((role) => {
    const nameMatch = role.name.toLowerCase().includes(searchLower);
    const descriptionMatch = role.description.toLowerCase().includes(searchLower);
    const typeMatch = role.type.toLowerCase().includes(searchLower);
    
    return nameMatch || descriptionMatch || typeMatch;
  });
}

/**
 * Filter roles by type
 */
export function filterRolesByType(roles: Role[], type: RoleType | 'all'): Role[] {
  if (type === 'all') {
    return roles;
  }
  
  return roles.filter((role) => role.type === type);
}

/**
 * Sort roles by user count (descending)
 */
export function sortRolesByUserCount(roles: Role[]): Role[] {
  return [...roles].sort((a, b) => b.userCount - a.userCount);
}

/**
 * Sort roles by name (ascending)
 */
export function sortRolesByName(roles: Role[]): Role[] {
  return [...roles].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get total user count across all roles
 */
export function getTotalUserCount(roles: Role[]): number {
  return roles.reduce((total, role) => total + role.userCount, 0);
}

/**
 * Get role statistics
 */
export function getRoleStats(roles: Role[]) {
  const totalRoles = roles.length;
  const systemRoles = roles.filter((r) => r.type === 'system').length;
  const customRoles = roles.filter((r) => r.type === 'custom').length;
  const totalUsers = getTotalUserCount(roles);

  return {
    totalRoles,
    systemRoles,
    customRoles,
    totalUsers,
  };
}

/**
 * Check if permission is enabled
 */
export function isPermissionEnabled(permissions: Permission[], permissionName: string): boolean {
  const permission = permissions.find((p) => p.name === permissionName);
  return permission?.enabled ?? false;
}

/**
 * Count enabled permissions
 */
export function countEnabledPermissions(permissions: Permission[]): number {
  return permissions.filter((p) => p.enabled).length;
}

/**
 * Validate role name uniqueness
 */
export function isRoleNameUnique(roles: Role[], name: string, excludeId?: string): boolean {
  return !roles.some(
    (role) => role.name.toLowerCase() === name.toLowerCase() && role.id !== excludeId
  );
}

/**
 * Format role for display
 */
export function formatRoleForDisplay(role: Role) {
  return {
    ...role,
    typeBadgeClass: getRoleTypeBadgeClasses(role.type),
    isSystem: isSystemRole(role),
    canEdit: canEditRole(role),
    canDelete: canDeleteRole(role),
    enabledPermissionsCount: countEnabledPermissions(role.permissions),
  };
}
