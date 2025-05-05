import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/mockDataService';

interface ProspectCardProps {
  prospect: ProspectWithEngagement;
  index: number;
}

const ProspectCard: React.FC<ProspectCardProps> = ({ prospect, index }) => {
  // Improved function to get draggable styles to ensure cursor alignment
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // Keep item visible during drag
    userSelect: 'none' as const,
    opacity: 1,
    visibility: 'visible',
    pointerEvents: 'auto',
    margin: '0 0 8px 0',
    
    // Visual feedback when dragging
    background: isDragging ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.05)',
    borderColor: isDragging ? 'rgb(59, 130, 246)' : 'rgba(255, 255, 255, 0.1)',
    boxShadow: isDragging ? '0 10px 15px rgba(0, 0, 0, 0.4)' : 'none',
    
    // Don't apply any transforms that could offset the cursor position
    transform: 'translate(0, 0)',
    
    // Apply the draggable styles but ensure we don't create offset issues
    ...draggableStyle,
    
    // Critical fix: Ensure the transform includes only what DnD needs for positioning
    // and remove any scaling or other transforms that might cause misalignment
    ...(isDragging && draggableStyle && draggableStyle.transform
      ? {
          transform: draggableStyle.transform.replace(/scale\([^)]+\)/g, ''),
          transformOrigin: 'top left'
        }
      : {})
  });

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
          className="mb-2 p-3 rounded-md border border-white/10 transition-all"
        >
          <div className="cursor-move">
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
              <div className={`w-2 h-2 rounded-full bg-${prospect.statusColor}`}></div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ProspectCard;
