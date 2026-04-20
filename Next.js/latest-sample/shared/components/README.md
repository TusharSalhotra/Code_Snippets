# AddUserModal - Shared Component

A reusable, fully customizable modal component for adding users, built with ShadCN UI components.

## Features

- ✅ **Fully Reusable** - Use across different modules
- ✅ **Props-based Configuration** - All data and actions passed via props
- ✅ **Form Validation** - Zod schema validation with React Hook Form
- ✅ **Customizable Options** - Custom departments, roles, and managers
- ✅ **Loading States** - Built-in loading indicator support
- ✅ **ShadCN UI** - Uses Dialog, Input, Select, Button, Label components

## Usage

### Basic Usage

```tsx
import { AddUserModal } from '@/src/shared/components/AddUserModal';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data) => {
    console.log('User data:', data);
    // Handle user creation
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Add User</button>
      
      <AddUserModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
```

### With Redux

```tsx
import { AddUserModal } from '@/src/shared/components/AddUserModal';
import { useAppDispatch } from '@/src/store/hooks';
import { addUser } from '@/src/store/slices/usersSlice';

function UsersPage() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleUserSubmit = async (data) => {
    dispatch(addUser(data));
  };

  return (
    <AddUserModal
      open={isOpen}
      onOpenChange={setIsOpen}
      onSubmit={handleUserSubmit}
    />
  );
}
```

### With Custom Data

```tsx
<AddUserModal
  open={isOpen}
  onOpenChange={setIsOpen}
  onSubmit={handleSubmit}
  departments={['Sales', 'Marketing', 'Support']}
  roles={['Manager', 'Team Lead', 'Associate']}
  managers={[
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' }
  ]}
  isLoading={isSubmitting}
  showInviteNotice={true}
/>
```

### With API Integration

```tsx
const handleUserSubmit = async (data) => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      // User created successfully
      const newUser = await response.json();
      // Update your state
    }
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

<AddUserModal
  open={isOpen}
  onOpenChange={setIsOpen}
  onSubmit={handleUserSubmit}
  isLoading={isSubmitting}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controls modal visibility (required) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when modal open state changes (required) |
| `onSubmit` | `(data: CreateUserFormData) => void \| Promise<void>` | - | Callback when form is submitted (required) |
| `departments` | `string[]` | Default list | Array of department names |
| `roles` | `string[]` | Default list | Array of role names |
| `managers` | `Array<{id: string, name: string}>` | Default list | Array of manager objects |
| `isLoading` | `boolean` | `false` | Shows loading state on submit button |
| `showInviteNotice` | `boolean` | `true` | Shows/hides email invitation notice |

## Form Data Structure

The `onSubmit` callback receives data in this format:

```typescript
interface CreateUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  manager?: string;        // Optional
  sendInvite?: boolean;    // Optional, defaults to true
}
```

## Validation

Form validation is handled automatically using Zod schema:

- **First Name**: Required, max 50 characters
- **Last Name**: Required, max 50 characters
- **Email**: Required, valid email format
- **Department**: Required
- **Role**: Required
- **Manager**: Optional
- **Send Invite**: Optional, defaults to true

## Styling

The modal uses your design system's theme:
- Dark background (`#0A0F1C`)
- Cyan/blue gradient accents (`#00F5C6`, `#00AEEF`)
- Responsive layout (mobile-friendly)
- Accessible components

## Examples in the Codebase

See `/src/modules/users/pages/users-page.tsx` for a complete implementation example.
