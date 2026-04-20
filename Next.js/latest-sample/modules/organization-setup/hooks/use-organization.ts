import { useState, useEffect } from 'react';
import { OrganizationSettings } from '../types';
import { fetchOrganizationSettings } from '../api/organization-api';

export function useOrganization() {
  const [settings, setSettings] = useState<OrganizationSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizationSettings().then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}
