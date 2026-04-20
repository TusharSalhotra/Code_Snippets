/**
 * Users Zustand Store
 */

import { create } from 'zustand';
import type { User } from '@/modules/users/types';

interface UsersState {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Engineering Manager',
      department: 'Engineering',
      status: 'active',
      skillScore: 85,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Product Manager',
      department: 'Product',
      status: 'active',
      skillScore: 92,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'Developer',
      department: 'Engineering',
      status: 'inactive',
      skillScore: 78,
    },
  ],
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, { ...user, id: Date.now().toString() }],
    })),
  updateUser: (id, data) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...data } : user
      ),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}));
