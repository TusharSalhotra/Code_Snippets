export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'custom';
  status: 'active' | 'inactive';
  usageCount: number;
  lastUsed: string;
}

export interface AIStats {
  totalModels: number;
  activeModels: number;
  totalRequests: number;
}
