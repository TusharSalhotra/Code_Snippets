/**
 * useAssessments Hook
 */

import { useState, useEffect } from 'react';
import { Assessment } from '../types';
import { fetchAssessments } from '../api/assessments-api';

export function useAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments().then(data => {
      setAssessments(data);
      setLoading(false);
    });
  }, []);

  return { assessments, loading };
}
