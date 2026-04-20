/**
 * Assessments Redux Slice
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Assessment } from '@/modules/assessments/types';

interface AssessmentsState {
  assessments: Assessment[];
  loading: boolean;
  error: string | null;
}

const initialState: AssessmentsState = {
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
  loading: false,
  error: null,
};

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    addAssessment: (state, action: PayloadAction<Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newAssessment: Assessment = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.assessments.push(newAssessment);
    },
    updateAssessment: (state, action: PayloadAction<{ id: string; data: Partial<Assessment> }>) => {
      const index = state.assessments.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.assessments[index] = {
          ...state.assessments[index],
          ...action.payload.data,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteAssessment: (state, action: PayloadAction<string>) => {
      state.assessments = state.assessments.filter((a) => a.id !== action.payload);
    },
  },
});

export const { addAssessment, updateAssessment, deleteAssessment } = assessmentsSlice.actions;
export default assessmentsSlice.reducer;
