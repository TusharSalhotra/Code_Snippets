export interface AuditLog {
  id: string;
  action: string;
  user: string;
  userId: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'failed';
}
