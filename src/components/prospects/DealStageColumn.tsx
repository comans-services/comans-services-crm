
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/supabaseService';
import ProspectCard from './ProspectCard';

interface DealStageColumnProps {
  id: string;
  title: string;
  prospects: ProspectWithEngagement[];
  count: number;
}

const DealStageColumn: React.FC<DealStageColumnProps> = ({ id, title, prospects, count }) => {
  return (
    <div className="min-w-[300px] max-w-[300px] h-[calc(100vh-16rem)]">
      <div className="rounded-lg overflow-hidden flex flex-col h-full bg-[#0C0E24]">
        <div className="p-4 border-b border-[#232654] flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-white font-medium">{title}</span>
            <span className="ml-2 bg-[#232654] text-white text-xs rounded-full px-2 py-0.5">
              {count}
            </span>
          </div>
        </div>
        
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 overflow-y-auto p-4 transition-colors duration-200 ${
                snapshot.isDraggingOver 
                  ? 'bg-[#141736]' 
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
                <div className={`flex items-center justify-center h-20 border border-dashed ${
                  snapshot.isDraggingOver ? 'border-blue-400/50 bg-blue-400/5' : 'border-[#232654]'
                } rounded-md transition-colors duration-200`}>
                  <span className="text-sm text-white/50">
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

export default DealStageColumn;
