# Sidebar Component

This project now includes a properly structured sidebar component following shadcn/ui conventions.

## Files Structure

```
src/components/
├── app-sidebar.tsx          # Main sidebar component (follows shadcn/ui conventions)
├── layout.tsx              # Layout components with different configurations  
├── sidebar-example.tsx     # Legacy component (can be removed)
└── ui/
    ├── sidebar.tsx         # Base sidebar UI components
    └── collapsible.tsx     # Collapsible UI component
```

## Components

### AppSidebar (`app-sidebar.tsx`)

The main sidebar component that follows shadcn/ui best practices:

- **Proper structure**: Uses `SidebarHeader`, `SidebarContent`, `SidebarFooter`
- **Navigation groups**: Organized with `SidebarGroup` and `SidebarGroupLabel`
- **Collapsible menus**: Supports nested navigation with `Collapsible` components
- **User integration**: Displays user info from localStorage
- **Active state**: Highlights current page
- **Responsive**: Works on mobile and desktop

### Layout Components (`layout.tsx`)

Three different layout options:

1. **DashboardLayout**: Full featured with header and breadcrumb
2. **SimpleDashboardLayout**: Minimal layout with just trigger
3. **PersistentDashboardLayout**: Includes state persistence

## Usage

### Basic Usage

```tsx
import { DashboardLayout } from "@/components/layout"

function MyPage() {
  return (
    <DashboardLayout>
      <h1>My Page Content</h1>
    </DashboardLayout>
  )
}
```

### Direct Sidebar Usage

```tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

function CustomLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
```

## Customization

### Adding Menu Items

Edit the `data` object in `app-sidebar.tsx`:

```tsx
const data = {
  navMain: [
    {
      title: "New Section",
      url: "/new-section",
      icon: YourIcon,
      items: [ // Optional submenu
        {
          title: "Subsection",
          url: "/new-section/sub",
        },
      ],
    },
  ],
}
```

### Styling

The sidebar uses CSS variables for theming (already configured in `index.css`):

- `--sidebar-background`
- `--sidebar-foreground`
- `--sidebar-primary`
- `--sidebar-accent`
- `--sidebar-border`

### Keyboard Shortcuts

- `Ctrl/Cmd + B`: Toggle sidebar

## Features

- ✅ Icon collapse mode
- ✅ Mobile responsive
- ✅ Keyboard shortcuts
- ✅ Persistent state support
- ✅ Active page highlighting
- ✅ Nested navigation
- ✅ User avatar/info
- ✅ Dropdown menus
- ✅ Proper accessibility
- ✅ TypeScript support

## Migration from Legacy

Replace your old sidebar imports:

```tsx
// Old
import { AppSidebar } from "@/components/sidebar-example"

// New  
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardLayout } from "@/components/layout"
```

The new implementation follows all shadcn/ui best practices and conventions.
