
import React from 'react';
import { Plus } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { ProspectWithEngagement } from '@/services/types/serviceTypes';
import ProspectCard from './ProspectCard';


interface StatusColumnProps {
  id: string;
  title: string;
  prospects: ProspectWithEngagement[];
  onCreateLead?: () => void;
}

const StatusColumn: React.FC<StatusColumnProps> = ({
  id,
  title,
  prospects,
  onCreateLead,
}) => {
  return (
    <Droppable droppableId={id}>
      {(dropProvided) => (
        <div
          ref={dropProvided.innerRef}
          {...dropProvided.droppableProps}
          className="min-w-[280px] max-w-[280px]"
        >
          {/* Column header */}
          <div className="card flex h-[calc(100vh-12rem)] flex-col overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center">
                <span className="font-semibold text-white">{title}</span>
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
                  {prospects.length}
                </span>
              </div>

              {id === 'new-lead' && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded p-1 hover:bg-white/10"
                  onClick={onCreateLead}
                >
                  <Plus size={16} />
                </Button>
              )}
            </div>

            {/* Card list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3">
              {prospects.map((prospect, index) => (
                <Draggable
                  key={prospect.dragId || prospect.id}
                  draggableId={(prospect.dragId || prospect.id).toString()}
                  index={index}
                >
                  {(dragProvided) => (
                    <ProspectCard
                      prospect={prospect}
                      ref={dragProvided.innerRef}
                      dragHandleProps={dragProvided.dragHandleProps}
                      draggableProps={dragProvided.draggableProps}
                      style={dragProvided.draggableProps.style}
                    />
                  )}
                </Draggable>
              ))}

              {/* Placeholder required by DnD lib */}
              {dropProvided.placeholder}

              {/* Empty-state helpers */}
              {prospects.length === 0 && id !== 'new-lead' && (
                <div className="flex h-16 items-center justify-center rounded-md border border-dashed border-white/10">
                  <span className="text-xs text-white/50">No prospects</span>
                </div>
              )}

              {prospects.length === 0 && id === 'new-lead' && (
                <div className="flex h-16 items-center justify-center rounded-md border border-dashed border-white/10">
                  <button
                    className="flex items-center text-xs text-white/50 hover:text-white/80"
                    onClick={onCreateLead}
                  >
                    <Plus size={14} className="mr-1" />
                    Create New Lead
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default StatusColumn;
