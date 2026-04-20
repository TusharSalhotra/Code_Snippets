import { useState, useEffect } from 'react';
import { SecuritySettings } from '../types';
import { fetchSecuritySettings } from '../api/security-api';

export function useSecurity() {
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecuritySettings().then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}
