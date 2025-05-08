import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/types';

interface ProspectCardProps {
  prospect: ProspectWithEngagement;
  index: number;
}

const ProspectCard: React.FC<ProspectCardProps> = ({ prospect, index }) => {
  // Perfected cursor alignment during drag operations
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // Base styles
    userSelect: 'none' as const,
    padding: 0,
    margin: '0 0 8px 0',
    
    // Visual feedback when dragging
    background: isDragging ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.05)',
    borderColor: isDragging ? 'rgb(59, 130, 246)' : 'rgba(255, 255, 255, 0.1)',
    boxShadow: isDragging ? '0 10px 15px rgba(0, 0, 0, 0.4)' : 'none',
    
    // Critical alignment fixes for cursor
    ...(isDragging ? {
      // Remove any margin or padding that could cause offset
      pointerEvents: 'none' as const,
      // Set position to fixed to avoid any offset from parent containers
      position: 'fixed' as const,
      // Top and left are controlled by the library, we need to ensure no additional offset
      zIndex: 9999,
      // Force full opacity and visibility
      opacity: 1,
      visibility: 'visible' as const,
      // Remove any transform scale that might cause misalignment
      transform: draggableStyle?.transform 
        ? draggableStyle.transform.replace(/scale\([^)]+\)/g, '') 
        : 'translate(0px, 0px)',
      // Set transform origin to top left corner for precise positioning
      transformOrigin: 'top left',
      // Remove any transition that could make the card lag behind cursor
      transition: 'none',
      // Ensure width matches original width to prevent resizing during drag
      width: draggableStyle?.width || 'auto',
      cursor: 'grabbing',
    } : {}),
    
    // Apply draggable styles provided by the library
    ...draggableStyle,
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
          className={`mb-2 p-3 rounded-md border transition-all ${
            snapshot.isDragging 
              ? 'border-blue-500'
              : 'border-white/10'
          }`}
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
