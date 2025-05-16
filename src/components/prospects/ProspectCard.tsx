
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/types/serviceTypes';

interface ProspectCardProps {
  prospect: ProspectWithEngagement;
  index: number;
}

const ProspectCard: React.FC<ProspectCardProps> = ({ prospect, index }) => {
  // Determine the status color class for Tailwind
  const getStatusColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'orange': return 'bg-orange-500';
      case 'red': return 'bg-red-500';
      case 'gray': 
      default: return 'bg-gray-500';
    }
  };

  const statusColorClass = getStatusColorClass(prospect.statusColor);
  const dragId = prospect.dragId || `drag-${prospect.id}`;

  return (
    <Draggable draggableId={dragId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3 rounded-md border border-white/10 bg-white/5 transition-all"
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1
          }}
        >
          <div className="p-3"> {/* Consistent inner padding */}
            <div className="text-sm font-medium px-2">
              {prospect.first_name} {prospect.last_name}
            </div>
            <div className="text-xs text-white/60 mt-2 px-2">
              {prospect.company}
            </div>
            <div className="mt-3 flex justify-between items-center text-xs px-2">
              <div className="bg-white/10 rounded px-3 py-1">
                {prospect.daysSinceLastContact !== null 
                  ? `${prospect.daysSinceLastContact} days ago` 
                  : 'New lead'}
              </div>
              <div className={`w-2 h-2 rounded-full ${statusColorClass}`}></div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ProspectCard;
