import { AIModel } from '../types';

export const DEFAULT_AI_MODELS: AIModel[] = [
  { id: '1', name: 'GPT-4', provider: 'openai', status: 'active', usageCount: 1250, lastUsed: '2024-11-10T10:00:00Z' },
  { id: '2', name: 'Claude 3', provider: 'anthropic', status: 'active', usageCount: 890, lastUsed: '2024-11-10T09:30:00Z' },
];
