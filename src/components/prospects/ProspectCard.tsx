
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/types/serviceTypes';
import CardShell from '@/components/ui/card-shell';

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

  return (
    <Draggable 
      key={prospect.dragId || prospect.id} 
      draggableId={prospect.dragId || prospect.id} 
      index={index}
    >
      {(provided, snapshot) => (
        <CardShell
          isDragging={snapshot.isDragging}
          draggableStyle={provided.draggableProps.style}
        >
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="cursor-move"
          >
            <div className="text-sm font-medium">
              {prospect.first_name} {prospect.last_name}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {prospect.company}
            </div>
            <div className="mt-2 flex justify-between items-center text-xs">
              <div className="bg-white/10 rounded px-2 py-0.5">
                {prospect.daysSinceLastContact !== null 
                  ? `${prospect.daysSinceLastContact} days ago` 
                  : 'New lead'}
              </div>
              <div className={`w-2 h-2 rounded-full ${statusColorClass}`}></div>
            </div>
          </div>
        </CardShell>
      )}
    </Draggable>
  );
};

export default ProspectCard;
