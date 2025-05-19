
import { useRef, useEffect } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { BoardDragPayload } from '../types';

/**
 * Hook to make an element draggable with the pragmatic drag-and-drop library
 * 
 * @remarks
 * Unlike react-beautiful-dnd's Draggable component, Pragmatic DnD uses refs and
 * direct DOM manipulation, which is more performant and allows for more flexibility.
 */
export function useDragItem<T>({
  id,
  index,
  columnId,
  data,
  onDragStart,
}: {
  id: string;
  index: number;
  columnId: string;
  data: T;
  onDragStart: (id: string, columnId: string, index: number, data: T) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const cleanup = draggable({
      element,
      getInitialData: () => {
        const payload: BoardDragPayload<T> = {
          itemId: id,
          itemData: data,
          columnId,
          index,
        };
        return payload;
      },
      onDragStart: () => {
        onDragStart(id, columnId, index, data);
      },
    });
    
    return cleanup;
  }, [id, columnId, index, data, onDragStart]);
  
  return ref;
}

export default useDragItem;
