
import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { ProspectWithEngagement, updateProspectDealStage } from '@/services/supabaseService';
import { toast } from 'sonner';
import DealStageColumn from './DealStageColumn';

interface ProspectDealBoardProps {
  prospects: ProspectWithEngagement[];
  dealStages: Array<{
    id: string;
    name: string;
    sort_order: number;
  }>;
  isLoading: boolean;
  onCreateLead: () => void;
}

type DealStageColumn = {
  id: string;
  title: string;
  prospects: ProspectWithEngagement[];
}

const ProspectDealBoard: React.FC<ProspectDealBoardProps> = ({ 
  prospects, 
  dealStages, 
  isLoading, 
  onCreateLead 
}) => {
  const [columns, setColumns] = useState<DealStageColumn[]>([]);
  
  // Create columns based on deal stages
  useEffect(() => {
    if (dealStages.length > 0) {
      // Sort deal stages by sort_order
      const sortedDealStages = [...dealStages].sort((a, b) => a.sort_order - b.sort_order);
      
      // Create initial columns based on stages
      const initialColumns: DealStageColumn[] = sortedDealStages.map((stage) => ({
        id: stage.id,
        title: stage.name.toUpperCase(),
        prospects: []
      }));
      
      setColumns(initialColumns);
    }
  }, [dealStages]);

  // Ensure each prospect has a unique draggable ID
  const ensureUniqueIds = (prospects: ProspectWithEngagement[]): ProspectWithEngagement[] => {
    return prospects.map(prospect => {
      return { ...prospect, dragId: `drag-${prospect.id}` };
    });
  };

  // Distribute prospects among deal stages
  useEffect(() => {
    if (prospects.length > 0 && columns.length > 0) {
      const uniqueProspects = ensureUniqueIds(prospects);
      const newColumns = [...columns];
      
      // Reset all columns
      newColumns.forEach(column => {
        column.prospects = [];
      });
      
      // Distribute prospects based on deal_stage_id
      uniqueProspects.forEach(prospect => {
        const dealStageId = prospect.deal_stage_id;
        
        if (dealStageId) {
          // Find the column matching the stage ID
          const column = newColumns.find(col => col.id === dealStageId);
          if (column) {
            column.prospects.push(prospect);
          } else {
            // If no matching column, put in first column
            if (newColumns[0]) {
              newColumns[0].prospects.push(prospect);
            }
          }
        } else {
          // If no stage ID, put in first column
          if (newColumns[0]) {
            newColumns[0].prospects.push(prospect);
          }
        }
      });
      
      setColumns(newColumns);
    }
  }, [prospects, columns.length]);
  
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
    const dragId = draggableId;
    const prospectIndex = newColumns[sourceColumnIndex].prospects.findIndex(p => p.dragId === dragId || p.id === dragId);
    
    if (prospectIndex === -1) return;
    
    // Remove prospect from source column
    const [movedProspect] = newColumns[sourceColumnIndex].prospects.splice(prospectIndex, 1);
    
    // Add prospect to destination column
    newColumns[destColumnIndex].prospects.splice(destination.index, 0, movedProspect);
    
    // Update state optimistically
    setColumns(newColumns);
    
    // Update the prospect's deal stage in Supabase
    try {
      const success = await updateProspectDealStage(movedProspect.id, destColumn.id);
      
      if (success) {
        toast.success(`${movedProspect.first_name} ${movedProspect.last_name} moved to ${destColumn.title}`);
      } else {
        toast.error("Failed to update prospect's stage");
        
        // Revert the change in the UI
        const revertColumns = [...columns];
        // Add the prospect back to the source column
        revertColumns[sourceColumnIndex].prospects.splice(source.index, 0, movedProspect);
        // Remove from destination
        const destProspectIndex = revertColumns[destColumnIndex].prospects.findIndex(p => p.id === movedProspect.id);
        if (destProspectIndex !== -1) {
          revertColumns[destColumnIndex].prospects.splice(destProspectIndex, 1);
        }
        setColumns(revertColumns);
      }
    } catch (error) {
      console.error("Error updating prospect stage:", error);
      toast.error("An error occurred while updating the prospect's stage");
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
            <DealStageColumn
              key={column.id}
              id={column.id}
              title={column.title}
              prospects={column.prospects}
              count={column.prospects.length}
              onCreateLead={column.id === columns[0]?.id ? onCreateLead : undefined}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProspectDealBoard;
