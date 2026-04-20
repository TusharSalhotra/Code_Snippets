'use client';

import { FC, useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertCircle, Settings } from 'lucide-react';
import { ActivityItem } from '../types';
import { dashboardApi } from '../api/dashboard-api';
import { formatTimeAgo } from '../lib/dashboard-helpers';

export const RecentActivity: FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await dashboardApi.getRecentActivity();
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'evaluation':
        return CheckCircle2;
      case 'model':
        return Settings;
      case 'system':
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'evaluation':
        return 'bg-[#00F5C6]/10 text-[#00F5C6]';
      case 'model':
        return 'bg-[#00AEEF]/10 text-[#00AEEF]';
      case 'system':
        return 'bg-purple-500/10 text-purple-400';
      default:
        return 'bg-white/5 text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-white text-xl font-semibold mb-6">Recent Activity</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-white text-xl font-semibold">Recent Activity</h3>
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-sm">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.user} • {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
