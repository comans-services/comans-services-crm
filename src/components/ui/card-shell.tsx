
import React from 'react';

interface CardShellProps {
  children: React.ReactNode;
  isDragging: boolean;
  draggableStyle?: any;
}

const CardShell: React.FC<CardShellProps> = ({ 
  children, 
  isDragging, 
  draggableStyle 
}) => {
  // Base styles for all cards
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // Base styles
    userSelect: 'none' as const,
    padding: 0,
    margin: '0 0 8px 0',
    
    // Visual feedback when dragging
    background: isDragging ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.05)',
    borderColor: isDragging ? 'rgb(59, 130, 246)' : 'rgba(255, 255, 255, 0.1)',
    boxShadow: isDragging ? '0 10px 15px rgba(0, 0, 0, 0.4)' : 'none',
    
    // Critical alignment fixes for cursor
    ...(isDragging ? {
      // Remove any margin or padding that could cause offset
      pointerEvents: 'none',
      // Set position to fixed to avoid any offset from parent containers
      position: 'fixed',
      // Top and left are controlled by the library, we need to ensure no additional offset
      zIndex: 9999,
      // Force full opacity and visibility
      opacity: 1,
      visibility: 'visible',
      // Remove any transform scale that might cause misalignment
      transform: draggableStyle?.transform 
        ? draggableStyle.transform.replace(/scale\([^)]+\)/g, '') 
        : 'translate(0px, 0px)',
      // Set transform origin to top left corner for precise positioning
      transformOrigin: 'top left',
      // Remove any transition that could make the card lag behind cursor
      transition: 'none',
      // Width from draggable style
      width: draggableStyle?.width || 'auto',
      // Use grabbing cursor 
      cursor: 'grabbing',
    } : {}),
    
    // Apply draggable styles provided by the library
    ...draggableStyle,
  });

  return (
    <div
      style={getItemStyle(isDragging, draggableStyle)}
      className={`mb-2 p-3 rounded-md border transition-all ${
        isDragging 
          ? 'border-blue-500'
          : 'border-white/10'
      }`}
    >
      {children}
    </div>
  );
};

export default CardShell;
