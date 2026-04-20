/**
 * Assessments API
 */

import { Assessment } from '../types';
import { DEFAULT_ASSESSMENTS } from '../constants';

export async function fetchAssessments(): Promise<Assessment[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEFAULT_ASSESSMENTS;
}

export async function createAssessment(data: Partial<Assessment>): Promise<Assessment> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return { ...data, id: String(Date.now()) } as Assessment;
}
