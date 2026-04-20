"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";

export type ActivityStatus = "success" | "info" | "warning" | "error";

export interface Activity {
  id: string;
  title: string;
  timestamp: string;
  status: ActivityStatus;
}

interface RecentActivityCardProps {
  activities?: Activity[];
  className?: string;
}

const statusColors = {
  success: {
    dot: "bg-[#00F5C6]",
    badge: "border-[#00F5C6]/50 text-[#00F5C6]",
  },
  info: {
    dot: "bg-[#00AEEF]",
    badge: "border-[#00AEEF]/50 text-[#00AEEF]",
  },
  warning: {
    dot: "bg-yellow-400",
    badge: "border-yellow-400/50 text-yellow-400",
  },
  error: {
    dot: "bg-red-400",
    badge: "border-red-400/50 text-red-400",
  },
};

const defaultActivities: Activity[] = [
  {
    id: "1",
    title: "12 new users onboarded",
    timestamp: "2 hours ago",
    status: "success",
  },
  {
    id: "2",
    title: "Q2 Performance Review started",
    timestamp: "5 hours ago",
    status: "info",
  },
  {
    id: "3",
    title: "Token usage at 75%",
    timestamp: "1 day ago",
    status: "warning",
  },
  {
    id: "4",
    title: "AI model updated to GPT-4",
    timestamp: "2 days ago",
    status: "success",
  },
];

export const RecentActivityCard: FC<RecentActivityCardProps> = ({
  activities = defaultActivities,
  className,
}) => {
  return (
    <div className={cn("relative group", className)}>
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Card */}
      <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
        <div className="p-6">
          <h3 className="text-white text-lg mb-4">Recent Activity</h3>
          
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      statusColors[activity.status].dot
                    )}
                  />
                  <div>
                    <p className="text-white text-sm">{activity.title}</p>
                    <p className="text-[#B0B6C1] text-xs mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
                
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0",
                    statusColors[activity.status].badge
                  )}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
