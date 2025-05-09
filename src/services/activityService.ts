
import { supabase } from '@/integrations/supabase/client';
import { UserActivity, ActionItem } from './types/serviceTypes';

/**
 * Gets user activity logs
 */
export const getUserActivity = async (limit = 10): Promise<any[]> => {
  const { data, error } = await supabase
    .from('user_activity')
    .select('*, app_user!user_activity_user_id_fkey(*)')
    .order('occurred_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching user activity:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Records a user activity
 */
export const recordUserActivity = async (activity: {
  user_id: string;
  activity_type: string;
  activity_detail?: any;
}): Promise<UserActivity> => {
  const { data, error } = await supabase
    .from('user_activity')
    .insert(activity)
    .select()
    .single();
  
  if (error) {
    console.error('Error recording user activity:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Helper function to extract action items from document
 */
export function extractActionItemsFromDocument(documentText: string): Promise<ActionItem[]> {
  // This is a mock implementation that simulates AI extraction
  return new Promise((resolve) => {
    const currentDate = new Date();
    const twoWeeksFromNow = new Date(currentDate);
    twoWeeksFromNow.setDate(currentDate.getDate() + 14);
    
    resolve([
      {
        id: `ai-${Date.now()}-1`,
        title: 'Follow up on pricing discussion',
        description: 'Discuss the updated pricing structure based on the client\'s requirements',
        priority: 'high',
        dueDate: new Date(currentDate.setDate(currentDate.getDate() + 2)).toISOString(),
        createdAt: new Date().toISOString(),
        completed: false
      },
      {
        id: `ai-${Date.now()}-2`,
        title: 'Send product specifications',
        description: 'Share detailed specifications for the enterprise plan',
        priority: 'medium',
        dueDate: new Date(currentDate.setDate(currentDate.getDate() + 5)).toISOString(),
        createdAt: new Date().toISOString(),
        completed: false
      },
      {
        id: `ai-${Date.now()}-3`,
        title: 'Schedule technical demo',
        description: 'Arrange a technical demonstration with the IT department',
        priority: 'low',
        dueDate: twoWeeksFromNow.toISOString(),
        createdAt: new Date().toISOString(),
        completed: false
      }
    ]);
  });
}
