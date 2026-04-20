import { Notification } from '../types';
import { DEFAULT_NOTIFICATIONS } from '../constants';

export async function fetchNotifications(): Promise<Notification[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEFAULT_NOTIFICATIONS;
}
