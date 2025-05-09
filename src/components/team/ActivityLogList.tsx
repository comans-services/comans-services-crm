
import React from 'react';
import { User } from 'lucide-react';
import { UserActivity } from '@/services/supabaseService';
import { formatTimeAgo } from '@/utils/dateUtils';

interface ActivityLogListProps {
  activityLog: UserActivity[];
  isLoading: boolean;
}

const ActivityLogList: React.FC<ActivityLogListProps> = ({ activityLog, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-10">Loading activity data...</div>;
  }

  return (
    <div className="space-y-4">
      {Array.isArray(activityLog) && activityLog.length > 0 ? activityLog.map((log) => (
        <div key={log.id} className="flex items-start border-b border-white/10 pb-4 last:border-0">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
            <User size={14} />
          </div>
          <div>
            <p>
              <span className="font-medium">
                {log.app_user?.first_name} {log.app_user?.last_name}
              </span>{' '}
              <span className="text-white/70">{log.activity_type}</span>
            </p>
            <p className="text-xs text-white/50 mt-1">
              {formatTimeAgo(new Date(log.occurred_at))}
            </p>
          </div>
        </div>
      )) : (
        <div className="text-center py-4 text-white/50">
          No activity recorded yet
        </div>
      )}
    </div>
  );
};

export default ActivityLogList;
