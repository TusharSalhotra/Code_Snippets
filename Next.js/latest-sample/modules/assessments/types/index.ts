/**
 * Assessment Types
 */

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  departmentId: string;
  departmentName: string;
  status: AssessmentStatus;
  totalQuestions: number;
  duration: number; // minutes
  passingScore: number;
  assignedTo: number; // employee count
  completedBy: number;
  createdAt: string;
  updatedAt: string;
}

export type AssessmentType = 'skill' | 'performance' | 'knowledge' | 'certification';
export type AssessmentStatus = 'draft' | 'active' | 'archived';

export interface AssessmentStats {
  totalAssessments: number;
  activeAssessments: number;
  totalCompletions: number;
  averageScore: number;
}

export interface CreateAssessmentInput {
  title: string;
  description: string;
  type: AssessmentType;
  departmentId: string;
  departmentName: string;
  status: AssessmentStatus;
  totalQuestions: number;
  duration: number;
  passingScore: number;
  assignedTo: number;
  completedBy: number;
}

export interface UpdateAssessmentInput extends Partial<CreateAssessmentInput> {
  id: string;
}
