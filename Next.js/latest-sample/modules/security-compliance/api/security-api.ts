import { SecuritySettings } from '../types';
import { DEFAULT_SECURITY } from '../constants';

export async function fetchSecuritySettings(): Promise<SecuritySettings> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEFAULT_SECURITY;
}
