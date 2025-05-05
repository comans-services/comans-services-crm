
import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/mockDataService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import StatusColumn from './StatusColumn';

interface ProspectStatusBoardProps {
  prospects: ProspectWithEngagement[];
  isLoading: boolean;
  onCreateLead: () => void;
}

type StatusColumn = {
  id: string;
  title: string;
  prospects: ProspectWithEngagement[];
}

const ProspectStatusBoard: React.FC<ProspectStatusBoardProps> = ({ prospects, isLoading, onCreateLead }) => {
  // Define status columns
  const initialColumns: StatusColumn[] = [
    {
      id: 'new-lead',
      title: 'New Lead',
      prospects: []
    },
    {
      id: 'contacted',
      title: 'Contacted',
      prospects: []
    },
    {
      id: 'meeting-scheduled',
      title: 'Meeting Scheduled',
      prospects: []
    },
    {
      id: 'qualified',
      title: 'Qualified',
      prospects: []
    },
    {
      id: 'proposal-sent',
      title: 'Proposal Sent',
      prospects: []
    },
    {
      id: 'closed-won',
      title: 'Closed Won',
      prospects: []
    },
    {
      id: 'closed-lost',
      title: 'Closed Lost',
      prospects: []
    }
  ];
  
  // Ensure each prospect has a unique draggable ID
  const ensureUniqueIds = (prospects: ProspectWithEngagement[]): ProspectWithEngagement[] => {
    return prospects.map(prospect => {
      // If the ID looks like a duplicate (prospect-X format), generate a new unique ID
      if (prospect.id.startsWith('prospect-')) {
        return { ...prospect, dragId: `drag-${uuidv4()}` };
      }
      return { ...prospect, dragId: `drag-${prospect.id}` };
    });
  };

  // For demonstration, distribute prospects among statuses based on some logic
  const distributeProspects = (prospects: ProspectWithEngagement[]): StatusColumn[] => {
    const columns = [...initialColumns];
    const uniqueProspects = ensureUniqueIds(prospects);
    
    uniqueProspects.forEach(prospect => {
      const daysSinceLastContact = prospect.daysSinceLastContact;
      let statusId: string;
      
      // Simple logic to distribute prospects based on days since last contact
      if (daysSinceLastContact === null) {
        statusId = 'new-lead';
      } else if (daysSinceLastContact <= 2) {
        statusId = 'contacted';
      } else if (daysSinceLastContact <= 5) {
        statusId = 'meeting-scheduled';
      } else if (daysSinceLastContact <= 7) {
        statusId = 'qualified';
      } else if (daysSinceLastContact <= 10) {
        statusId = 'proposal-sent';
      } else if (daysSinceLastContact <= 15) {
        statusId = 'closed-won';
      } else {
        statusId = 'closed-lost';
      }
      
      const column = columns.find(col => col.id === statusId);
      if (column) {
        column.prospects.push(prospect);
      }
    });
    
    return columns;
  };
  
  const [columns, setColumns] = useState<StatusColumn[]>(distributeProspects(prospects));
  
  // Update columns when prospects change
  useEffect(() => {
    if (prospects.length > 0) {
      setColumns(distributeProspects(prospects));
    }
  }, [prospects]);
  
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    // If no destination or dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    
    // Find source and destination columns
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;
    
    // Clone the columns and prospects arrays
    const newColumns = [...columns];
    const sourceColumnIndex = newColumns.findIndex(col => col.id === sourceColumn.id);
    const destColumnIndex = newColumns.findIndex(col => col.id === destColumn.id);
    
    // Remove prospect from source column
    const [movedProspect] = newColumns[sourceColumnIndex].prospects.splice(source.index, 1);
    
    // Add prospect to destination column
    newColumns[destColumnIndex].prospects.splice(destination.index, 0, movedProspect);
    
    // Update state
    setColumns(newColumns);
    
    // Show toast notification
    toast.success(`${movedProspect.first_name} ${movedProspect.last_name} moved to ${destColumn.title}`);
  };
  
  if (isLoading) {
    return <div className="card p-8 text-center">Loading prospects...</div>;
  }
  
  return (
    <div className="overflow-x-auto pb-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
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
