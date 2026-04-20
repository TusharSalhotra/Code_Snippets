import { PermissionCategory } from '../types';

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'users',
    name: 'Users & Teams',
    icon: 'shield',
    permissions: [
      { id: 'users-view', name: 'View Users', category: 'users', checked: false },
      { id: 'users-create', name: 'Create Users', category: 'users', checked: false },
      { id: 'users-edit', name: 'Edit Users', category: 'users', checked: false },
      { id: 'users-delete', name: 'Delete Users', category: 'users', checked: false },
    ],
  },
  {
    id: 'departments',
    name: 'Departments',
    icon: 'shield',
    permissions: [
      { id: 'departments-view', name: 'View Departments', category: 'departments', checked: false },
      { id: 'departments-create', name: 'Create Departments', category: 'departments', checked: false },
      { id: 'departments-edit', name: 'Edit Departments', category: 'departments', checked: false },
      { id: 'departments-delete', name: 'Delete Departments', category: 'departments', checked: false },
    ],
  },
  {
    id: 'kpis',
    name: 'KPI Management',
    icon: 'shield',
    permissions: [
      { id: 'kpis-view', name: 'View KPIs', category: 'kpis', checked: false },
      { id: 'kpis-create', name: 'Create KPIs', category: 'kpis', checked: false },
      { id: 'kpis-edit', name: 'Edit KPIs', category: 'kpis', checked: false },
      { id: 'kpis-delete', name: 'Delete KPIs', category: 'kpis', checked: false },
    ],
  },
  {
    id: 'assessments',
    name: 'Assessments',
    icon: 'shield',
    permissions: [
      { id: 'assessments-view', name: 'View Assessments', category: 'assessments', checked: false },
      { id: 'assessments-create', name: 'Create Assessments', category: 'assessments', checked: false },
      { id: 'assessments-edit', name: 'Edit Assessments', category: 'assessments', checked: false },
      { id: 'assessments-delete', name: 'Delete Assessments', category: 'assessments', checked: false },
    ],
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    icon: 'shield',
    permissions: [
      { id: 'reports-view', name: 'View Reports', category: 'reports', checked: false },
      { id: 'reports-create', name: 'Create Reports', category: 'reports', checked: false },
      { id: 'reports-export', name: 'Export Reports', category: 'reports', checked: false },
    ],
  },
  {
    id: 'ai',
    name: 'AI Management',
    icon: 'shield',
    permissions: [
      { id: 'ai-view', name: 'View AI Config', category: 'ai', checked: false },
      { id: 'ai-configure', name: 'Configure AI', category: 'ai', checked: false },
      { id: 'ai-train', name: 'Train Models', category: 'ai', checked: false },
    ],
  },
  {
    id: 'settings',
    name: 'Settings & Security',
    icon: 'shield',
    permissions: [
      { id: 'settings-view', name: 'View Settings', category: 'settings', checked: false },
      { id: 'settings-edit', name: 'Edit Settings', category: 'settings', checked: false },
    ],
  },
];
