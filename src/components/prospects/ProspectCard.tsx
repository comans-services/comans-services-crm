
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/supabaseService';
import { User } from 'lucide-react';

interface ProspectCardProps {
  prospect: ProspectWithEngagement;
  index: number;
}

const ProspectCard: React.FC<ProspectCardProps> = ({ prospect, index }) => {
  // Generate a code-like ID from the prospect information
  const codeId = `COM-${prospect.id.substring(0, 2)}${index + 1}`;
  
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
          className={`rounded-md ${
            snapshot.isDragging 
              ? 'bg-white/10 shadow-lg border border-blue-500/50' 
              : 'bg-black/40 border border-white/10 hover:border-white/30'
          } transition-all`}
        >
          <div className="p-3">
            <div className="text-sm font-medium mb-2">
              {prospect.company || 'Unknown Company'}
            </div>
            
            <div className="flex items-center mb-3">
              <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded flex items-center">
                <span>{codeId}</span>
              </div>
              {prospect.daysSinceLastContact !== null && (
                <div className="ml-auto text-xs text-white/50">
                  {prospect.daysSinceLastContact}d
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/70 flex items-center">
                {prospect.first_name} {prospect.last_name}
              </div>
              
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full bg-${prospect.statusColor}`}></div>
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs text-white font-medium ml-2">
                  JC
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ProspectCard;
