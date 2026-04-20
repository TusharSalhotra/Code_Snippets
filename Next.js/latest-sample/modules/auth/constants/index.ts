export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
} as const;

export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  LOGIN_ERROR: 'Invalid email or password',
  REGISTER_SUCCESS: 'Account created successfully',
  REGISTER_ERROR: 'Failed to create account',
  LOGOUT_SUCCESS: 'Successfully logged out',
  FORGOT_PASSWORD_SUCCESS: 'Password reset email sent',
  FORGOT_PASSWORD_ERROR: 'Failed to send reset email',
} as const;
