import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, CreateUserInput } from '@/src/modules/users/types';
import { mockUsers } from '@/src/modules/users/components/user-table';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: mockUsers,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<CreateUserInput>) => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: `${action.payload.firstName} ${action.payload.lastName}`,
        email: action.payload.email,
        role: action.payload.role,
        department: action.payload.department,
        status: 'pending',
        skillScore: 0,
      };
      state.users.unshift(newUser);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addUser, updateUser, deleteUser, setLoading, setError } = usersSlice.actions;
export default usersSlice.reducer;
