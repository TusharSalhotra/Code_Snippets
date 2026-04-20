export type RoleType = 'system' | 'custom';
export type RoleStatus = 'active' | 'inactive';

export interface Permission {
  name: string;
  enabled: boolean;
}

export interface PermissionCategory {
  id: string;
  name: string;
  icon: string;
  permissions: PermissionItem[];
}

export interface PermissionItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export interface Role {
  id: string;
  name: string;
  type: RoleType;
  userCount: number;
  description: string;
  permissions: Permission[];
  permissionIds?: string[]; // Array of permission IDs for easier management
  canEdit: boolean;
  canDelete: boolean;
  status?: RoleStatus;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleInput {
  name: string;
  description: string;
  permissions: string[]; // Array of permission IDs
}

export interface UpdateRoleInput extends Partial<CreateRoleInput> {
  id: string;
  status?: RoleStatus;
}
