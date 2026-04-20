import { Settings } from '../types';

export const DEFAULT_SETTINGS: Settings = {
  id: '1',
  profile: {
    name: 'Admin User',
    email: 'admin@Sample.com',
    role: 'Super Admin',
  },
  preferences: {
    language: 'English',
    timezone: 'America/New_York',
    theme: 'dark',
    notifications: true,
  },
  security: {
    twoFactorEnabled: true,
    sessionTimeout: 3600,
  },
};
