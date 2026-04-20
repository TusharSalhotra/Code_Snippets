export interface SecuritySettings {
  id: string;
  twoFactorEnabled: boolean;
  ssoEnabled: boolean;
  passwordPolicy: 'weak' | 'medium' | 'strong';
  sessionTimeout: number;
}
