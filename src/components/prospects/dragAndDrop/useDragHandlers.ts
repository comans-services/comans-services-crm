
import { useState, useCallback } from 'react';
import { 
  draggable, 
  dropTargetForElements 
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { 
  DragState,
  Column,
  BoardDragPayload 
} from './types';

/**
 * Custom hook for drag-and-drop functionality
 * 
 * @remarks
 * This hook replaces the onDragEnd functionality from react-beautiful-dnd.
 * Unlike react-beautiful-dnd which uses component wrappers, Pragmatic DnD
 * uses a more direct event-based approach that's significantly smaller (~4.7 kB)
 * and more flexible in terms of customisation.
 */
export function useDragHandlers<T>({
  columns,
  setColumns,
  onColumnUpdate,
}: {
  columns: Column<T>[];
  setColumns: React.Dispatch<React.SetStateAction<Column<T>[]>>;
  onColumnUpdate?: (columns: Column<T>[]) => void;
}) {
  const [dragState, setDragState] = useState<DragState<T>>({
    activeId: null,
    activeData: null,
    sourceColumn: null,
    sourceIndex: null,
    destinationColumn: null,
    destinationIndex: null,
  });

  /**
   * Makes an element draggable and sets up drag start handlers
   */
  const makeDraggable = useCallback((
    element: HTMLElement,
    itemId: string,
    columnId: string,
    index: number,
    itemData: T
  ) => {
    return draggable({
      element,
      dragHandle: element,
      getInitialData: () => {
        const payload: BoardDragPayload<T> = {
          itemId,
          itemData,
          columnId,
          index,
        };
        return payload;
      },
      onDragStart: () => {
        setDragState({
          activeId: itemId,
          activeData: itemData,
          sourceColumn: columnId,
          sourceIndex: index,
          destinationColumn: columnId, // Initially same as source
          destinationIndex: index, // Initially same as source
        });
      },
    });
  }, []);

  /**
   * Makes an element a drop target
   */
  const makeDroppable = useCallback((
    element: HTMLElement,
    columnId: string,
  ) => {
    return dropTargetForElements({
      element,
      getIsSticky: () => true,
      onDragEnter: ({ source }) => {
        // Type-safety: Cast to unknown first
        const payload = source.data as unknown as BoardDragPayload<T>;
        
        // Only handle our board items
        if (!payload.itemId || !payload.columnId) {
          return;
        }
      },
      onDragLeave: () => {
        // Reset destination when dragging outside a column
        setDragState(prev => ({
          ...prev,
          destinationColumn: prev.sourceColumn,
          destinationIndex: prev.sourceIndex,
        }));
      },
      onDrop: async ({ source }) => {
        // Type-safety: Cast to unknown first
        const payload = source.data as unknown as BoardDragPayload<T>;
        
        // Only handle our board items
        if (!payload.itemId || !payload.columnId) {
          return;
        }

        // If we have valid source and destination
        if (
          dragState.sourceColumn !== null &&
          dragState.sourceIndex !== null &&
          dragState.destinationColumn !== null &&
          dragState.destinationIndex !== null
        ) {
          // Clone the columns array to avoid direct state mutation
          const newColumns = [...columns];

          // Find the source and destination columns
          const sourceColumnIndex = newColumns.findIndex(col => col.id === dragState.sourceColumn);
          const destColumnIndex = newColumns.findIndex(col => col.id === dragState.destinationColumn);
          
          if (sourceColumnIndex !== -1 && destColumnIndex !== -1) {
            // Remove item from source
            const [movedItem] = newColumns[sourceColumnIndex].items.splice(dragState.sourceIndex, 1);
            
            // Add item to destination
            newColumns[destColumnIndex].items.splice(dragState.destinationIndex, 0, movedItem);
            
            // Update state
            setColumns(newColumns);
            
            // Call the callback if provided
            if (onColumnUpdate) {
              onColumnUpdate(newColumns);
            }
          }
        }

        // Reset drag state
        setDragState({
          activeId: null,
          activeData: null,
          sourceColumn: null,
          sourceIndex: null,
          destinationColumn: null,
          destinationIndex: null,
        });
      },
    });
  }, [columns, dragState, onColumnUpdate, setColumns]);

  /**
   * Updates the destination position during dragging
   */
  const updateDestination = useCallback((columnId: string, index: number) => {
    setDragState(prev => ({
      ...prev,
      destinationColumn: columnId,
      destinationIndex: index,
    }));
  }, []);

  return {
    dragState,
    makeDraggable,
    makeDroppable,
    updateDestination,
  };
}

export default useDragHandlers;
