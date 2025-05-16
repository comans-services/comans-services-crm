import React, { forwardRef } from 'react';
import { ProspectWithEngagement } from '@/services/types/serviceTypes';

interface ProspectCardProps {
  prospect: ProspectWithEngagement;
  // the next three props are injected by <Draggable>
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  draggableProps?: React.HTMLAttributes<HTMLDivElement>;
  style?: React.CSSProperties;
}

const ProspectCard = forwardRef<HTMLDivElement, ProspectCardProps>(
  ({ prospect, dragHandleProps, draggableProps, style }, ref) => {
    /** Pick a Tailwind colour chip for the status dot */
    const colourClass = (() => {
      switch (prospect.statusColor) {
        case 'green':
          return 'bg-green-500';
        case 'yellow':
          return 'bg-yellow-500';
        case 'orange':
          return 'bg-orange-500';
        case 'red':
          return 'bg-red-500';
        default:
          return 'bg-gray-500';
      }
    })();

    return (
      <div
        ref={ref}
        {...draggableProps}
        {...dragHandleProps}
        style={style}
        className="mb-3 rounded-md border border-white/10 bg-white/5 transition-all"
      >
        <div className="p-3">
          <div className="px-2 text-sm font-medium">
            {prospect.first_name} {prospect.last_name}
          </div>

          <div className="mt-2 px-2 text-xs text-white/60">{prospect.company}</div>

          <div className="mt-3 flex items-center justify-between px-2 text-xs">
            <div className="rounded bg-white/10 px-3 py-1">
              {prospect.daysSinceLastContact !== null
                ? `${prospect.daysSinceLastContact} days ago`
                : 'New lead'}
            </div>
            <span className={`h-2 w-2 rounded-full ${colourClass}`} />
          </div>
        </div>
      </div>
    );
  },
);

export default ProspectCard;

