# Dashboard Module

Complete dashboard module for Sample Admin with modular architecture.

## Structure

```
modules/dashboard/
├── api/                          # API layer
│   └── dashboard-api.ts         # Dashboard API calls
├── components/                   # UI Components
│   ├── dashboard-layout.tsx     # Main dashboard layout
│   ├── stats-card.tsx           # Statistics card component
│   ├── recent-activity.tsx      # Recent activity component
│   └── charts/                  # Chart components
│       └── performance-chart.tsx
├── constants/                    # Constants
│   └── index.ts                 # Dashboard routes, configs
├── hooks/                        # Custom Hooks
│   └── use-dashboard-stats.ts   # Dashboard statistics hook
├── lib/                         # Helper Functions
│   └── dashboard-helpers.ts     # Helper utilities
├── pages/                        # Page Components
│   └── dashboard-page.tsx       # Main dashboard page
└── types/                        # TypeScript Types
    └── index.ts                 # Type definitions
```

## Routes

The route files in `app/(app)/dashboard/` are thin wrappers:

- `/dashboard` → `modules/dashboard/pages/dashboard-page.tsx`

## Usage

```tsx
import { DashboardPage } from '@/modules/dashboard/pages/dashboard-page';
```
