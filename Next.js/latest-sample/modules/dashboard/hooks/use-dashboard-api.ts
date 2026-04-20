import { useApiQuery } from '@/src/hooks/use-api'

export interface DashboardStats {
  totalUsers: number
  totalEvaluations: number
  activeModels: number
  averageAccuracy: number
}

export interface PerformanceData {
  date: string
  metric1: number
  metric2: number
  metric3: number
}

export interface RecentActivity {
  id: string
  action: string
  user: string
  timestamp: string
  type: 'evaluation' | 'user' | 'model' | 'system'
}

/**
 * Fetch dashboard statistics
 */
export const useDashboardStats = () => {
  return useApiQuery<DashboardStats>(
    ['dashboard', 'stats'],
    '/dashboard/stats'
  )
}

/**
 * Fetch performance data
 */
export const useDashboardPerformance = (timeRange: 'day' | 'week' | 'month' = 'week') => {
  return useApiQuery<PerformanceData[]>(
    ['dashboard', 'performance', timeRange],
    `/dashboard/performance?range=${timeRange}`
  )
}

/**
 * Fetch recent activity
 */
export const useDashboardActivity = (limit: number = 10) => {
  return useApiQuery<RecentActivity[]>(
    ['dashboard', 'activity', limit],
    `/dashboard/activity?limit=${limit}`
  )
}
