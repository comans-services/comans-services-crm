
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/mockDataService';

interface ProspectCardProps {
  prospect: ProspectWithEngagement;
  index: number;
}

const ProspectCard: React.FC<ProspectCardProps> = ({ prospect, index }) => {
  // Improved function to get perfect cursor alignment during drag
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // Base styles
    userSelect: 'none' as const,
    margin: '0 0 8px 0',
    
    // Visual feedback when dragging
    background: isDragging ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.05)',
    borderColor: isDragging ? 'rgb(59, 130, 246)' : 'rgba(255, 255, 255, 0.1)',
    boxShadow: isDragging ? '0 10px 15px rgba(0, 0, 0, 0.4)' : 'none',
    
    // Apply draggable styles but with better cursor alignment
    ...draggableStyle,
    
    // Critical fix: Remove any transforms that aren't part of positioning
    ...(isDragging && draggableStyle && draggableStyle.transform
      ? {
          // Ensure only translation happens without scaling
          transform: draggableStyle.transform.replace(/scale\([^)]+\)/g, ''),
          // Set transform origin to top left to match mouse position
          transformOrigin: 'top left',
          // Force full opacity and visibility during drag
          opacity: '1 !important',
          visibility: 'visible !important',
          pointerEvents: 'auto !important',
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
