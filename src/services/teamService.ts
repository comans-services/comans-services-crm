
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types/serviceTypes';
import { getUserActivity } from './activityService';
import { setupRealTimeSubscription } from './base/supabaseBase';

/**
 * Fetches all team members (app_users)
 */
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('app_user')
    .select('*');
  
  if (error) {
    console.error('Error fetching team members:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Adds a new team member
 */
export const addTeamMember = async (member: {
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'salesperson';
}): Promise<TeamMember> => {
  const { data, error } = await supabase
    .from('app_user')
    .insert(member)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding team member:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates an existing team member
 */
export const updateTeamMember = async (id: string, updates: {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: 'admin' | 'salesperson';
}): Promise<TeamMember> => {
  const { data, error } = await supabase
    .from('app_user')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating team member:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Removes a team member
 */
export const removeTeamMember = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('app_user')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error removing team member:', error);
    throw new Error(error.message);
  }

  return true;
};

// Re-export the imported functions to maintain API compatibility
export { getUserActivity, setupRealTimeSubscription };
