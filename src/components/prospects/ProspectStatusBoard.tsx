
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ProspectWithEngagement } from '@/services/mockDataService';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { getRecommendedAction } from '@/utils/clientUtils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  
  // For demonstration, distribute prospects among statuses based on some logic
  const distributeProspects = (prospects: ProspectWithEngagement[]): StatusColumn[] => {
    const columns = [...initialColumns];
    
    prospects.forEach(prospect => {
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
  React.useEffect(() => {
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
  
  // Enhanced item style function with better drag preview
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // basic styles to make the items look nice
    userSelect: 'none' as const,
    margin: '0 0 8px 0',
    
    // Enhanced drag effect - more prominent visual cue during dragging
    background: isDragging ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.05)',
    borderColor: isDragging ? 'rgb(59, 130, 246)' : 'rgba(255, 255, 255, 0.1)',
    
    // Enhanced shadow effect for lifting
    boxShadow: isDragging 
      ? '0 10px 15px rgba(0, 0, 0, 0.4), 0 0 0 2px rgb(59, 130, 246)' 
      : 'none',
    
    // Scale up slightly when dragging to enhance visibility
    transform: isDragging ? 'scale(1.02)' : 'none',
    zIndex: isDragging ? 9999 : 1,
    
    // Enhanced transition for smooth animation
    transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
    
    // styles we need to apply on draggables
    ...draggableStyle,
  });
  
  return (
    <div className="overflow-x-auto pb-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {columns.map(column => (
            <div key={column.id} className="min-w-[280px] max-w-[280px]">
              <div className="card p-0 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-white font-semibold">{column.title}</span>
                    <span className="ml-2 bg-white/20 text-white text-xs rounded-full px-2 py-0.5">
                      {column.prospects.length}
                    </span>
                  </div>
                  {column.id === 'new-lead' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-1 rounded hover:bg-white/10"
                      onClick={onCreateLead}
                    >
                      <Plus size={16} />
                    </Button>
                  )}
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-2 transition-colors duration-200 ${
                        snapshot.isDraggingOver 
                          ? 'bg-white/10 border border-blue-400/50' 
                          : ''
                      }`}
                    >
                      {column.prospects.map((prospect, index) => (
                        <Draggable 
                          key={prospect.id} 
                          draggableId={prospect.id} 
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
                              className={`mb-2 p-3 rounded-md border border-white/10 transition-all`}
                            >
                              <div className={`cursor-move ${snapshot.isDragging ? 'pointer-events-none' : ''}`}>
                                <div className="text-sm font-medium">
                                  {prospect.first_name} {prospect.last_name}
                                </div>
                                <div className="text-xs text-white/60 mt-1">
                                  {prospect.company}
                                </div>
                                <div className="mt-2 flex justify-between items-center text-xs">
                                  <div className="bg-white/10 rounded px-2 py-0.5">
                                    {prospect.daysSinceLastContact !== null 
                                      ? `${prospect.daysSinceLastContact} days ago` 
                                      : 'New lead'}
                                  </div>
                                  <div className={`w-2 h-2 rounded-full bg-${prospect.statusColor}`}></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {column.prospects.length === 0 && column.id !== 'new-lead' && (
                        <div className={`flex items-center justify-center h-16 border border-dashed ${
                          snapshot.isDraggingOver ? 'border-blue-400/50 bg-blue-400/10' : 'border-white/10'
                        } rounded-md transition-colors duration-200`}>
                          <span className="text-xs text-white/50">
                            Drop prospect here
                          </span>
                        </div>
                      )}
                      
                      {column.prospects.length === 0 && column.id === 'new-lead' && (
                        <div className="flex items-center justify-center h-16 border border-dashed border-white/10 rounded-md">
                          <button 
                            className="text-xs text-white/50 hover:text-white/80 flex items-center"
                            onClick={onCreateLead}
                          >
                            <Plus size={14} className="mr-1" />
                            Create New Lead
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
  );
};

export default ProspectStatusBoard;
