
import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import StatusColumn from './StatusColumn';
import { DealStage, fetchDealStages, updateProspectDealStage } from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';

// Define interface for Prospect from database
interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  deal_stage_id: string | null;
  // Add a dragId property for drag and drop functionality
  dragId?: string;
  // Add a derived property for days since last contact
  daysSinceLastContact?: number | null;
}

interface ProspectStatusBoardProps {
  prospects: any[];
  isLoading: boolean;
}

type StatusColumn = {
  id: string;
  title: string;
  prospects: Prospect[];
}

const ProspectStatusBoard: React.FC<ProspectStatusBoardProps> = ({ prospects, isLoading }) => {
  const [dealStages, setDealStages] = useState<DealStage[]>([]);
  const [columns, setColumns] = useState<StatusColumn[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dbProspects, setDbProspects] = useState<Prospect[]>([]);
  const [isLoadingProspects, setIsLoadingProspects] = useState(true);
  
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
  
  // Fetch prospects from the database
  useEffect(() => {
    const fetchProspects = async () => {
      setIsLoadingProspects(true);
      
      try {
        // Fetch prospects and their last contact date
        const { data: prospectData, error } = await supabase
          .from('prospect_profile')
          .select(`
            *,
            prospect_engagement(last_contact_date)
          `);
          
        if (error) {
          console.error("Error fetching prospects:", error);
          toast.error("Failed to load prospects");
          return;
        }
        
        // Process prospects to add dragId and calculate days since last contact
        const processedProspects = prospectData.map(prospect => {
          // Extract last contact date from engagement if available
          const lastContactDate = prospect.prospect_engagement && 
            prospect.prospect_engagement[0]?.last_contact_date;
          
          // Calculate days since last contact
          let daysSinceLastContact = null;
          if (lastContactDate) {
            const diffTime = Date.now() - new Date(lastContactDate).getTime();
            daysSinceLastContact = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
          
          return {
            ...prospect,
            dragId: `drag-${prospect.id}`,
            daysSinceLastContact
          };
        });
        
        setDbProspects(processedProspects);
      } catch (error) {
        console.error("Error in fetchProspects:", error);
      } finally {
        setIsLoadingProspects(false);
      }
    };
    
    if (isLoaded) {
      fetchProspects();
    }
  }, [isLoaded]);
  
  // Distribute prospects among deal stages
  useEffect(() => {
    if (!isLoaded || dealStages.length === 0) return;
    
    const newColumns = [...columns];
    
    // Clear all columns first
    newColumns.forEach(col => {
      col.prospects = [];
    });
    
    // Distribute prospects to appropriate columns
    dbProspects.forEach(prospect => {
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
  }, [dbProspects, isLoaded, dealStages]);
  
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
  
  if (isLoading || !isLoaded || isLoadingProspects) {
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
