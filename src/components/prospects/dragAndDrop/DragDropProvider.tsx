
import React, { ReactNode } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/adapter/preview';

interface DragDropProviderProps {
  children: ReactNode;
}

/**
 * Provider component that sets up drag-and-drop sensors and context
 * 
 * @remarks
 * Unlike react-beautiful-dnd which uses Droppable/Draggable wrappers,
 * the Pragmatic DnD uses event-based sensors that are framework-agnostic.
 * This means we can use the same drag-and-drop logic with any UI framework
 * (React, Vue, Svelte, etc.) making our code more future-proof.
 */
export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  React.useEffect(() => {
    // Set up the element monitor which adds event listeners to DOM elements
    const cleanup = combine(
      monitorForElements({
        canMonitor: () => true,
        onDragStart: (event) => {
          // Hide the default browser ghost image
          if (event.source.element) {
            setCustomNativeDragPreview({
              nativeEvent: event.nativeEvent,
              render: () => {
                // Creating an invisible element results in no ghost
                // We'll use our own DragOverlay component instead
                const el = document.createElement('div');
                el.style.opacity = '0';
                return el;
              },
            });
          }
        },
      }),
    );

    // Clean up event listeners when component unmounts
    return cleanup;
  }, []);

  return <>{children}</>;
};

export default DragDropProvider;
