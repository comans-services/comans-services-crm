
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { fetchProspects, fetchDealStages, updateProspectDealStage } from '@/services/supabaseService';

// Define prospect interface for this component
interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  deal_stage_id: string | null;
  daysSinceLastContact?: number | null;
  dragId?: string;
}

// Define deal stage interface
interface DealStage {
  id: string;
  name: string;
  sort_order: number;
}

// Define column type for the board
interface Column {
  id: string;
  title: string;
  prospects: Prospect[];
}

const StatusOfProspect: React.FC = () => {
  const [columns, setColumns] = React.useState<Column[]>([]);

  // Fetch prospects and deal stages data
  const { data: prospects = [], isLoading: isLoadingProspects, error: prospectsError } = useQuery({
    queryKey: ['prospects'],
    queryFn: fetchProspects,
  });

  const { data: dealStages = [], isLoading: isLoadingDealStages, error: dealStagesError } = useQuery({
    queryKey: ['dealStages'],
    queryFn: fetchDealStages,
  });

  // Combined loading / error states
  const isLoading = isLoadingProspects || isLoadingDealStages;
  const error = prospectsError || dealStagesError;

  // Build columns from deal stages and distribute prospects
  React.useEffect(() => {
    if (!dealStages.length) return;
    
    // Initialize columns based on deal stages
    const stageColumns = dealStages.map(stage => ({
      id: stage.id,
      title: stage.name,
      prospects: []
    }));
    
    // Distribute prospects into columns
    if (prospects.length && stageColumns.length) {
      prospects.forEach(prospect => {
        // Find which column this prospect belongs to
        const stageId = prospect.deal_stage_id || dealStages[0]?.id;
        const column = stageColumns.find(col => col.id === stageId);
        
        if (column) {
          // Add prospect to appropriate column with a dragId
          column.prospects.push({
            ...prospect,
            dragId: `drag-${prospect.id}`
          });
        }
      });
    }
    
    // Sort columns by the deal stage sort_order
    stageColumns.sort((a, b) => {
      const stageA = dealStages.find(stage => stage.id === a.id);
      const stageB = dealStages.find(stage => stage.id === b.id);
      return (stageA?.sort_order || 0) - (stageB?.sort_order || 0);
    });
    
    setColumns(stageColumns);
  }, [prospects, dealStages]);

  // Handle drag end
  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination, do nothing
    if (!destination) return;
    
    // If the card was dropped in the same place, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    // Find source and destination columns
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;
    
    // Create copies of the arrays
    const newColumns = [...columns];
    const sourceColumnIndex = newColumns.findIndex(col => col.id === source.droppableId);
    const destColumnIndex = newColumns.findIndex(col => col.id === destination.droppableId);
    
    // Copy the source and destination prospects arrays
    const sourceProspects = [...newColumns[sourceColumnIndex].prospects];
    const destProspects = sourceColumnIndex === destColumnIndex ? 
      sourceProspects : [...newColumns[destColumnIndex].prospects];
    
    // Remove the prospect from the source column
    const [movedProspect] = sourceProspects.splice(source.index, 1);
    
    // Insert the prospect in the destination column
    destProspects.splice(destination.index, 0, movedProspect);
    
    // Update the columns
    newColumns[sourceColumnIndex].prospects = sourceProspects;
    if (sourceColumnIndex !== destColumnIndex) {
      newColumns[destColumnIndex].prospects = destProspects;
    }
    
    // Update state immediately
    setColumns(newColumns);
    
    // Update the deal stage in Supabase
    const prospectId = movedProspect.id;
    const newDealStageId = destColumn.id;
    
    try {
      await updateProspectDealStage(prospectId, newDealStageId);
      toast.success(`Updated status for ${movedProspect.first_name} ${movedProspect.last_name}`);
    } catch (error) {
      toast.error('Failed to update prospect status');
      console.error('Error updating deal stage:', error);
    }
  };

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Sorry – there was a problem loading prospect data.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#10121F]">
      <div className="pb-4">
        <h1 className="text-4xl font-bold mb-8 text-white">Status of Prospects</h1>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-white">Prospect Status Board</h2>
          
          {isLoading ? (
            <div className="p-8 text-center text-white/60">Loading prospect data...</div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                  {columns.map(column => (
                    <div key={column.id} className="min-w-[320px] max-w-[320px]">
                      <div className="rounded-md border border-white/10 bg-[#13162A] overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-white font-semibold">{column.title}</span>
                            <span className="ml-2 bg-white/20 text-white text-xs rounded-full px-2 py-0.5">
                              {column.prospects.length}
                            </span>
                          </div>
                          <button className="p-1 rounded-md hover:bg-white/10 text-white">
                            <Plus size={18} />
                          </button>
                        </div>
                        
                        <Droppable droppableId={column.id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`flex-1 overflow-y-auto p-2 transition-colors duration-200 ${
                                snapshot.isDraggingOver ? 'bg-white/5' : ''
                              }`}
                            >
                              {column.prospects.map((prospect, index) => (
                                <Draggable 
                                  key={prospect.dragId} 
                                  draggableId={prospect.dragId as string} 
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`mb-2 p-4 rounded-md border ${
                                        snapshot.isDragging ? 'border-blue-500 bg-[#202442]' : 'border-white/10 bg-[#1a1e38]'
                                      } hover:bg-[#202442] transition-colors duration-200`}
                                    >
                                      <div className="cursor-move">
                                        <div className="text-white font-medium">
                                          {prospect.first_name} {prospect.last_name}
                                        </div>
                                        <div className="text-xs text-white/60 mt-1">
                                          {prospect.company || 'No company'}
                                        </div>
                                        <div className="mt-3 flex justify-between items-center">
                                          <div className="bg-white/10 rounded-md px-2 py-1 text-xs text-white/70">
                                            {prospect.daysSinceLastContact !== null && prospect.daysSinceLastContact !== undefined
                                              ? `${prospect.daysSinceLastContact} days ago`
                                              : 'New lead'}
                                          </div>
                                          <StatusDot daysSinceLastContact={prospect.daysSinceLastContact} />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              
                              {column.prospects.length === 0 && (
                                <div className="flex items-center justify-center h-16 border border-dashed border-white/10 rounded-md text-white/30 text-sm">
                                  Drop prospect here
                                </div>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  ))}
                </div>
              </DragDropContext>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Status indicator dot component
const StatusDot = ({ daysSinceLastContact }: { daysSinceLastContact?: number | null }) => {
  if (daysSinceLastContact === null || daysSinceLastContact === undefined) {
    return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
  }
  
  if (daysSinceLastContact <= 2) {
    return <div className="w-3 h-3 rounded-full bg-green-500"></div>;
  }
  
  if (daysSinceLastContact <= 5) {
    return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>;
  }
  
  if (daysSinceLastContact <= 10) {
    return <div className="w-3 h-3 rounded-full bg-orange-500"></div>;
  }
  
  return <div className="w-3 h-3 rounded-full bg-red-500"></div>;
};

export default StatusOfProspect;
