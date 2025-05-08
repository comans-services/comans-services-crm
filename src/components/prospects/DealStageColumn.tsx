
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProspectWithEngagement } from '@/services/supabaseService';
import ProspectCard from './ProspectCard';

interface DealStageColumnProps {
  id: string;
  title: string;
  prospects: ProspectWithEngagement[];
  count: number;
  onCreateLead?: () => void;
}

const DealStageColumn: React.FC<DealStageColumnProps> = ({ id, title, prospects, count, onCreateLead }) => {
  return (
    <div className="min-w-[300px] max-w-[300px]">
      <div className="card p-0 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
        <div className="p-3 border-b border-white/10 bg-black/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-white font-semibold uppercase tracking-wide text-sm">{title}</span>
              <span className="ml-2 bg-white/20 text-white text-xs rounded-full px-2 py-0.5">
                {count}
              </span>
            </div>
            {onCreateLead && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="p-1 rounded-full hover:bg-white/10 ml-auto"
                onClick={onCreateLead}
              >
                <Plus size={16} />
              </Button>
            )}
          </div>
        </div>
        
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 overflow-y-auto p-2 space-y-3 transition-colors duration-200 ${
                snapshot.isDraggingOver 
                  ? 'bg-black/40 border border-blue-400/50' 
                  : 'bg-transparent'
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
              
              {prospects.length === 0 && !onCreateLead && (
                <div className={`flex items-center justify-center h-16 border border-dashed ${
                  snapshot.isDraggingOver ? 'border-blue-400/50 bg-blue-400/10' : 'border-white/10'
                } rounded-md transition-colors duration-200`}>
                  <span className="text-xs text-white/50">
                    Drop prospect here
                  </span>
                </div>
              )}
              
              {prospects.length === 0 && onCreateLead && (
                <div className="flex items-center justify-center h-16 border border-dashed border-white/10 rounded-md mt-2">
                  <button 
                    className="text-xs text-white/70 hover:text-white flex items-center"
                    onClick={onCreateLead}
                  >
                    <Plus size={14} className="mr-1" />
                    Create lead
                  </button>
                </div>
              )}
            </div>
          )}
        </Droppable>
        
        {prospects.length > 0 && onCreateLead && (
          <div className="p-2 border-t border-white/10 bg-black/30">
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-center items-center flex text-white/70 hover:text-white hover:bg-white/10"
              onClick={onCreateLead}
            >
              <Plus size={14} className="mr-1" />
              <span className="text-xs">Create</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealStageColumn;
