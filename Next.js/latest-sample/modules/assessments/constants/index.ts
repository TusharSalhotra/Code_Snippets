/**
 * Assessment Constants
 */

import { Assessment } from '../types';

export const DEFAULT_ASSESSMENTS: Assessment[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of core JavaScript concepts',
    type: 'skill',
    departmentId: '1',
    departmentName: 'Engineering',
    status: 'active',
    totalQuestions: 25,
    duration: 45,
    passingScore: 70,
    assignedTo: 45,
    completedBy: 38,
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
  },
  {
    id: '2',
    title: 'Sales Performance Review',
    description: 'Quarterly sales performance assessment',
    type: 'performance',
    departmentId: '2',
    departmentName: 'Sales',
    status: 'active',
    totalQuestions: 15,
    duration: 30,
    passingScore: 65,
    assignedTo: 32,
    completedBy: 28,
    createdAt: '2024-10-15T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
  },
];
