
import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { ProspectWithEngagement, updateProspectDealStage } from '@/services/supabaseService';
import { toast } from 'sonner';
import DealStageColumn from './DealStageColumn';

interface ProspectDealBoardProps {
  prospects: ProspectWithEngagement[];
  dealStages: any[];
  isLoading: boolean;
}

type DealColumn = {
  id: string;
  title: string;
  prospects: ProspectWithEngagement[];
}

const ProspectDealBoard: React.FC<ProspectDealBoardProps> = ({ prospects, dealStages, isLoading }) => {
  const [columns, setColumns] = useState<DealColumn[]>([]);
  
  // Initialize columns based on deal stages
  useEffect(() => {
    if (dealStages && dealStages.length > 0) {
      const initialColumns = dealStages.map(stage => ({
        id: stage.id,
        title: stage.name,
        prospects: []
      }));
      
      setColumns(initialColumns);
    }
  }, [dealStages]);
  
  // Ensure each prospect has a unique draggable ID and distribute them among columns
  useEffect(() => {
    if (prospects.length > 0 && columns.length > 0) {
      const uniqueProspects = prospects.map(prospect => ({
        ...prospect,
        dragId: `drag-${prospect.id}`
      }));
      
      const newColumns = [...columns];
      
      // Reset all columns
      newColumns.forEach(column => {
        column.prospects = [];
      });
      
      // Distribute prospects based on deal_stage_id
      uniqueProspects.forEach(prospect => {
        const dealStageId = prospect.deal_stage_id;
        
        if (dealStageId) {
          // Find the column matching the deal stage ID
          const column = newColumns.find(col => col.id === dealStageId);
          if (column) {
            column.prospects.push(prospect);
          } else if (newColumns[0]) {
            // If no matching column, put in first column
            newColumns[0].prospects.push(prospect);
          }
        } else if (newColumns[0]) {
          // If no deal stage ID, put in first column
          newColumns[0].prospects.push(prospect);
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/70">Loading prospects...</div>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto pb-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-5" style={{ minWidth: 'max-content' }}>
          {columns.map(column => (
            <DealStageColumn
              key={column.id}
              id={column.id}
              title={column.title}
              prospects={column.prospects}
              count={column.prospects.length}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProspectDealBoard;
