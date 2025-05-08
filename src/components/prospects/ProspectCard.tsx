
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { getStatusColor } from '@/utils/clientUtils';

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
    
    // Critical fix for cursor alignment: use fixed positioning and remove transforms that aren't needed
    ...(isDragging && {
      position: 'fixed',
      top: 'auto',  // Let the drag system control the positioning
      left: 'auto', // Let the drag system control the positioning
      margin: 0,    // Remove margin during drag
      transformOrigin: 'top left',
      transition: 'none',  // Disable transitions during drag for better responsiveness
      zIndex: 9999, // Ensure dragged item is above everything else
    })
  });

  // Determine status color
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
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
          className={`mb-2 p-3 rounded-md border ${
            snapshot.isDragging 
              ? 'border-blue-500 shadow-lg' 
              : 'border-white/10 transition-all'
          }`}
        >
          <div className="cursor-move">
            <div className="text-sm font-medium">
              {prospect.first_name} {prospect.last_name}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {prospect.company || 'No company'}
            </div>
            <div className="mt-2 flex justify-between items-center text-xs">
              <div className="bg-white/10 rounded px-2 py-0.5">
                {prospect.daysSinceLastContact !== null && prospect.daysSinceLastContact !== undefined
                  ? `${prospect.daysSinceLastContact} days ago` 
                  : 'New lead'}
              </div>
              <div className={`w-2 h-2 rounded-full bg-${statusColor}`}></div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ProspectCard;
