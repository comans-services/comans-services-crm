
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuid } from 'uuid';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdAt: string;
  completed: boolean;
}

/**
 * Extracts action items from a document
 */
export const extractActionItemsFromDocument = async (documentName: string): Promise<ActionItem[]> => {
  // Simulate AI extraction by creating some sample action items
  const now = new Date();
  
  // Create due dates that are a few days in the future
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return [
    {
      id: uuid(),
      title: `Review ${documentName}`,
      description: `Review the full ${documentName} document and identify key areas for follow-up.`,
      priority: 'medium',
      dueDate: tomorrow.toISOString(),
      createdAt: now.toISOString(),
      completed: false
    },
    {
      id: uuid(),
      title: `Schedule follow-up meeting`,
      description: `Schedule a follow-up meeting to discuss the items in ${documentName}.`,
      priority: 'high',
      dueDate: nextWeek.toISOString(),
      createdAt: now.toISOString(),
      completed: false
    }
  ];
};
