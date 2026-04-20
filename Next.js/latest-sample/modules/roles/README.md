# Roles Module

This module manages user roles and permissions with a modular, reusable architecture.

## Structure

```
roles/
├── api/
│   └── roles-api.ts          # API integration layer (CRUD operations)
├── components/
│   ├── role-stats.tsx        # Stats cards for total/system/custom roles
│   ├── role-search-bar.tsx   # Search input with glass styling
│   └── role-card.tsx         # Individual role card with permissions
├── constants/
│   └── index.ts              # Role constants (permissions, colors, limits)
├── hooks/
│   └── use-roles.ts          # React hook for roles state management
├── lib/
│   └── roles-helpers.ts      # Utility functions (filtering, sorting, validation)
├── pages/
│   └── roles-page.tsx        # Main roles page composition
├── schemas/
│   └── roles.schema.ts       # Zod validation schemas
├── types/
│   └── index.ts              # Role, RoleType, Permission type definitions
└── README.md                 # This file
```

## Components

### RoleStats
Displays three stat cards showing role counts:
- Total Roles (Shield icon, cyan-blue gradient)
- System Roles (Lock icon, blue gradient)
- Custom Roles (Users icon, transparent gradient)

**Props:**
- `totalRoles?: number` - Total number of roles (default: 5)
- `systemRoles?: number` - Number of system roles (default: 3)
- `customRoles?: number` - Number of custom roles (default: 2)

### RoleSearchBar
Search input with glass morphism styling.

**Props:**
- `onSearch?: (query: string) => void` - Search callback

### RoleCard
Individual role card displaying:
- Role icon and name
- Type badge (system/custom with color coding)
- User count badge
- Description
- Permissions summary (2-column grid with checkmarks)
- Edit button (if editable)
- Delete button (if deletable, red color)

**Props:**
- `role: Role` - Role object
- `onEdit?: (role: Role) => void` - Edit callback
- `onDelete?: (role: Role) => void` - Delete callback

### RolesPage
Main page composition with:
- Header with title and "Add Role" button
- Role statistics cards
- Search bar
- 2-column grid of role cards (lg breakpoint)

## Types

```typescript
type RoleType = 'system' | 'custom';

interface Permission {
  name: string;
  enabled: boolean;
}

interface Role {
  id: string;
  name: string;
  type: RoleType;
  userCount: number;
  description: string;
  permissions: Permission[];
  canEdit: boolean;
  canDelete: boolean;
}
```

## API Layer

### roles-api.ts
Provides API integration functions:
- `fetchRoles()` - Get all roles
- `fetchRoleById(id)` - Get single role
- `createRole(role)` - Create new role
- `updateRole(id, updates)` - Update existing role
- `deleteRole(id)` - Delete role
- `assignRoleToUsers(roleId, userIds)` - Assign role to users

## Hooks

### use-roles.ts
React hook for roles state management:

```typescript
const {
  roles,           // Filtered roles
  allRoles,        // All roles (unfiltered)
  isLoading,       // Loading state
  error,           // Error state
  stats,           // Role statistics
  searchQuery,     // Current search query
  loadRoles,       // Fetch roles from API
  addRole,         // Create new role
  editRole,        // Update role
  removeRole,      // Delete role
  search,          // Search roles
} = useRoles({ autoFetch: true });
```

## Schemas

### roles.schema.ts
Zod validation schemas:
- `permissionSchema` - Permission validation
- `roleTypeSchema` - Role type enum validation
- `roleSchema` - Complete role validation
- `createRoleSchema` - Create role validation
- `updateRoleSchema` - Update role validation
- `roleFilterSchema` - Filter/search validation

## Constants

### index.ts
Role-related constants:
- `DEFAULT_PERMISSIONS` - Default permission list
- `SYSTEM_ROLE_NAMES` - Protected system role names
- `ROLE_TYPE_LABELS` - Display labels for role types
- `ROLE_TYPE_COLORS` - Badge color classes
- `MAX_CUSTOM_ROLES` - Maximum custom roles allowed (50)
- `MIN_PERMISSIONS` - Minimum permissions required (1)
- `ROLE_NAME_REGEX` - Name validation pattern

## Utility Functions

### roles-helpers.ts
Helper functions for role operations:

**Role Checks:**
- `isSystemRole(role)` - Check if role is system role
- `canDeleteRole(role)` - Check if role can be deleted
- `canEditRole(role)` - Check if role can be edited

**Filtering & Sorting:**
- `filterRolesBySearch(roles, query)` - Filter by search query
- `filterRolesByType(roles, type)` - Filter by role type
- `sortRolesByUserCount(roles)` - Sort by user count
- `sortRolesByName(roles)` - Sort by name

**Statistics:**
- `getTotalUserCount(roles)` - Sum of all users
- `getRoleStats(roles)` - Get role statistics object

**Permissions:**
- `isPermissionEnabled(permissions, name)` - Check permission
- `countEnabledPermissions(permissions)` - Count enabled

**Validation:**
- `isRoleNameUnique(roles, name, excludeId)` - Validate name
- `formatRoleForDisplay(role)` - Format for UI display

## Design Patterns

All components follow the established design system:
- Glass morphism cards: `bg-[rgba(255,255,255,0.04)] backdrop-blur-xl`
- Border: `border-white/10` with hover `border-[#00F5C6]/30`
- Card shadows on hover: `hover:shadow-lg hover:shadow-[#00F5C6]/10`
- Type badges:
  - System: `border-[#00AEEF]/30 text-[#00AEEF]`
  - Custom: `border-[#00F5C6]/30 text-[#00F5C6]`
- Icon containers: `rounded-xl bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20`
- Rounded borders: `rounded-2xl`
- Responsive grid: `grid-cols-1 lg:grid-cols-2`

## Default Roles Data

The module includes 5 sample roles:
1. **Super Admin** (system, 2 users) - Full access
2. **Manager** (system, 12 users) - Team management
3. **HR Specialist** (custom, 4 users) - HR functions
4. **Team Lead** (custom, 8 users) - Team evaluations
5. **Employee** (system, 35 users) - Basic access

## Usage

```tsx
import { RolesPage } from '@/src/modules/roles/pages/roles-page';

export default function Page() {
  return <RolesPage />;
}
```

## Future Enhancements

- [ ] Add role creation modal/form
- [ ] Add role editing modal with permission toggles
- [ ] Add role deletion confirmation dialog
- [ ] Implement actual search/filter logic
- [ ] Add permission management UI
- [ ] Add role assignment to users
- [ ] Add role duplication feature
- [ ] Add audit log for role changes
- [ ] Add role templates
- [ ] Implement role hierarchy
