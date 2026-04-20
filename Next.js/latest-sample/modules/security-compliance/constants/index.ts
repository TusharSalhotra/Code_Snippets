import { SecuritySettings } from '../types';

export const DEFAULT_SECURITY: SecuritySettings = {
  id: '1',
  twoFactorEnabled: true,
  ssoEnabled: false,
  passwordPolicy: 'strong',
  sessionTimeout: 3600,
};
