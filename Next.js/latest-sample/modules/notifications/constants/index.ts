import { Notification } from '../types';

export const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New Assessment Available', message: 'JavaScript Fundamentals assessment has been assigned to you', type: 'info', read: false, createdAt: '2024-11-10T10:00:00Z' },
  { id: '2', title: 'KPI Updated', message: 'Your department KPIs have been updated', type: 'success', read: true, createdAt: '2024-11-09T15:30:00Z' },
];
