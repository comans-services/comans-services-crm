
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { StatusColumn } from '../utils/columnUtils';
import { DropResult } from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration';
import { DragEndPayload } from '@atlaskit/pragmatic-drag-and-drop';

export const useDragDrop = (initialColumns: StatusColumn[], setColumns: React.Dispatch<React.SetStateAction<StatusColumn[]>>) => {
  // This handles drop results using similar structure to beautiful-dnd
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If no destination or dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    
    // Find source and destination columns
    const sourceColumn = initialColumns.find(col => col.id === source.droppableId);
    const destColumn = initialColumns.find(col => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;
    
    // Clone the columns and prospects arrays
    const newColumns = [...initialColumns];
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
    
    try {
      // Calculate new last contact date based on destination column
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

  return { handleDragEnd };
};
