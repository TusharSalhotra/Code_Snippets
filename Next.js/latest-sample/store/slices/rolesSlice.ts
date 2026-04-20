import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role, CreateRoleInput } from '@/src/modules/roles/types';

interface RolesState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    type: 'system',
    description: 'Full system access with all permissions',
    permissions: [],
    permissionIds: [
      'users-view', 'users-create', 'users-edit', 'users-delete',
      'departments-view', 'departments-create', 'departments-edit', 'departments-delete',
      'kpis-view', 'kpis-create', 'kpis-edit', 'kpis-delete',
      'assessments-view', 'assessments-create', 'assessments-edit', 'assessments-delete',
      'reports-view', 'reports-create', 'reports-export',
      'ai-view', 'ai-configure', 'ai-train',
      'settings-view', 'settings-edit',
    ],
    userCount: 5,
    status: 'active',
    isSystem: true,
    canEdit: false,
    canDelete: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-11-10',
  },
  {
    id: '2',
    name: 'Manager',
    type: 'custom',
    description: 'Team and department management with limited admin access',
    permissions: [],
    permissionIds: [
      'users-view', 'users-edit',
      'departments-view', 'departments-edit',
      'kpis-view', 'kpis-create', 'kpis-edit',
      'assessments-view', 'assessments-create',
      'reports-view', 'reports-create',
    ],
    userCount: 12,
    status: 'active',
    isSystem: false,
    canEdit: true,
    canDelete: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-11-10',
  },
  {
    id: '3',
    name: 'Team Lead',
    type: 'custom',
    description: 'Team oversight and KPI management',
    permissions: [],
    permissionIds: [
      'users-view',
      'departments-view',
      'kpis-view', 'kpis-create', 'kpis-edit',
      'assessments-view', 'assessments-create',
      'reports-view',
    ],
    userCount: 25,
    status: 'active',
    isSystem: false,
    canEdit: true,
    canDelete: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-11-10',
  },
  {
    id: '4',
    name: 'Employee',
    type: 'system',
    description: 'Basic access for regular employees',
    permissions: [],
    permissionIds: [
      'users-view',
      'departments-view',
      'kpis-view',
      'assessments-view',
      'reports-view',
    ],
    userCount: 150,
    status: 'active',
    isSystem: true,
    canEdit: false,
    canDelete: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-11-10',
  },
];

const initialState: RolesState = {
  roles: mockRoles,
  loading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    addRole: (state, action: PayloadAction<CreateRoleInput>) => {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: action.payload.name,
        type: 'custom',
        description: action.payload.description,
        permissions: [],
        permissionIds: action.payload.permissions,
        status: 'active',
        userCount: 0,
        isSystem: false,
        canEdit: true,
        canDelete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.roles.unshift(newRole);
    },
    updateRole: (state, action: PayloadAction<Role>) => {
      const index = state.roles.findIndex(role => role.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteRole: (state, action: PayloadAction<string>) => {
      state.roles = state.roles.filter(role => role.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addRole, updateRole, deleteRole, setLoading, setError } = rolesSlice.actions;
export default rolesSlice.reducer;
