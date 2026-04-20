import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Department, CreateDepartmentInput } from '@/src/modules/departments/types';

interface DepartmentsState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development and technical infrastructure',
    headOfDepartment: 'Sarah Johnson',
    headOfDepartmentId: '1',
    manager: '1',
    managerName: 'Sarah Johnson',
    employeeCount: 45,
    kpiCount: 12,
    status: 'active',
    goals: 'Build scalable products and maintain high code quality',
    createdAt: '2024-01-15',
    updatedAt: '2024-11-10',
  },
  {
    id: '2',
    name: 'Product',
    description: 'Product strategy and roadmap planning',
    headOfDepartment: 'Emily Rodriguez',
    headOfDepartmentId: '3',
    manager: '3',
    managerName: 'Emily Rodriguez',
    employeeCount: 12,
    kpiCount: 8,
    status: 'active',
    goals: 'Drive product innovation and user satisfaction',
    createdAt: '2024-01-15',
    updatedAt: '2024-11-10',
  },
  {
    id: '3',
    name: 'Design',
    description: 'User experience and interface design',
    headOfDepartment: 'David Kim',
    headOfDepartmentId: '4',
    manager: '4',
    managerName: 'David Kim',
    employeeCount: 8,
    kpiCount: 6,
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-11-10',
  },
  {
    id: '4',
    name: 'Sales',
    description: 'Revenue generation and client relationships',
    headOfDepartment: 'Robert Martinez',
    headOfDepartmentId: '6',
    manager: '6',
    managerName: 'Robert Martinez',
    employeeCount: 22,
    kpiCount: 15,
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-11-10',
  },
];

const initialState: DepartmentsState = {
  departments: mockDepartments,
  loading: false,
  error: null,
};

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    addDepartment: (state, action: PayloadAction<CreateDepartmentInput>) => {
      const newDepartment: Department = {
        id: `dept-${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description,
        headOfDepartment: action.payload.manager || 'Unassigned',
        headOfDepartmentId: action.payload.manager || '',
        manager: action.payload.manager,
        goals: action.payload.goals,
        status: 'active',
        employeeCount: 0,
        kpiCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.departments.unshift(newDepartment);
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      const index = state.departments.findIndex(dept => dept.id === action.payload.id);
      if (index !== -1) {
        state.departments[index] = action.payload;
      }
    },
    deleteDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter(dept => dept.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addDepartment, updateDepartment, deleteDepartment, setLoading, setError } = departmentsSlice.actions;
export default departmentsSlice.reducer;
