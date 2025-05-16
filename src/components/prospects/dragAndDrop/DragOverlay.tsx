
import React from 'react';
import { createPortal } from 'react-dom';

interface DragOverlayProps<T> {
  isActive: boolean;
  item: T | null;
  clientOffset: { x: number; y: number } | null;
  children: (props: { item: T }) => React.ReactNode;
}

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 1000,
  transform: 'translate(-50%, -50%) scale(1.04)', // 4px scale up
  transition: 'transform 150ms ease-in-out',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  borderRadius: '8px',
  opacity: 1,
};

/**
 * Renders a drag overlay (ghost element) when an item is being dragged
 * 
 * @remarks
 * Unlike react-beautiful-dnd which provides its own drag preview,
 * Pragmatic DnD requires us to create our own overlay component.
 * This gives us more control over the appearance and behaviour.
 */
export function DragOverlay<T>({
  isActive,
  item,
  clientOffset,
  children,
}: DragOverlayProps<T>): React.ReactElement | null {
  // Do not render anything if no item is being dragged
  if (!isActive || !item || !clientOffset) {
    return null;
  }

  // Position the overlay at the cursor position
  const style: React.CSSProperties = {
    ...overlayStyles,
    left: clientOffset.x,
    top: clientOffset.y,
  };

  // Create a portal to render the overlay at the document root
  return createPortal(
    <div style={style}>
      {children({ item })}
    </div>,
    document.body
  );
}

export default DragOverlay;
