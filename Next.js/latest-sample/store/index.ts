import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import departmentsReducer from './slices/departmentsSlice';
import rolesReducer from './slices/rolesSlice';
import kpisReducer from './slices/kpisSlice';
import assessmentsReducer from './slices/assessmentsSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    departments: departmentsReducer,
    roles: rolesReducer,
    kpis: kpisReducer,
    assessments: assessmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
