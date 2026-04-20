import { KPIStatus } from '../types';

/**
 * KPI status display labels
 */
export const KPI_STATUS_LABELS: Record<KPIStatus, string> = {
  active: 'Active',
  draft: 'Draft',
  inactive: 'Inactive',
};

/**
 * KPI status color classes for badges
 */
export const KPI_STATUS_COLORS: Record<KPIStatus, string> = {
  active: 'border-[#00F5C6]/50 text-[#00F5C6]',
  draft: 'border-yellow-400/50 text-yellow-400',
  inactive: 'border-red-400/50 text-red-400',
};

/**
 * Default KPI packs with emojis
 */
export const DEFAULT_KPI_PACKS = [
  {
    id: 'it-support',
    name: 'IT Support Pack',
    emoji: '🎯',
    description: 'Ticket resolution, response time, satisfaction',
    kpiCount: 12,
  },
  {
    id: 'sales',
    name: 'Sales Pack',
    emoji: '💰',
    description: 'Revenue, conversion, pipeline velocity',
    kpiCount: 8,
  },
  {
    id: 'hr',
    name: 'HR Pack',
    emoji: '👥',
    description: 'Retention, engagement, recruitment metrics',
    kpiCount: 10,
  },
  {
    id: 'engineering',
    name: 'Engineering Pack',
    emoji: '💻',
    description: 'Code quality, deployment frequency, bug resolution',
    kpiCount: 15,
  },
] as const;

/**
 * Maximum weight percentage (100%)
 */
export const MAX_KPI_WEIGHT = 100;

/**
 * Minimum weight percentage (0%)
 */
export const MIN_KPI_WEIGHT = 0;

/**
 * Maximum number of KPIs per department
 */
export const MAX_KPIS_PER_DEPARTMENT = 50;
