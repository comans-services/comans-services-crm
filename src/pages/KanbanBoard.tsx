
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal } from 'lucide-react';

// Define client card types
interface ClientCard {
  id: string;
  name: string;
  company: string;
  industry: string;
  clientId: string;
}

// Define column types
interface Column {
  id: string;
  title: string;
  cards: ClientCard[];
}

// Sample initial data
const initialColumns: Column[] = [
  {
    id: 'opportunity',
    title: 'OPPORTUNITY',
    cards: [
      { id: '1', name: 'Essential', company: 'Food Manufacturing', industry: 'Food', clientId: 'COM-6' },
      { id: '2', name: 'Premier Fresh Australia', company: 'Food Manufacturing', industry: 'Food', clientId: 'COM-9' },
      { id: '3', name: 'Scalzo Foods', company: 'Food Manufacturing', industry: 'Food', clientId: 'COM-12' }
    ]
  },
  {
    id: 'validated-opportunity',
    title: 'VALIDATED OPPORTUNITY',
    cards: [
      { id: '4', name: 'Jemena', company: 'Energy', industry: 'Energy', clientId: 'COM-54' },
      { id: '5', name: 'Alkira', company: 'Tech Solutions', industry: 'Technology', clientId: 'COM-133' }
    ]
  },
  {
    id: 'meeting-booked',
    title: 'MEETING BOOKED',
    cards: [
      { id: '6', name: 'Zinfra', company: 'Energy', industry: 'Energy', clientId: 'COM-3' },
      { id: '7', name: 'Brownes Dairy', company: 'Food manufacturing', industry: 'Food', clientId: 'COM-53' }
    ]
  },
  {
    id: 'quote-requested',
    title: 'QUOTE REQUESTED',
    cards: []
  },
  {
    id: 'quote-sent',
    title: 'QUOTE SENT',
    cards: []
  },
  {
    id: 'current-account',
    title: 'CURRENT ACCOUNT',
    cards: [
      { id: '8', name: 'Saputo', company: 'Food Manufacturing', industry: 'Food', clientId: 'COM-1' },
      { id: '9', name: 'Vanessa New Company', company: 'Consulting', industry: 'Business', clientId: 'COM-63' },
      { id: '10', name: 'Bryce New Company', company: 'Tech', industry: 'Technology', clientId: 'COM-71' },
      { id: '11', name: 'Naz Care', company: 'Non Profit', industry: 'Health', clientId: 'COM-67' },
      { id: '12', name: 'Southerly Ten', company: 'Energy', industry: 'Energy', clientId: 'COM-55' }
    ]
  },
  {
    id: 'launch-account',
    title: 'LAUNCH ACCOUNT',
    cards: []
  },
  {
    id: 'won-work',
    title: 'WON WORK',
    cards: []
  },
  {
    id: 'lost-work',
    title: 'LOST WORK',
    cards: []
  }
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  
  // Handle drag end
  const handleDragEnd = (result: any) => {
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
    
    setColumns(newColumns);
  };
  
  // Enhanced function to get draggable styles for improved visual feedback
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // Always maintain visibility
    opacity: 1,
    visibility: 'visible',
    
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
                          <Draggable key={card.id} draggableId={card.id} index={index}>
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
                                {/* Remove pointer-events-none to ensure card stays interactive */}
                                <div className="cursor-move">
                                  <div className="text-sm font-medium">{card.name}</div>
                                  <div className="text-xs text-white/60 mt-1">{card.company}</div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="bg-white/10 text-xs rounded px-2 py-0.5">
                                      {card.clientId}
                                    </div>
                                    <div className="text-white/40 text-xs">{card.industry}</div>
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
