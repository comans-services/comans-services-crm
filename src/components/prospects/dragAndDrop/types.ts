
import { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/element/types';

// Generic interface for our draggable item
export interface DraggableItem<T> {
  id: string;
  data: T;
}

// Column interface
export interface Column<T> {
  id: string;
  title: string;
  items: DraggableItem<T>[];
}

// Interface for drag state
export interface DragState<T> {
  activeId: string | null;
  activeData: T | null;
  sourceColumn: string | null;
  sourceIndex: number | null;
  destinationColumn: string | null;
  destinationIndex: number | null;
}

// Custom drag payload for our board
export interface BoardDragPayload<T> extends ElementDragPayload {
  itemId: string;
  itemData: T;
  columnId: string;
  index: number;
}

// Props for useBoard hook
export interface UseBoardProps<T> {
  initialColumns: Column<T>[];
  onColumnUpdate?: (columns: Column<T>[]) => void;
}

// Result of useBoard hook
export interface UseBoardResult<T> {
  columns: Column<T>[];
  dragState: DragState<T>;
  handlers: {
    onDragStart: (itemId: string, columnId: string, index: number, data: T) => void;
    onDragUpdate: (destinationColumnId: string | null, destinationIndex: number | null) => void;
    onDragEnd: () => Promise<void>;
  };
}
