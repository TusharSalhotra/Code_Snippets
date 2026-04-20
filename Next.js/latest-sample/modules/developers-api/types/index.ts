export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: 'read-only' | 'read-write' | 'full-access';
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'revoked';
}

export interface CreateAPIKeyInput {
  name: string;
  permissions: 'read-only' | 'read-write' | 'full-access';
}
