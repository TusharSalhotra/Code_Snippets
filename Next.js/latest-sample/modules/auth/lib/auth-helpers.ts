import { AUTH_STORAGE_KEYS } from '../constants';
import type { User } from '../types';

export const authHelpers = {
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    }
    return null;
  },

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    }
  },

  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    }
  },

  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },
};
