# Departments Module

Complete department management module following the Sample Admin modular architecture.

## Structure

```
departments/
├── api/                    # API functions
│   └── departments-api.ts
├── components/            # React components
│   ├── department-card.tsx
│   ├── department-search-bar.tsx
│   └── department-stats.tsx
├── constants/             # Constants and default data
│   └── index.ts
├── hooks/                 # React hooks
│   └── use-departments.ts
├── lib/                   # Helper functions
│   └── departments-helpers.ts
├── pages/                 # Page components
│   └── departments-page.tsx
├── schemas/               # Zod validation schemas
│   └── departments.schema.ts
├── types/                 # TypeScript types
│   └── index.ts
└── README.md
```

## Features

- **Department Management**: Create, read, update, and delete departments
- **Statistics Dashboard**: Overview of total departments, active status, and employee counts
- **Search & Filter**: Filter departments by name, status, and employee count
- **Card-Based Layout**: Visual department cards with key metrics
- **Budget Tracking**: Track department budgets
- **Location Management**: Assign physical locations to departments

## Components

### DepartmentsPage
Main page component with stats, search, and department grid.

### DepartmentStats
Displays three key statistics:
- Total Departments
- Active Departments  
- Total Employees

### DepartmentSearchBar
Search input for filtering departments by name, description, or head.

### DepartmentCard
Individual department card showing:
- Department name and status
- Description
- Head of department
- Location
- Employee count, KPI count, and budget
- Edit and delete actions

## API Functions

- `fetchDepartments(filters?)` - Get all departments with optional filters
- `fetchDepartmentById(id)` - Get single department
- `createDepartment(data)` - Create new department
- `updateDepartment(id, data)` - Update existing department
- `deleteDepartment(id)` - Delete department
- `archiveDepartment(id)` - Archive department

## Hooks

### useDepartments
Main hook for department state management:
- `departments` - Array of departments
- `loading` - Loading state
- `error` - Error message
- `loadDepartments()` - Reload departments
- `addDepartment(data)` - Add new department
- `editDepartment(id, data)` - Update department
- `removeDepartment(id)` - Delete department
- `search(query)` - Search departments
- `filterByStatus(status)` - Filter by status

## Types

```typescript
interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string;
  headOfDepartmentId: string;
  employeeCount: number;
  kpiCount: number;
  status: 'active' | 'inactive' | 'archived';
  budget?: number;
  location?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Helper Functions

- `filterDepartmentsBySearch()` - Filter by search query
- `filterDepartmentsByStatus()` - Filter by status
- `sortDepartmentsByEmployeeCount()` - Sort by employee count
- `sortDepartmentsByName()` - Sort alphabetically
- `getDepartmentStats()` - Calculate statistics
- `getTotalBudget()` - Sum all department budgets
- `getTopDepartmentsBySize()` - Get largest departments
- `formatBudget()` - Format currency display

## Default Data

Includes 6 sample departments:
- Engineering (45 employees, $2.5M budget)
- Sales (32 employees, $1.8M budget)
- Human Resources (12 employees, $850K budget)
- Marketing (18 employees, $1.2M budget)
- Finance (15 employees, $950K budget)
- Customer Support (28 employees, $1.1M budget)

## Usage

```tsx
import { DepartmentsPage } from '@/src/modules/departments/pages/departments-page';

export default function Page() {
  return <DepartmentsPage />;
}
```

## Design System

- **Glass Morphism**: `bg-[rgba(255,255,255,0.04)] backdrop-blur-xl`
- **Borders**: `border-white/10` with hover `border-white/20`
- **Gradients**: From `#00F5C6` to `#00AEEF`
- **Text Colors**: White for primary, `#B0B6C1` for secondary
- **Status Colors**: Cyan (active), Yellow (inactive), Gray (archived)

## Future Enhancements

- Department hierarchy visualization
- Budget analytics and trends
- Employee assignment interface
- KPI management integration
- Department templates
- Bulk operations
- Export to CSV/PDF
- Advanced filtering options
