
import { useRef, useEffect, useCallback } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { BoardDragPayload } from '../types';

/**
 * Hook to make an element a drop target for a column
 * 
 * @remarks
 * This hook replaces the Droppable component from react-beautiful-dnd.
 * It's much more flexible in how drop targets are defined and handled.
 */
export function useDropColumn<T>({
  columnId,
  onDragUpdate,
}: {
  columnId: string;
  onDragUpdate: (columnId: string, index: number | null) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  
  const calculateDropIndex = useCallback((element: HTMLElement, y: number): number => {
    const rect = element.getBoundingClientRect();
    const localY = y - rect.top;
    
    // Get all draggable children
    const children = Array.from(element.querySelectorAll('[data-draggable="true"]'));
    
    // If no children, drop at index 0
    if (children.length === 0) {
      return 0;
    }
    
    // Measure children positions
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childRect = child.getBoundingClientRect();
      const childMiddle = childRect.top + childRect.height / 2;
      
      if (y < childMiddle) {
        return i;
      }
    }
    
    // If we got here, we're past all children
    return children.length;
  }, []);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const cleanup = dropTargetForElements({
      element,
      getIsSticky: () => true,
      onDragEnter: ({ source, location }) => {
        // Cast to unknown first, then to our payload type
        const payload = source.data as unknown as BoardDragPayload<T>;
        
        // Only handle our board items
        if (!payload.itemId || !payload.columnId) {
          return;
        }
        
        const index = calculateDropIndex(element, location.current.y);
        onDragUpdate(columnId, index);
      },
      onDrag: ({ source, location }) => {
        // Cast to unknown first, then to our payload type
        const payload = source.data as unknown as BoardDragPayload<T>;
        
        // Only handle our board items
        if (!payload.itemId || !payload.columnId) {
          return;
        }
        
        const index = calculateDropIndex(element, location.current.y);
        onDragUpdate(columnId, index);
      },
    });
    
    return cleanup;
  }, [columnId, onDragUpdate, calculateDropIndex]);
  
  return ref;
}

export default useDropColumn;
