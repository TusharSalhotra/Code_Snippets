import { useState, useEffect } from 'react';
import { Settings } from '../types';
import { fetchSettings } from '../api/settings-api';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings().then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}
