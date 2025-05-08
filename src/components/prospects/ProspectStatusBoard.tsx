import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/supabaseService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import StatusColumn from './StatusColumn';
import { supabase } from '@/integrations/supabase/client';

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
      return { 
        ...prospect, 
        dragId: `drag-${prospect.id}` 
      };
    });
  };

  // Distribute prospects among statuses based on engagement data
  const distributeProspects = (prospects: ProspectWithEngagement[]): StatusColumn[] => {
    const columns = [...initialColumns];
    const uniqueProspects = ensureUniqueIds(prospects);
    
    uniqueProspects.forEach(prospect => {
      const daysSinceLastContact = prospect.daysSinceLastContact;
      let statusId: string;
      
      // Logic to distribute prospects based on days since last contact
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
  
  const [columns, setColumns] = useState<StatusColumn[]>([]); // Initialize with empty array
  
  // Update columns when prospects change
  useEffect(() => {
    if (prospects.length > 0) {
      setColumns(distributeProspects(prospects));
    }
  }, [prospects]);
  
  const handleDragEnd = async (result: any) => {
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
    
    // Find the moved prospect
    const movedProspectIndex = sourceColumn.prospects.findIndex(
      p => p.dragId === draggableId || `drag-${p.id}` === draggableId
    );
    
    if (movedProspectIndex === -1) return;
    
    // Remove prospect from source column
    const [movedProspect] = newColumns[sourceColumnIndex].prospects.splice(movedProspectIndex, 1);
    
    // Add prospect to destination column
    newColumns[destColumnIndex].prospects.splice(destination.index, 0, movedProspect);
    
    // Calculate new last contact date based on destination column
    try {
      let lastContactDate: string | null = null;
      
      // This is a simplified version - in a real app, you might want to update
      // to a custom engagement stage in Supabase
      switch (destColumn.id) {
        case 'new-lead':
          lastContactDate = null;
          break;
        case 'contacted':
          lastContactDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(); // 1 day ago
          break;
        case 'meeting-scheduled':
          lastContactDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 days ago
          break;
        case 'qualified':
          lastContactDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(); // 6 days ago
          break;
        case 'proposal-sent':
          lastContactDate = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(); // 9 days ago
          break;
        case 'closed-won':
          lastContactDate = new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(); // 12 days ago
          break;
        case 'closed-lost':
          lastContactDate = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(); // 20 days ago
          break;
      }
      
      // Update engagement record in Supabase
      const { error } = await supabase
        .from('prospect_engagement')
        .update({ 
          last_contact_date: lastContactDate,
          updated_at: new Date().toISOString()
        })
        .eq('prospect_id', movedProspect.id);
      
      if (error) throw error;
      
      // Update state
      setColumns(newColumns);
      
      // Show toast notification
      toast.success(`${movedProspect.first_name} ${movedProspect.last_name} moved to ${destColumn.title}`);
    } catch (error: any) {
      toast.error(`Error updating prospect status: ${error.message}`);
    }
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
