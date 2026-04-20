/**
 * Assessments Helpers
 */

import { Assessment, AssessmentStats } from '../types';

export function getAssessmentStats(assessments: Assessment[]): AssessmentStats {
  const activeAssessments = assessments.filter(a => a.status === 'active');
  const totalCompletions = assessments.reduce((sum, a) => sum + a.completedBy, 0);
  
  return {
    totalAssessments: assessments.length,
    activeAssessments: activeAssessments.length,
    totalCompletions,
    averageScore: 75, // Placeholder
  };
}
