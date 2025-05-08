
import { supabase } from '@/integrations/supabase/client';

/**
 * Records user activity
 */
export const recordUserActivity = async (userId: string, activityType: string, activityDetail?: any) => {
  const { error } = await supabase
    .from('user_activity')
    .insert({
      user_id: userId,
      activity_type: activityType,
      activity_detail: activityDetail
    });

  if (error) {
    console.error('Error recording user activity:', error);
    throw new Error(error.message);
  }
};

/**
 * Fetches user activity
 */
export const getUserActivity = async (userId: string, limit: number = 10) => {
  const { data, error } = await supabase
    .from('user_activity')
    .select('*')
    .eq('user_id', userId)
    .order('occurred_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching user activity:', error);
    throw new Error(error.message);
  }

  return data || [];
};
