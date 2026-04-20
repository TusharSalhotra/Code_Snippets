import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials),
    // });
    // if (!response.ok) throw new Error('Login failed');
    // return response.json();

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            email: credentials.email,
            name: 'Admin User',
            role: 'admin',
          },
          token: 'mock-jwt-token',
        });
      }, 1000);
    });
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  async logout(): Promise<void> {
    // TODO: Replace with actual API call
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  },

  async getCurrentUser(): Promise<User> {
    // TODO: Replace with actual API call
    const response = await fetch(`${API_BASE}/auth/me`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async forgotPassword(email: string): Promise<void> {
    // TODO: Replace with actual API call
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) throw new Error('Failed to send reset email');
  },
};
