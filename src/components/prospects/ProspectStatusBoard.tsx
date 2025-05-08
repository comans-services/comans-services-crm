
import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/mockDataService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import StatusColumn from './StatusColumn';
import { DealStage, fetchDealStages, updateProspectDealStage } from '@/services/supabaseService';

interface ProspectStatusBoardProps {
  prospects: ProspectWithEngagement[];
  isLoading: boolean;
}

type StatusColumn = {
  id: string;
  title: string;
  prospects: ProspectWithEngagement[];
}

const ProspectStatusBoard: React.FC<ProspectStatusBoardProps> = ({ prospects, isLoading }) => {
  const [dealStages, setDealStages] = useState<DealStage[]>([]);
  const [columns, setColumns] = useState<StatusColumn[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load deal stages from database
  useEffect(() => {
    const loadDealStages = async () => {
      const stages = await fetchDealStages();
      setDealStages(stages);
      
      // Initialize columns based on deal stages
      const initialColumns: StatusColumn[] = stages.map(stage => ({
        id: stage.id,
        title: stage.name,
        prospects: []
      }));
      
      setColumns(initialColumns);
      setIsLoaded(true);
    };
    
    loadDealStages();
  }, []);
  
  // Ensure each prospect has a unique draggable ID
  const ensureUniqueIds = (prospects: ProspectWithEngagement[]): ProspectWithEngagement[] => {
    return prospects.map(prospect => {
      if (prospect.id.startsWith('prospect-')) {
        return { ...prospect, dragId: `drag-${uuidv4()}` };
      }
      return { ...prospect, dragId: `drag-${prospect.id}` };
    });
  };

  // Distribute prospects among deal stages when they're loaded
  useEffect(() => {
    if (!isLoaded || prospects.length === 0 || dealStages.length === 0) return;
    
    const uniqueProspects = ensureUniqueIds(prospects);
    const newColumns = [...columns];
    
    // Clear all columns first
    newColumns.forEach(col => {
      col.prospects = [];
    });
    
    // Distribute prospects to appropriate columns
    uniqueProspects.forEach(prospect => {
      // For demo/mock data that might not have deal_stage_id, use a default distribution
      let columnId = prospect.deal_stage_id || dealStages[0]?.id;
      
      const column = newColumns.find(col => col.id === columnId);
      if (column) {
        column.prospects.push(prospect);
      } else if (newColumns.length > 0) {
        // If column not found, add to first column as fallback
        newColumns[0].prospects.push(prospect);
      }
    });
    
    setColumns(newColumns);
  }, [prospects, isLoaded, dealStages]);
  
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
    
    // Remove prospect from source column
    const [movedProspect] = newColumns[sourceColumnIndex].prospects.splice(source.index, 1);
    
    // Add prospect to destination column
    newColumns[destColumnIndex].prospects.splice(destination.index, 0, movedProspect);
    
    // Update state
    setColumns(newColumns);
    
    // Show toast notification
    toast.success(`${movedProspect.first_name} ${movedProspect.last_name} moved to ${destColumn.title}`);
    
    // Update the prospect's deal stage in the database
    const prospectId = movedProspect.id;
    const dealStageId = destColumn.id;
    
    // Call the API to update the deal stage
    await updateProspectDealStage(prospectId, dealStageId);
  };
  
  if (isLoading || !isLoaded) {
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
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProspectStatusBoard;
