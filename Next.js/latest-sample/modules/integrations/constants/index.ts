import { Integration } from '../types';

export const DEFAULT_INTEGRATIONS: Integration[] = [
  { id: '1', name: 'Slack', description: 'Team communication platform', provider: 'Slack Technologies', status: 'connected', category: 'communication', connectedAt: '2024-10-01T00:00:00Z' },
  { id: '2', name: 'Google Workspace', description: 'Productivity and collaboration tools', provider: 'Google', status: 'connected', category: 'hr', connectedAt: '2024-09-15T00:00:00Z' },
  { id: '3', name: 'Salesforce', description: 'CRM platform', provider: 'Salesforce', status: 'disconnected', category: 'analytics' },
];
