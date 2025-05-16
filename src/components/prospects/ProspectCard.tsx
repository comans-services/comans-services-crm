
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/types/serviceTypes';

interface ProspectCardProps {
  prospect: ProspectWithEngagement;
  index: number;
}

const ProspectCard: React.FC<ProspectCardProps> = ({ prospect, index }) => {
  // Perfected cursor alignment during drag operations
// BEFORE ─ getItemStyle was ~40 lines long, forcing position: fixed
// AFTER  ─ tidy, no hacks ----------------------------------------

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: React.CSSProperties | undefined
): React.CSSProperties => ({
  userSelect: 'none',
  margin: '0 0 8px 0',

  // Visual feedback while dragging
  background: isDragging
    ? 'rgba(59 130 246 / .6)'
    : 'rgba(255 255 255 / .05)',
  borderColor: isDragging
    ? 'rgb(59 130 246)'
    : 'rgba(255 255 255 / .1)',
  boxShadow: isDragging
    ? '0 10px 15px rgba(0 0 0 / .4)'
    : 'none',

  // Always spread LAST so the library can position the item
  ...draggableStyle,
});

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
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
          className={`mb-3 rounded-md border transition-all ${
            snapshot.isDragging 
              ? 'border-blue-500'
              : 'border-white/10'
          }`}
        >
          <div className="cursor-move p-3"> {/* Consistent inner padding */}
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
