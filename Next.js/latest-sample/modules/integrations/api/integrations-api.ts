import { Integration } from '../types';
import { DEFAULT_INTEGRATIONS } from '../constants';

export async function fetchIntegrations(): Promise<Integration[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEFAULT_INTEGRATIONS;
}
