
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchProspects, fetchDealStages, updateProspectDealStage } from '@/services/supabaseService';

// Define client card types
interface ClientCard {
  id: string;
  name: string;
  company: string | null;
  email: string;
  dragId: string;
  deal_stage_id: string | null;
}

// Define column types
interface Column {
  id: string;
  title: string;
  cards: ClientCard[];
}

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  
  // Fetch prospects and deal stages
  const { 
    data: prospects = [], 
    isLoading: isLoadingProspects
  } = useQuery({
    queryKey: ['prospects'],
    queryFn: fetchProspects
  });
  
  const { 
    data: dealStages = [], 
    isLoading: isLoadingDealStages
  } = useQuery({
    queryKey: ['dealStages'],
    queryFn: fetchDealStages
  });
  
  const isLoading = isLoadingProspects || isLoadingDealStages;
  
  // Build the board columns from deal stages and prospects
  useEffect(() => {
    if (!dealStages.length) return;
    
    // Create columns for each deal stage
    const stageColumns = dealStages.map(stage => ({
      id: stage.id,
      title: stage.name.toUpperCase(),
      cards: []
    }));
    
    // Distribute prospects into columns based on their deal stage
    if (prospects.length && stageColumns.length) {
      prospects.forEach(prospect => {
        // Find which column this prospect belongs to
        const stageId = prospect.deal_stage_id || dealStages[0]?.id;
        const column = stageColumns.find(col => col.id === stageId);
        
        if (column) {
          // Add prospect to appropriate column
          column.cards.push({
            id: prospect.id,
            name: `${prospect.first_name} ${prospect.last_name}`,
            company: prospect.company,
            email: prospect.email,
            dragId: `drag-${prospect.id}`,
            deal_stage_id: prospect.deal_stage_id
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
    const sourceCards = [...sourceColumn.cards];
    const destCards = sourceColumn === destColumn ? sourceCards : [...destColumn.cards];
    
    // Remove the card from the source column
    const [movedCard] = sourceCards.splice(source.index, 1);
    
    // Insert the card in the destination column
    destCards.splice(destination.index, 0, movedCard);
    
    // Create the new columns array
    const newColumns = columns.map(column => {
      if (column.id === source.droppableId) {
        return { ...column, cards: sourceCards };
      }
      if (column.id === destination.droppableId) {
        return { ...column, cards: destCards };
      }
      return column;
    });
    
    // Update UI immediately
    setColumns(newColumns);
    
    // Update the deal stage in Supabase
    const prospectId = movedCard.id;
    const newDealStageId = destColumn.id;
    
    try {
      await updateProspectDealStage(prospectId, newDealStageId);
      toast.success(`Updated status for ${movedCard.name}`);
    } catch (error) {
      toast.error('Failed to update prospect status');
      console.error('Error updating deal stage:', error);
    }
  };
  
  // Improved function to get draggable styles
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: 'none' as const,
    opacity: 1,
    margin: '0 0 8px 0',
    background: isDragging ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.05)',
    borderColor: isDragging ? 'rgb(59, 130, 246)' : 'rgba(255, 255, 255, 0.1)',
    boxShadow: isDragging ? '0 10px 15px rgba(0, 0, 0, 0.4)' : 'none',
    transform: 'translate(0, 0)',
    ...draggableStyle,
    ...(isDragging && draggableStyle && draggableStyle.transform
      ? {
          transform: draggableStyle.transform.replace(/scale\([^)]+\)/g, ''),
          transformOrigin: 'top left'
        }
      : {})
  });
  
  if (isLoading) {
    return <div className="py-4 flex items-center justify-center h-64">Loading pipeline data...</div>;
  }
  
  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Client Pipeline</h1>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
            {columns.map(column => (
              <div key={column.id} className="min-w-[300px] max-w-[300px]">
                <div className="card p-0 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-white font-semibold">{column.title}</span>
                      <span className="ml-2 bg-white/20 text-white text-xs rounded-full px-2 py-0.5">
                        {column.cards.length}
                      </span>
                    </div>
                    <div className="flex">
                      <button className="p-1 rounded hover:bg-white/10">
                        <Plus size={16} />
                      </button>
                      <button className="p-1 rounded hover:bg-white/10 ml-1">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto p-2 transition-colors duration-200 ${
                          snapshot.isDraggingOver 
                            ? 'bg-white/10 border border-blue-400/50' 
                            : ''
                        }`}
                      >
                        {column.cards.map((card, index) => (
                          <Draggable 
                            key={card.dragId} 
                            draggableId={card.dragId} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                                className="mb-2 p-3 rounded-md border border-white/10 transition-all"
                              >
                                <div className="cursor-move">
                                  <div className="text-sm font-medium">{card.name}</div>
                                  <div className="text-xs text-white/60 mt-1">{card.company || 'No company'}</div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="bg-white/10 text-xs rounded px-2 py-0.5">
                                      {card.email.split('@')[1]}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {column.cards.length === 0 && (
                          <div className={`flex items-center justify-center h-16 border border-dashed ${
                            snapshot.isDraggingOver ? 'border-blue-400/50 bg-blue-400/10' : 'border-white/10'
                          } rounded-md transition-colors duration-200`}>
                            <button className="text-xs text-white/50 hover:text-white/80 flex items-center">
                              <Plus size={14} className="mr-1" />
                              Create
                            </button>
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
    </div>
  );
};

export default KanbanBoard;
