/**
 * Assessments Zustand Store
 */

import { create } from 'zustand';
import type { Assessment } from '@/modules/assessments/types';

interface AssessmentsState {
  assessments: Assessment[];
  addAssessment: (assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAssessment: (id: string, data: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;
}

export const useAssessmentsStore = create<AssessmentsState>((set) => ({
  assessments: [
    {
      id: '1',
      title: 'Q3 2024 Performance Review',
      description: 'Quarterly performance assessment for all employees',
      type: 'performance',
      departmentId: '1',
      departmentName: 'All Departments',
      status: 'active',
      totalQuestions: 25,
      duration: 60,
      passingScore: 70,
      assignedTo: 124,
      completedBy: 89,
      createdAt: '2024-07-01T00:00:00Z',
      updatedAt: '2024-09-30T00:00:00Z',
    },
    {
      id: '2',
      title: 'Technical Skills Assessment',
      description: 'Engineering technical competency evaluation',
      type: 'skill',
      departmentId: '2',
      departmentName: 'Engineering',
      status: 'active',
      totalQuestions: 30,
      duration: 90,
      passingScore: 75,
      assignedTo: 45,
      completedBy: 32,
      createdAt: '2024-08-15T00:00:00Z',
      updatedAt: '2024-09-15T00:00:00Z',
    },
    {
      id: '3',
      title: 'Sales Training Certification',
      description: 'Certification for new sales methodology',
      type: 'certification',
      departmentId: '3',
      departmentName: 'Sales',
      status: 'active',
      totalQuestions: 20,
      duration: 45,
      passingScore: 80,
      assignedTo: 28,
      completedBy: 24,
      createdAt: '2024-08-01T00:00:00Z',
      updatedAt: '2024-08-31T00:00:00Z',
    },
    {
      id: '4',
      title: 'Company Policy Knowledge Check',
      description: 'Annual company policy and compliance review',
      type: 'knowledge',
      departmentId: '1',
      departmentName: 'All Departments',
      status: 'draft',
      totalQuestions: 15,
      duration: 30,
      passingScore: 85,
      assignedTo: 0,
      completedBy: 0,
      createdAt: '2024-09-01T00:00:00Z',
      updatedAt: '2024-09-01T00:00:00Z',
    },
  ],
  addAssessment: (assessment) =>
    set((state) => ({
      assessments: [
        ...state.assessments,
        {
          ...assessment,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateAssessment: (id, data) =>
    set((state) => ({
      assessments: state.assessments.map((assessment) =>
        assessment.id === id
          ? { ...assessment, ...data, updatedAt: new Date().toISOString() }
          : assessment
      ),
    })),
  deleteAssessment: (id) =>
    set((state) => ({
      assessments: state.assessments.filter((assessment) => assessment.id !== id),
    })),
}));
