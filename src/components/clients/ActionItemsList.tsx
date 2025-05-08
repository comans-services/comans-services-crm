
import React from 'react';
import { ActionItem } from '@/services/supabaseService';
import { format, parseISO } from 'date-fns';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ActionItemsListProps {
  items: ActionItem[];
}

const ActionItemsList: React.FC<ActionItemsListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-white/70">
        <p>No action items found. Upload a document to extract action items.</p>
      </div>
    );
  }
  
  // Sort by priority (high to low) and then by due date (closest first)
  const sortedItems = [...items].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'low':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-4">
      {sortedItems.map((item) => (
        <div 
          key={item.id} 
          className="border border-white/10 rounded-md p-4 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-white">{item.title}</h4>
            <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs ${getPriorityBadgeClass(item.priority)}`}>
              {getPriorityIcon(item.priority)}
              <span className="capitalize">{item.priority}</span>
            </div>
          </div>
          
          <p className="text-sm text-white/70 mb-3">{item.description}</p>
          
          <div className="flex items-center justify-between text-xs">
            <div className="text-white/50">
              Due: {format(parseISO(item.dueDate), 'MMM d, yyyy')}
            </div>
            <div className="text-white/50">
              Created: {format(parseISO(item.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionItemsList;
