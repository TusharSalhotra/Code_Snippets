import { useState, useEffect } from 'react';
import { Integration } from '../types';
import { fetchIntegrations } from '../api/integrations-api';

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations().then(data => {
      setIntegrations(data);
      setLoading(false);
    });
  }, []);

  return { integrations, loading };
}
