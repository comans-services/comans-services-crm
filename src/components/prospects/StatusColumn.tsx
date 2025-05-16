
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProspectWithEngagement } from '@/services/types/serviceTypes';
import ProspectCard from './ProspectCard';
import { useDragItem } from './dragAndDrop/hooks/useDragItem';

interface StatusColumnProps {
  id: string;
  title: string;
  prospects: ProspectWithEngagement[];
  onCreateLead?: () => void;
  onProspectDragStart?: (prospect: ProspectWithEngagement, index: number) => void;
  onDragEnd?: () => Promise<void>;
}

const StatusColumn: React.FC<StatusColumnProps> = ({
  id,
  title,
  prospects,
  onCreateLead,
  onProspectDragStart,
  onDragEnd,
}) => {
  return (
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
          <DraggableProspectCard
            key={prospect.dragId || prospect.id}
            prospect={prospect}
            index={index}
            columnId={id}
            onDragStart={onProspectDragStart}
            onDragEnd={onDragEnd}
          />
        ))}

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
  );
};

/**
 * A wrapper component that makes a prospect card draggable
 */
const DraggableProspectCard: React.FC<{
  prospect: ProspectWithEngagement;
  index: number;
  columnId: string;
  onDragStart?: (prospect: ProspectWithEngagement, index: number) => void;
  onDragEnd?: () => Promise<void>;
}> = ({ prospect, index, columnId, onDragStart, onDragEnd }) => {
  const handleDragStart = React.useCallback(() => {
    if (onDragStart) {
      onDragStart(prospect, index);
    }
  }, [onDragStart, prospect, index]);
  
  const dragRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const element = dragRef.current;
    if (!element) return;
    
    // Make the element draggable
    const { draggable } = require('@atlaskit/pragmatic-drag-and-drop/element/adapter');
    
    const cleanup = draggable({
      element,
      getInitialData: () => ({
        itemId: prospect.dragId || prospect.id.toString(),
        itemData: prospect,
        columnId,
        index,
      }),
      onDragStart: handleDragStart,
      onDragEnd: onDragEnd,
    });
    
    return cleanup;
  }, [prospect, index, columnId, handleDragStart, onDragEnd]);
  
  return (
    <div 
      ref={dragRef}
      data-draggable="true"
      className="cursor-grab active:cursor-grabbing"
    >
      <ProspectCard prospect={prospect} />
    </div>
  );
};

export default StatusColumn;
