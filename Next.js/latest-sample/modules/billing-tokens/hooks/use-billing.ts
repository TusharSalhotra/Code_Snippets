import { useState, useEffect } from 'react';
import { BillingInfo } from '../types';
import { fetchBillingInfo } from '../api/billing-api';

export function useBilling() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingInfo().then(data => {
      setBilling(data);
      setLoading(false);
    });
  }, []);

  return { billing, loading };
}
