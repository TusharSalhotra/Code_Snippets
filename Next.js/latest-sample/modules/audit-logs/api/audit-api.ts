import { AuditLog } from '../types';
import { DEFAULT_AUDIT_LOGS } from '../constants';

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEFAULT_AUDIT_LOGS;
}
