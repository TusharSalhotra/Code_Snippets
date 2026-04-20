import { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

export async function fetchSettings(): Promise<Settings> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEFAULT_SETTINGS;
}
