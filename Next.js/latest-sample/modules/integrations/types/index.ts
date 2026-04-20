export interface Integration {
  id: string;
  name: string;
  description: string;
  provider: string;
  status: 'connected' | 'disconnected';
  category: 'hr' | 'communication' | 'analytics' | 'storage';
  connectedAt?: string;
}
