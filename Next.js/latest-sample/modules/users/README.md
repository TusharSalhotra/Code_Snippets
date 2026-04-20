# Users Module

This module manages user and team functionality with a modular, reusable architecture.

## Structure

```
users/
├── components/
│   ├── user-table.tsx        # Reusable table with hover effects, skill scores
│   └── user-search-bar.tsx   # Search, filter, and export controls
├── pages/
│   └── users-page.tsx        # Main users page composition
└── types/
    └── index.ts              # User and UserStatus type definitions
```

## Components

### UserTable
Displays users in a table format with:
- Avatar with gradient initials
- User name and email
- Role and department
- Status badge (active/pending/inactive)
- Skill score with progress bar
- Action menu button

**Props:**
- `users?: User[]` - Array of users (defaults to sample data)
- `onUserClick?: (user: User) => void` - Callback when row is clicked

### UserSearchBar
Search and filter controls with:
- Search input with icon
- Filter button
- Export button

**Props:**
- `onSearch?: (query: string) => void` - Search callback
- `onFilter?: () => void` - Filter callback
- `onExport?: () => void` - Export callback

### UsersPage
Main page composition with:
- Header with title and description
- Action buttons (Import CSV, Add User)
- Search bar
- User table

## Types

```typescript
type UserStatus = 'active' | 'pending' | 'inactive';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: UserStatus;
  skillScore: number;
  avatar?: string;
}
```

## Design Patterns

All components follow the established design system:
- Glass morphism cards: `bg-[rgba(255,255,255,0.04)] backdrop-blur-xl`
- Hover glow effects with gradient overlays
- Cyan-to-blue gradient: `from-[#00F5C6] to-[#00AEEF]`
- Status-based color coding
- Rounded borders: `rounded-2xl`
- Responsive layouts with Tailwind breakpoints

## Usage

```tsx
import { UsersPage } from '@/src/modules/users/pages/users-page';

export default function Page() {
  return <UsersPage />;
}
```

## Future Enhancements

- [ ] Add user detail modal/page
- [ ] Implement actual search/filter logic
- [ ] Add CSV import functionality
- [ ] Add user form for create/edit
- [ ] Implement pagination
- [ ] Add role-based permissions
- [ ] Add bulk actions (delete, export selected)
- [ ] Add user analytics/insights
