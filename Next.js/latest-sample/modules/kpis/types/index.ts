export type KPIStatus = 'active' | 'draft' | 'inactive';
export type KPIFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type KPIType = 'number' | 'percentage' | 'currency' | 'boolean';

export interface KPI {
  id: string;
  name: string;
  department: string;
  weight: number; // Percentage (0-100)
  status: KPIStatus;
  isAIGenerated?: boolean;
  
  // Additional fields for KPI management
  description?: string;
  formula?: string;
  type?: KPIType;
  frequency?: KPIFrequency;
  target?: number;
  unit?: string;
  departmentName?: string;
  owner?: string;
  ownerName?: string;
  currentValue?: number;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateKPIInput {
  name: string;
  description: string;
  formula: string;
  type: KPIType;
  frequency: KPIFrequency;
  target: number;
  unit?: string;
  department?: string;
  owner?: string;
  weight?: number;
}

export interface UpdateKPIInput extends Partial<CreateKPIInput> {
  id: string;
  status?: KPIStatus;
}

export interface KPIPack {
  id: string;
  name: string;
  emoji: string;
  description: string;
  kpiCount: number;
}
