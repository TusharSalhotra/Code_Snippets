import { AIModel, AIStats } from '../types';

export function getAIStats(models: AIModel[]): AIStats {
  return {
    totalModels: models.length,
    activeModels: models.filter(m => m.status === 'active').length,
    totalRequests: models.reduce((sum, m) => sum + m.usageCount, 0),
  };
}
