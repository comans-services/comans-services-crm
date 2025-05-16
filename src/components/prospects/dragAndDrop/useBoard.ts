
import { useState, useCallback, useEffect, useRef } from 'react';
import { UseBoardProps, UseBoardResult, Column, DragState } from './types';

/**
 * Custom hook that provides the core drag-and-drop functionality for a board
 * 
 * @remarks
 * This hook integrates with the Pragmatic DnD library and provides
 * a simpler interface for the board components to use.
 */
export function useBoard<T>({
  initialColumns,
  onColumnUpdate,
}: UseBoardProps<T>): UseBoardResult<T> {
  const [columns, setColumns] = useState<Column<T>[]>(initialColumns);
  const [dragState, setDragState] = useState<DragState<T>>({
    activeId: null,
    activeData: null,
    sourceColumn: null,
    sourceIndex: null,
    destinationColumn: null,
    destinationIndex: null,
  });
  
  // Mouse position tracking for drag overlay
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  
  // Track if we need to animate a card back to its original position
  const animateBackRef = useRef<boolean>(false);
  
  // Handle mouse movement to update the overlay position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (dragState.activeId) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dragState.activeId]);
  
  // Callbacks for drag events
  const onDragStart = useCallback((itemId: string, columnId: string, index: number, data: T) => {
    setDragState({
      activeId: itemId,
      activeData: data,
      sourceColumn: columnId,
      sourceIndex: index,
      destinationColumn: columnId, // Initially same as source
      destinationIndex: index, // Initially same as source
    });
  }, []);
  
  const onDragUpdate = useCallback((destinationColumnId: string | null, destinationIndex: number | null) => {
    setDragState(prev => ({
      ...prev,
      destinationColumn: destinationColumnId,
      destinationIndex: destinationIndex !== null ? destinationIndex : prev.destinationIndex,
    }));
  }, []);
  
  const onDragEnd = useCallback(async () => {
    // Check if we have a valid destination
    if (
      dragState.sourceColumn !== null &&
      dragState.sourceIndex !== null && 
      dragState.destinationColumn !== null &&
      dragState.destinationIndex !== null
    ) {
      // Check if it's valid or we need to animate back
      const shouldAnimate = dragState.destinationColumn === null;
      
      if (shouldAnimate) {
        animateBackRef.current = true;
        // Will animate back to origin in the component
      } else {
        // Clone the columns array
        const newColumns = [...columns];
        
        // Find source and destination columns
        const sourceColumnIndex = newColumns.findIndex(col => col.id === dragState.sourceColumn);
        const destColumnIndex = newColumns.findIndex(col => col.id === dragState.destinationColumn);
        
        if (sourceColumnIndex !== -1 && destColumnIndex !== -1) {
          // Remove the item from its original position
          const [movedItem] = newColumns[sourceColumnIndex].items.splice(dragState.sourceIndex, 1);
          
          // Insert it in the new position
          newColumns[destColumnIndex].items.splice(dragState.destinationIndex, 0, movedItem);
          
          // Update the state
          setColumns(newColumns);
          
          // Call the callback if provided
          if (onColumnUpdate) {
            onColumnUpdate(newColumns);
          }
        }
      }
    }
    
    // Reset drag state after a short delay to allow animations to complete
    await new Promise(resolve => setTimeout(resolve, 150));
    
    setDragState({
      activeId: null,
      activeData: null,
      sourceColumn: null,
      sourceIndex: null, 
      destinationColumn: null,
      destinationIndex: null,
    });
    
    animateBackRef.current = false;
  }, [columns, dragState, onColumnUpdate]);
  
  return {
    columns,
    dragState,
    handlers: {
      onDragStart,
      onDragUpdate,
      onDragEnd,
    },
  };
}

export default useBoard;
