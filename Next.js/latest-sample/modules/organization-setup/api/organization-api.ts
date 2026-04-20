import { OrganizationSettings } from '../types';
import { DEFAULT_ORG_SETTINGS } from '../constants';

export async function fetchOrganizationSettings(): Promise<OrganizationSettings> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEFAULT_ORG_SETTINGS;
}
