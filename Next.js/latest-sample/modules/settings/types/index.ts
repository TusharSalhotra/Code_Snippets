export interface Settings {
  id: string;
  profile: {
    name: string;
    email: string;
    role: string;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
}
