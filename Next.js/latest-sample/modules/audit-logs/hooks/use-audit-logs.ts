import { useState, useEffect } from 'react';
import { AuditLog } from '../types';
import { fetchAuditLogs } from '../api/audit-api';

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs().then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return { logs, loading };
}
