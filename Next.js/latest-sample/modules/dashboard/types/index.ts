export interface DashboardStats {
  totalUsers: number;
  totalEvaluations: number;
  activeModels: number;
  averageAccuracy: number;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
  type: 'evaluation' | 'model' | 'system';
}

export interface ChartDataPoint {
  date: string;
  value: number;
}
