import { useState, useEffect } from 'react';
import { APIKey } from '../types';
import { fetchAPIKeys } from '../api/developers-api';

export function useDevelopers() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPIKeys().then(data => {
      setApiKeys(data);
      setLoading(false);
    });
  }, []);

  return { apiKeys, loading };
}
