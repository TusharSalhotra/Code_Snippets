import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KPI, CreateKPIInput } from '@/src/modules/kpis/types';

interface KPIsState {
  kpis: KPI[];
  loading: boolean;
  error: string | null;
}

const mockKPIs: KPI[] = [
  {
    id: '1',
    name: 'Customer Satisfaction Score',
    description: 'Measure of customer satisfaction with our products and services',
    formula: '(Satisfied Customers / Total Customers) * 100',
    type: 'percentage',
    frequency: 'monthly',
    target: 90,
    unit: '%',
    department: '1',
    departmentName: 'Engineering',
    owner: '1',
    ownerName: 'Sarah Johnson',
    status: 'active',
    weight: 25,
    currentValue: 87,
    lastUpdated: '2024-11-10',
    createdAt: '2024-01-15',
    updatedAt: '2024-11-10',
  },
  {
    id: '2',
    name: 'Revenue Growth Rate',
    description: 'Year-over-year revenue growth percentage',
    formula: '((Current Revenue - Previous Revenue) / Previous Revenue) * 100',
    type: 'percentage',
    frequency: 'quarterly',
    target: 25,
    unit: '%',
    department: '4',
    departmentName: 'Sales',
    owner: '2',
    ownerName: 'Michael Chen',
    status: 'active',
    weight: 30,
    currentValue: 22,
    lastUpdated: '2024-11-05',
    createdAt: '2024-01-15',
    updatedAt: '2024-11-05',
  },
  {
    id: '3',
    name: 'Employee Engagement Score',
    description: 'Measure of employee satisfaction and engagement',
    formula: '(Engaged Employees / Total Employees) * 100',
    type: 'percentage',
    frequency: 'quarterly',
    target: 80,
    unit: '%',
    department: '2',
    departmentName: 'Product',
    owner: '3',
    ownerName: 'Emily Rodriguez',
    status: 'active',
    weight: 20,
    currentValue: 75,
    lastUpdated: '2024-11-01',
    createdAt: '2024-02-01',
    updatedAt: '2024-11-01',
  },
  {
    id: '4',
    name: 'Average Resolution Time',
    description: 'Average time to resolve customer support tickets',
    formula: 'Sum(Resolution Times) / Total Tickets',
    type: 'number',
    frequency: 'weekly',
    target: 24,
    unit: 'hours',
    department: '1',
    departmentName: 'Engineering',
    owner: '4',
    ownerName: 'David Kim',
    status: 'active',
    weight: 25,
    currentValue: 28,
    lastUpdated: '2024-11-08',
    createdAt: '2024-03-01',
    updatedAt: '2024-11-08',
  },
];

const initialState: KPIsState = {
  kpis: mockKPIs,
  loading: false,
  error: null,
};

const kpisSlice = createSlice({
  name: 'kpis',
  initialState,
  reducers: {
    addKPI: (state, action: PayloadAction<CreateKPIInput>) => {
      const newKPI: KPI = {
        id: `kpi-${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description,
        formula: action.payload.formula,
        type: action.payload.type,
        frequency: action.payload.frequency,
        target: action.payload.target,
        unit: action.payload.unit,
        department: action.payload.department || '',
        owner: action.payload.owner,
        status: 'active',
        weight: action.payload.weight || 0,
        currentValue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.kpis.unshift(newKPI);
    },
    updateKPI: (state, action: PayloadAction<KPI>) => {
      const index = state.kpis.findIndex(kpi => kpi.id === action.payload.id);
      if (index !== -1) {
        state.kpis[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteKPI: (state, action: PayloadAction<string>) => {
      state.kpis = state.kpis.filter(kpi => kpi.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addKPI, updateKPI, deleteKPI, setLoading, setError } = kpisSlice.actions;
export default kpisSlice.reducer;
