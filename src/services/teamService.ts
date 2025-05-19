
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types/serviceTypes';

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

/**
 * Gets user profile by auth user ID
 */
export const getUserProfile = async (userId: string): Promise<TeamMember | null> => {
  const { data, error } = await supabase
    .from('app_user')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // Not found error
    console.error('Error fetching user profile:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates or creates a user profile
 */
export const updateUserProfile = async (userId: string, profile: {
  first_name: string;
  last_name: string;
  role: 'admin' | 'salesperson';
}): Promise<TeamMember> => {
  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('app_user')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (existingProfile) {
    // Update existing profile
    const { data, error } = await supabase
      .from('app_user')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw new Error(error.message);
    }
    
    return data;
  } else {
    // Create new profile
    const { data, error } = await supabase
      .from('app_user')
      .insert({
        id: userId,
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.role,
        email: '', // This will be filled from auth.users if needed
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      throw new Error(error.message);
    }
    
    return data;
  }
};
