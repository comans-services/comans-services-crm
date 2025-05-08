
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/supabaseService';

interface ProspectCardProps {
  prospect: ProspectWithEngagement;
  index: number;
}

const ProspectCard: React.FC<ProspectCardProps> = ({ prospect, index }) => {
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
          className={`rounded-md mb-3 ${
            snapshot.isDragging 
              ? 'bg-[#1C1F41] shadow-lg border border-blue-500/50' 
              : 'bg-[#111331] border border-[#2A2E52] hover:border-white/20'
          } transition-all`}
        >
          <div className="p-4">
            <div className="text-white font-medium mb-1">
              {prospect.first_name} {prospect.last_name}
            </div>
            
            <div className="text-white/50 text-sm mb-3">
              {prospect.company || 'No company'}
            </div>
            
            {prospect.daysSinceLastContact !== null && (
              <div className="flex items-center justify-between">
                <div className="bg-[#1D1F3B] text-white/70 text-xs px-2 py-1 rounded">
                  {prospect.daysSinceLastContact === 1
                    ? '1 day ago'
                    : `${prospect.daysSinceLastContact} days ago`}
                </div>
                
                <div className={`w-2.5 h-2.5 rounded-full bg-${
                  prospect.daysSinceLastContact <= 2
                    ? 'green-500'
                    : prospect.daysSinceLastContact <= 5
                    ? 'yellow-500'
                    : 'orange-500'
                }`}></div>
              </div>
            )}
            
            {prospect.daysSinceLastContact === null && (
              <div className="bg-[#1D1F3B] text-white/70 text-xs px-2 py-1 rounded w-fit">
                New lead
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ProspectCard;
