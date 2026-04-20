import { Notification } from '../types';

export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter(n => !n.read).length;
}
