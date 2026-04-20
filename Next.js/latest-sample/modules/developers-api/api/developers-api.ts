import { APIKey } from '../types';
import { DEFAULT_API_KEYS } from '../constants';

export async function fetchAPIKeys(): Promise<APIKey[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEFAULT_API_KEYS;
}
