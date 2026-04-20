import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { fetchNotifications } from '../api/notifications-api';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications().then(data => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  return { notifications, loading };
}
