
import React, { useState, useEffect } from 'react';
import { ProspectWithEngagement } from '@/services/supabaseService';
import StatusColumn from './StatusColumn';
import ProspectBoardLoading from './ProspectBoardLoading';
import { distributeProspects, StatusColumn as StatusColumnType } from './utils/columnUtils';
import { useDragDrop } from './hooks/useDragDrop';
import { DragDropContext } from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration';

interface ProspectStatusBoardProps {
  prospects: ProspectWithEngagement[];
  isLoading: boolean;
  onCreateLead: () => void;
}

const ProspectStatusBoard: React.FC<ProspectStatusBoardProps> = ({ prospects, isLoading, onCreateLead }) => {
  const [columns, setColumns] = useState<StatusColumnType[]>([]);
  const { handleDragEnd } = useDragDrop(columns, setColumns);
  
  // Update columns when prospects change
  useEffect(() => {
    if (prospects.length > 0) {
      setColumns(distributeProspects(prospects));
    }
  }, [prospects]);
  
  if (isLoading) {
    return <ProspectBoardLoading />;
  }
  
  return (
    <div className="pb-4 overflow-x-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div 
          className="flex gap-4"
          style={{ minWidth: 'max-content' }}
        >
          {columns.map(column => (
            <StatusColumn
              key={column.id}
              id={column.id}
              title={column.title}
              prospects={column.prospects}
              onCreateLead={column.id === 'new-lead' ? onCreateLead : undefined}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProspectStatusBoard;
