import { Integration } from '../types';

export function getConnectedIntegrations(integrations: Integration[]): Integration[] {
  return integrations.filter(i => i.status === 'connected');
}
