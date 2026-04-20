import { APIKey } from '../types';

export const DEFAULT_API_KEYS: APIKey[] = [
  { id: '1', name: 'Production API', key: 'sk_live_1234...', permissions: 'read-write', createdAt: '2024-10-01T00:00:00Z', lastUsed: '2024-11-10T10:00:00Z', status: 'active' },
  { id: '2', name: 'Development API', key: 'sk_test_5678...', permissions: 'read-only', createdAt: '2024-09-15T00:00:00Z', lastUsed: '2024-11-09T15:00:00Z', status: 'active' },
];
