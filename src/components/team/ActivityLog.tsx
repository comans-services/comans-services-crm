
import React from 'react';
import { User } from 'lucide-react';
import { formatTimeAgo } from '@/utils/dateUtils';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityLogItem {
  id: string;
  app_user?: {
    first_name: string;
    last_name: string;
  };
  activity_type: string;
  occurred_at: string;
}

interface ActivityLogProps {
  activityLog: ActivityLogItem[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activityLog }) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityLog.length > 0 ? activityLog.map((log) => (
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
      </CardContent>
    </>
  );
};

export default ActivityLog;
