import React, { useRef } from 'react';
import { ProspectWithEngagement } from '@/services/types/serviceTypes';
import DragDropProvider from './DragDropProvider';
import { useBoard } from './useBoard';
import { useDragItem } from './hooks/useDragItem';
import { useDropColumn } from './hooks/useDropColumn';
import { DragOverlay } from './DragOverlay';
import ProspectCard from '../ProspectCard';
import StatusColumn from '../StatusColumn';
import { StatusColumn as StatusColumnType } from '../utils/columnUtils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Integration example showing how to use the drag-and-drop system
 * with the existing board components.
 *
 * This is a usage example - no need to actually use this component,
 * just integrate the hooks and components as shown.
 */
export const ProspectBoardIntegrationExample: React.FC<{
  columns: StatusColumnType[];
  onUpdate: (columns: StatusColumnType[]) => void;
}> = ({ columns: initialColumns, onUpdate }) => {
  const { columns, dragState, handlers } = useBoard<ProspectWithEngagement>({
    initialColumns,
    onColumnUpdate: onUpdate,
  });

  // Track mouse position for overlay
  const mouseRef = useRef({ x: 0, y: 0 });
  
  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <DragDropProvider>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <ColumnWithDropZone
            key={col.id}
            column={col}
            onDragUpdate={handlers.onDragUpdate}
            onDragStart={handlers.onDragStart}
          />
        ))}
      </div>
      
      {/* Drag Overlay Portal */}
      <DragOverlay
        isActive={!!dragState.activeId}
        item={dragState.activeData}
        clientOffset={mouseRef.current}
      >
        {({ item }) => <ProspectCard prospect={item} />}
      </DragOverlay>
    </DragDropProvider>
  );
};

/**
 * Example of a column that uses the drop zone hook
 */
const ColumnWithDropZone: React.FC<{
  column: StatusColumnType;
  onDragUpdate: (columnId: string | null, index: number | null) => void;
  onDragStart: (id: string, columnId: string, index: number, data: ProspectWithEngagement) => void;
}> = ({ column, onDragUpdate, onDragStart }) => {
  // Reference to the column element
  const dropRef = useDropColumn<ProspectWithEngagement>({
    columnId: column.id,
    onDragUpdate: (columnId, index) => onDragUpdate(columnId, index),
  });

  return (
    <div ref={dropRef as React.RefObject<HTMLDivElement>} className="min-w-[280px] max-w-[280px]">
      <div className="card flex h-[calc(100vh-12rem)] flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center">
            <span className="font-semibold text-white">{column.title}</span>
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
              {column.prospects.length}
            </span>
          </div>
          
          {column.id === 'new-lead' && (
            <Button
              size="sm"
              variant="ghost"
              className="rounded p-1 hover:bg-white/10"
            >
              <Plus size={16} />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {column.prospects.map((prospect, index) => (
            <DraggableProspectCard
              key={prospect.dragId || prospect.id}
              prospect={prospect}
              index={index}
              columnId={column.id}
              onDragStart={onDragStart}
            />
          ))}
          
          {column.prospects.length === 0 && (
            <div className="flex h-16 items-center justify-center rounded-md border border-dashed border-white/10">
              <span className="text-xs text-white/50">
                {column.id === 'new-lead' ? 'Create New Lead' : 'No prospects'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Example of a draggable card that uses the drag item hook
 */
const DraggableProspectCard: React.FC<{
  prospect: ProspectWithEngagement;
  index: number;
  columnId: string;
  onDragStart: (id: string, columnId: string, index: number, data: ProspectWithEngagement) => void;
}> = ({ prospect, index, columnId, onDragStart }) => {
  const dragRef = useDragItem<ProspectWithEngagement>({
    id: prospect.dragId || prospect.id.toString(),
    index,
    columnId,
    data: prospect,
    onDragStart,
  });

  return (
    <div 
      ref={dragRef as React.RefObject<HTMLDivElement>}
      data-draggable="true"
      className="cursor-grab active:cursor-grabbing"
    >
      <ProspectCard prospect={prospect} />
    </div>
  );
};

export default ProspectBoardIntegrationExample;
