export const DASHBOARD_ROUTES = {
  MAIN: '/dashboard',
  ANALYTICS: '/dashboard/analytics',
  REPORTS: '/dashboard/reports',
} as const;

export const REFRESH_INTERVAL = 30000; // 30 seconds

// Updated labels to match provided design copy exactly
export const STAT_LABELS = {
  TOTAL_USERS: 'Users',
  TOTAL_EVALUATIONS: 'Evaluations',
  ACTIVE_MODELS: 'Models',
  AVERAGE_ACCURACY: 'Accuracy',
} as const;
