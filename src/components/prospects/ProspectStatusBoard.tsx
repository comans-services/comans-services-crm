
/* src/components/prospects/ProspectStatusBoard.tsx */
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import { ProspectWithEngagement } from '@/services/supabaseService';
import StatusColumn from './StatusColumn';
import ProspectBoardLoading from './ProspectBoardLoading';

import {
  distributeProspects,
  StatusColumn as StatusColumnType,
} from './utils/columnUtils';
import { useDragDrop } from './hooks/useDragDrop';

interface ProspectStatusBoardProps {
  prospects: ProspectWithEngagement[];
  isLoading: boolean;
  onCreateLead: () => void;
}

/**
 * Shows every engagement stage as a draggable column.
 * The board itself owns the column state so a drag can
 * update the UI instantly while the hook persists changes.
 */
const ProspectStatusBoard: React.FC<ProspectStatusBoardProps> = ({
  prospects,
  isLoading,
  onCreateLead,
}) => {
  /** live state for every column with its prospects */
  const [columns, setColumns] = useState<StatusColumnType[]>([]);

  /** custom hook wires drag-end to Supabase + toast */
  const { handleDragEnd } = useDragDrop(columns, setColumns);

  /** whenever the prospects list changes, rebuild the board */
  useEffect(() => {
    setColumns(distributeProspects(prospects));
  }, [prospects]);

  if (isLoading) return <ProspectBoardLoading />;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="COLUMN">
        {(boardProvided) => (
          <div
            ref={boardProvided.innerRef}
            {...boardProvided.droppableProps}
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ minWidth: 'max-content' }}
          >
            {columns.map((col) => (
              <StatusColumn
                key={col.id}
                id={col.id}
                title={col.title}
                prospects={col.prospects}
                onCreateLead={col.id === 'new-lead' ? onCreateLead : undefined}
              />
            ))}
            {boardProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ProspectStatusBoard;
