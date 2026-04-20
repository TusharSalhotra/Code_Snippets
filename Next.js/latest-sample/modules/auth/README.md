# Auth Module

Complete authentication module for Sample Admin with modular architecture.

## Structure

```
components/auth/
├── api/                          # API layer
│   └── auth-api.ts              # Authentication API calls
├── components/                   # UI Components
│   ├── auth-layout.tsx          # Shared layout for auth pages
│   └── login-form.tsx           # Login form component
├── constants/                    # Constants
│   └── index.ts                 # Auth routes, storage keys, messages
├── hooks/                        # Custom Hooks
│   ├── use-auth.ts              # Main authentication hook
│   └── use-login.ts             # Login-specific hook
├── lib/                         # Helper Functions
│   └── auth-helpers.ts          # Token/user storage helpers
├── providers/                    # Context Providers
│   └── auth-provider.tsx        # Auth context provider
├── schemas/                      # Validation Schemas
│   └── auth.schema.ts           # Zod validation schemas
├── pages/                        # Page Components
│   ├── login-page.tsx           # Login page
│   ├── register-page.tsx        # Register page
│   └── forgot-password-page.tsx # Forgot password page
└── types/                        # TypeScript Types
    └── index.ts                 # Type definitions
```

## Routes

The route files in `app/(auth)/` are thin wrappers that redirect to the auth module:

- `/login` → `components/auth/pages/login-page.tsx`
- `/register` → `components/auth/pages/register-page.tsx`
- `/forgot-password` → `components/auth/pages/forgot-password-page.tsx`

## Usage

### Login

```tsx
import { useLogin } from '@/components/auth/hooks/use-login';

const { login, isLoading, error } = useLogin();

await login({ email, password, rememberMe: true });
```

### Auth State

```tsx
import { useAuth } from '@/components/auth/hooks/use-auth';

const { user, isAuthenticated, logout } = useAuth();
```

### Auth Provider

Wrap your app with the AuthProvider:

```tsx
import { AuthProvider } from '@/components/auth/providers/auth-provider';

<AuthProvider>
  <YourApp />
</AuthProvider>
```

## Features

- ✅ Login functionality
- ✅ Form validation with Zod
- ✅ Token management
- ✅ User state management
- ✅ Loading states
- ✅ Error handling
- 🚧 Registration (coming soon)
- 🚧 Password recovery (coming soon)

## API Integration

The auth API in `components/auth/api/auth-api.ts` currently uses mock data. Replace the mock implementation with your actual API endpoints.

## Type Safety

All types are defined in `components/auth/types/index.ts`:
- `User` - User object
- `LoginCredentials` - Login form data
- `RegisterData` - Registration form data
- `AuthResponse` - API response
- `AuthState` - Authentication state
