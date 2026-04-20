/**
 * KPIs Zustand Store
 */

import { create } from 'zustand';
import type { KPI } from '@/modules/kpis/types';

interface KPIsState {
  kpis: KPI[];
  addKPI: (kpi: Omit<KPI, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateKPI: (id: string, data: Partial<KPI>) => void;
  deleteKPI: (id: string) => void;
}

export const useKPIsStore = create<KPIsState>((set) => ({
  kpis: [
    {
      id: '1',
      name: 'Customer Satisfaction',
      description: 'Overall customer satisfaction score from surveys',
      formula: '(Positive Reviews / Total Reviews) * 100',
      type: 'percentage',
      frequency: 'monthly',
      target: 85,
      currentValue: 87,
      unit: '%',
      status: 'active',
      department: 'Customer Success',
      owner: 'Sarah Johnson',
      trend: 'up',
      weight: 1,
      createdAt: '2024-01-15',
      updatedAt: '2024-03-10',
    },
    {
      id: '2',
      name: 'Revenue Growth',
      description: 'Year-over-year revenue growth percentage',
      formula: '((Current Revenue - Previous Revenue) / Previous Revenue) * 100',
      type: 'percentage',
      frequency: 'quarterly',
      target: 20,
      currentValue: 22,
      unit: '%',
      status: 'active',
      department: 'Sales',
      owner: 'Mike Wilson',
      trend: 'up',
      weight: 1,
      createdAt: '2024-01-15',
      updatedAt: '2024-03-10',
    },
    {
      id: '3',
      name: 'Employee Engagement',
      description: 'Employee engagement survey score',
      formula: 'Average of all engagement survey responses',
      type: 'percentage',
      frequency: 'quarterly',
      target: 80,
      currentValue: 75,
      unit: '%',
      status: 'active',
      department: 'HR',
      owner: 'Emily Chen',
      trend: 'down',
      weight: 1,
      createdAt: '2024-01-15',
      updatedAt: '2024-03-10',
    },
    {
      id: '4',
      name: 'Resolution Time',
      description: 'Average time to resolve customer tickets',
      formula: 'Sum of resolution times / Number of tickets',
      type: 'number',
      frequency: 'weekly',
      target: 24,
      currentValue: 28,
      unit: 'hours',
      status: 'active',
      department: 'Support',
      owner: 'Alex Rodriguez',
      trend: 'down',
      weight: 1,
      createdAt: '2024-01-15',
      updatedAt: '2024-03-10',
    },
  ],
  addKPI: (kpi) =>
    set((state) => ({
      kpis: [
        ...state.kpis,
        {
          ...kpi,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateKPI: (id, data) =>
    set((state) => ({
      kpis: state.kpis.map((kpi) =>
        kpi.id === id
          ? { ...kpi, ...data, updatedAt: new Date().toISOString() }
          : kpi
      ),
    })),
  deleteKPI: (id) =>
    set((state) => ({
      kpis: state.kpis.filter((kpi) => kpi.id !== id),
    })),
}));
