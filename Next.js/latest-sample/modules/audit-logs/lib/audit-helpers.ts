import { AuditLog } from '../types';

export function filterLogsByStatus(logs: AuditLog[], status: 'success' | 'failed'): AuditLog[] {
  return logs.filter(log => log.status === status);
}
