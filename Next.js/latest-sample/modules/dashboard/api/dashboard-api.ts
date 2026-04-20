import { DashboardStats, ActivityItem } from '../types';

// Mock API - Replace with actual API calls
export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      totalUsers: 1234,
      totalEvaluations: 5678,
      activeModels: 42,
      averageAccuracy: 94.5,
    };
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        user: 'John Doe',
        action: 'Completed model evaluation',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: 'evaluation',
      },
      {
        id: '2',
        user: 'Jane Smith',
        action: 'Deployed new model',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        type: 'model',
      },
      {
        id: '3',
        user: 'System',
        action: 'Automated backup completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'system',
      },
    ];
  },
};
