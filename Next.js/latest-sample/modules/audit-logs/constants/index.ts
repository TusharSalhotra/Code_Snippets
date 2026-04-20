import { AuditLog } from '../types';

export const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  { id: '1', action: 'User Login', user: 'John Doe', userId: '1', resource: 'Authentication', timestamp: '2024-11-10T10:30:00Z', ipAddress: '192.168.1.100', status: 'success' },
  { id: '2', action: 'Updated Department', user: 'Sarah Johnson', userId: '2', resource: 'Engineering', timestamp: '2024-11-10T09:15:00Z', ipAddress: '192.168.1.101', status: 'success' },
  { id: '3', action: 'Failed Login Attempt', user: 'Unknown', userId: '0', resource: 'Authentication', timestamp: '2024-11-10T08:45:00Z', ipAddress: '192.168.1.102', status: 'failed' },
];
