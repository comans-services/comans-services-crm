
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { getStatusColor, getRecommendedAction } from '@/utils/clientUtils';

// Define the prospect interface for consistency
interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  dragId?: string;
  daysSinceLastContact?: number | null;
}

interface ProspectCardProps {
  prospect: Prospect;
  index: number;
}

const ProspectCard: React.FC<ProspectCardProps> = ({ prospect, index }) => {
  // Get status color from utils
  const statusColor = getStatusColor(prospect.daysSinceLastContact);
  
  return (
    <Draggable 
      key={prospect.dragId || prospect.id} 
      draggableId={prospect.dragId || prospect.id} 
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 p-3 rounded-md border ${
            snapshot.isDragging 
              ? 'border-blue-500 shadow-lg' 
              : 'border-white/10 transition-all'
          }`}
        >
          <div className="cursor-move">
            <div className="text-sm font-medium text-white">
              {prospect.first_name} {prospect.last_name}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {prospect.company || 'No company'}
            </div>
            <div className="mt-2 flex justify-between items-center text-xs">
              <div className="bg-white/10 rounded px-2 py-0.5 text-white/70">
                {prospect.daysSinceLastContact !== null && prospect.daysSinceLastContact !== undefined
                  ? `${prospect.daysSinceLastContact} days ago` 
                  : 'New lead'}
              </div>
              {/* Fix status dot to use Tailwind classes directly */}
              <div className={`w-2 h-2 rounded-full bg-${statusColor}`}></div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ProspectCard;
