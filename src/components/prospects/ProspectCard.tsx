
import React, { forwardRef } from 'react';
import { ProspectWithEngagement } from '@/services/types/serviceTypes';

interface ProspectCardProps {
  prospect: ProspectWithEngagement;
  style?: React.CSSProperties;
}

/**
 * Displays a prospect's basic information in a card format
 * 
 * @remarks
 * This component is now used both as a standard display card
 * and as the ghost/preview element during drag operations.
 */
const ProspectCard = forwardRef<HTMLDivElement, ProspectCardProps>(
  ({ prospect, style }, ref) => {
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
        style={style}
        className="rounded-md border border-white/10 bg-white/5 transition-all"
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
