
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProspectWithEngagement } from '@/services/supabaseService';
import ProspectCard from './ProspectCard';
import { Droppable } from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration';
import { ScrollArea } from '@/components/ui/scroll-area';

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
              className="flex-1 overflow-y-auto p-2"
            >
              {prospects.map((prospect, index) => (
                <ProspectCard 
                  key={prospect.dragId || prospect.id}
                  prospect={prospect} 
                  index={index} 
                />
              ))}
              
              {prospects.length === 0 && id !== 'new-lead' && (
                <div className="flex items-center justify-center h-16 border border-dashed border-white/10 rounded-md">
                  <span className="text-xs text-white/50">
                    No prospects
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
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default StatusColumn;
