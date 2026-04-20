import { AIModel } from '../types';
import { DEFAULT_AI_MODELS } from '../constants';

export async function fetchAIModels(): Promise<AIModel[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEFAULT_AI_MODELS;
}
