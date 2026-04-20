import { useState, useEffect } from 'react';
import { AIModel } from '../types';
import { fetchAIModels } from '../api/ai-api';

export function useAIManagement() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIModels().then(data => {
      setModels(data);
      setLoading(false);
    });
  }, []);

  return { models, loading };
}
