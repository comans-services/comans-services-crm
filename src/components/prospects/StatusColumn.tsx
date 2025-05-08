import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProspectWithEngagement } from '@/services/types';
import ProspectCard from './ProspectCard';

interface StatusColumnProps {
  id: string;
  title: string;
  prospects: ProspectWithEngagement[];
  onCreateLead?: () => void;
}

const StatusColumn: React.FC<StatusColumnProps> = ({ id, title, prospects, onCreateLead }) => {
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
          {id === 'new-lead' && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="p-1 rounded hover:bg-white/10"
              onClick={onCreateLead}
            >
              <Plus size={16} />
            </Button>
          )}
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
              
              {prospects.length === 0 && id !== 'new-lead' && (
                <div className={`flex items-center justify-center h-16 border border-dashed ${
                  snapshot.isDraggingOver ? 'border-blue-400/50 bg-blue-400/10' : 'border-white/10'
                } rounded-md transition-colors duration-200`}>
                  <span className="text-xs text-white/50">
                    Drop prospect here
                  </span>
                </div>
              )}
              
              {prospects.length === 0 && id === 'new-lead' && (
                <div className="flex items-center justify-center h-16 border border-dashed border-white/10 rounded-md">
                  <button 
                    className="text-xs text-white/50 hover:text-white/80 flex items-center"
                    onClick={onCreateLead}
                  >
                    <Plus size={14} className="mr-1" />
                    Create New Lead
                  </button>
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
