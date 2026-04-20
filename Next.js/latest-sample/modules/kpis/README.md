# KPIs Module

This module manages Key Performance Indicators (KPIs) with a modular, reusable architecture.

## Structure

```
kpis/
├── api/
│   └── kpis-api.ts           # API integration layer (CRUD operations)
├── components/
│   ├── kpi-pack-card.tsx     # KPI pack cards with emoji icons
│   ├── kpi-recommendations.tsx # AI recommendations card
│   ├── kpi-list-item.tsx     # Individual KPI list item
│   └── kpi-search-bar.tsx    # Search input with filters
├── constants/
│   └── index.ts              # KPI constants (packs, colors, limits)
├── hooks/
│   └── use-kpis.ts           # React hook for KPIs state management
├── lib/
│   └── kpis-helpers.ts       # Utility functions (filtering, sorting, validation)
├── pages/
│   └── kpis-page.tsx         # Main KPIs page composition
├── schemas/
│   └── kpis.schema.ts        # Zod validation schemas
├── types/
│   └── index.ts              # KPI, KPIPack, KPIStatus type definitions
└── README.md                 # This file
```

## Components

### KPIPackCard
Displays KPI pack with emoji and description:
- Emoji icon (🎯, 💰, 👥, 💻)
- Pack name and description
- KPI count badge
- "Add Pack" button
- Hover glow effect

**Props:**
- `pack: KPIPack` - Pack object
- `onAddPack?: (pack: KPIPack) => void` - Add pack callback

### KPIRecommendations
AI recommendations card with:
- Brain icon in gradient container
- Recommendation text
- "View Recommendations" button

**Props:**
- `onViewRecommendations?: () => void` - View callback

### KPIListItem
Individual KPI in list with:
- Target icon
- KPI name
- AI badge (if AI-generated)
- Department and weight info
- Status badge (active/draft/inactive)
- Edit button

**Props:**
- `kpi: KPI` - KPI object
- `onEdit?: (kpi: KPI) => void` - Edit callback

### KPISearchBar
Search and filter controls:
- Search input with icon
- Filters button

**Props:**
- `onSearch?: (query: string) => void` - Search callback
- `onFilter?: () => void` - Filter callback

### KPIsPage
Main page composition with:
- Header with "Create KPI" button
- KPI Packs section (4-column grid)
- AI Recommendations card
- Search bar
- Active KPIs list

## Types

```typescript
type KPIStatus = 'active' | 'draft' | 'inactive';

interface KPI {
  id: string;
  name: string;
  department: string;
  weight: number; // Percentage (0-100)
  status: KPIStatus;
  isAIGenerated?: boolean;
}

interface KPIPack {
  id: string;
  name: string;
  emoji: string;
  description: string;
  kpiCount: number;
}
```

## API Layer

### kpis-api.ts
Provides API integration functions:
- `fetchKPIs()` - Get all KPIs
- `fetchKPIPacks()` - Get all KPI packs
- `createKPI(kpi)` - Create new KPI
- `updateKPI(id, updates)` - Update existing KPI
- `deleteKPI(id)` - Delete KPI
- `addKPIPack(packId)` - Add pack to organization

## Hooks

### use-kpis.ts
React hook for KPIs state management:

```typescript
const {
  kpis,           // Filtered KPIs
  allKPIs,        // All KPIs (unfiltered)
  isLoading,      // Loading state
  error,          // Error state
  stats,          // KPI statistics
  searchQuery,    // Current search query
  loadKPIs,       // Fetch KPIs from API
  addKPI,         // Create new KPI
  editKPI,        // Update KPI
  removeKPI,      // Delete KPI
  search,         // Search KPIs
} = useKPIs({ autoFetch: true });
```

## Schemas

### kpis.schema.ts
Zod validation schemas:
- `kpiStatusSchema` - Status enum validation
- `kpiSchema` - Complete KPI validation
- `kpiPackSchema` - Pack validation
- `createKPISchema` - Create KPI validation
- `updateKPISchema` - Update KPI validation
- `kpiFilterSchema` - Filter/search validation

## Constants

### index.ts
KPI-related constants:
- `KPI_STATUS_LABELS` - Display labels for statuses
- `KPI_STATUS_COLORS` - Badge color classes
- `DEFAULT_KPI_PACKS` - 4 default packs (IT Support, Sales, HR, Engineering)
- `MAX_KPI_WEIGHT` - 100%
- `MIN_KPI_WEIGHT` - 0%
- `MAX_KPIS_PER_DEPARTMENT` - 50 limit

## Utility Functions

### kpis-helpers.ts
Helper functions for KPI operations:

**Status & Styling:**
- `getKPIStatusBadgeClasses(status)` - Get badge CSS classes

**Filtering:**
- `filterKPIsBySearch(kpis, query)` - Filter by search query
- `filterKPIsByStatus(kpis, status)` - Filter by status
- `filterKPIsByDepartment(kpis, department)` - Filter by department
- `filterAIGeneratedKPIs(kpis)` - Get AI-generated only

**Sorting:**
- `sortKPIsByWeight(kpis)` - Sort by weight descending
- `sortKPIsByName(kpis)` - Sort by name ascending

**Statistics & Calculations:**
- `getTotalWeightByDepartment(kpis, department)` - Sum weights
- `getUniqueDepartments(kpis)` - Get department list
- `getKPIStats(kpis)` - Get statistics object

**Validation:**
- `validateDepartmentWeights(kpis, department)` - Check total ≤ 100%
- `isKPINameUnique(kpis, name, department, excludeId)` - Check uniqueness

## Design Patterns

All components follow the established design system:
- Glass morphism cards: `bg-[rgba(255,255,255,0.04)] backdrop-blur-xl`
- Border: `border-white/10` with hover `border-[#00F5C6]/30`
- Hover glow: Gradient overlay with blur-xl
- Status badges:
  - Active: `border-[#00F5C6]/50 text-[#00F5C6]`
  - Draft: `border-yellow-400/50 text-yellow-400`
  - Inactive: `border-red-400/50 text-red-400`
- AI badge: `border-[#00AEEF]/50 text-[#00AEEF]` with Brain icon
- Rounded borders: `rounded-2xl` for cards, `rounded-lg` for list items
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

## Default Data

### KPI Packs (4 packs):
1. **IT Support Pack** 🎯 - 12 KPIs
2. **Sales Pack** 💰 - 8 KPIs
3. **HR Pack** 👥 - 10 KPIs
4. **Engineering Pack** 💻 - 15 KPIs

### Active KPIs (6 KPIs):
1. Customer Satisfaction Score (Support, 30%, AI)
2. First Response Time (Support, 25%, AI)
3. Ticket Resolution Rate (Support, 20%)
4. Sales Conversion Rate (Sales, 35%, AI)
5. Pipeline Velocity (Sales, 25%, Draft)
6. Code Review Quality (Engineering, 30%, AI)

## Usage

```tsx
import { KPIsPage } from '@/src/modules/kpis/pages/kpis-page';

export default function Page() {
  return <KPIsPage />;
}
```

## Future Enhancements

- [ ] Add KPI creation modal/form
- [ ] Add KPI editing modal with weight slider
- [ ] Add KPI deletion confirmation dialog
- [ ] Implement actual search/filter logic
- [ ] Add pack detail view with all included KPIs
- [ ] Add department weight validation UI
- [ ] Add KPI performance charts/trends
- [ ] Add AI recommendation details modal
- [ ] Add bulk KPI import/export
- [ ] Add KPI templates
- [ ] Implement real-time KPI tracking
- [ ] Add KPI goal setting and tracking
