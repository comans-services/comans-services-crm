
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import ProspectCard from './ProspectCard';

// Define the prospect interface for consistency
interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  dragId?: string;
  daysSinceLastContact?: number | null;
}

interface StatusColumnProps {
  id: string;
  title: string;
  prospects: Prospect[];
}

const StatusColumn: React.FC<StatusColumnProps> = ({ id, title, prospects }) => {
  return (
    <div className="min-w-[280px] max-w-[280px]">
      <div className="card p-0 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-white font-semibold">{title}</span>
            <span className="ml-2 bg-white/20 text-white text-xs rounded-full px-2 py-0.5">
              {prospects.length}
            </span>
          </div>
        </div>
        
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 overflow-y-auto p-2 transition-colors duration-200 ${
                snapshot.isDraggingOver 
                  ? 'bg-white/10 border border-blue-400/50' 
                  : ''
              }`}
            >
              {prospects.map((prospect, index) => (
                <ProspectCard 
                  key={prospect.dragId || prospect.id}
                  prospect={prospect} 
                  index={index} 
                />
              ))}
              {provided.placeholder}
              
              {prospects.length === 0 && (
                <div className={`flex items-center justify-center h-16 border border-dashed ${
                  snapshot.isDraggingOver ? 'border-blue-400/50 bg-blue-400/10' : 'border-white/10'
                } rounded-md transition-colors duration-200`}>
                  <span className="text-xs text-white/50">
                    Drop prospect here
                  </span>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default StatusColumn;
