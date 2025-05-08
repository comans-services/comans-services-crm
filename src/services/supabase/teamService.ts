
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches all team members (app_users)
 */
export const getTeamMembers = async () => {
  const { data, error } = await supabase
    .from('app_user')
    .select('*')
    .order('last_active', { ascending: false });
  
  if (error) {
    console.error('Error fetching team members:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Creates a new team member
 */
export const createTeamMember = async (member: {
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'salesperson';
}) => {
  // Convert role to lowercase to match the database enum type
  const { data, error } = await supabase
    .from('app_user')
    .insert({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      role: member.role.toLowerCase() as 'admin' | 'salesperson'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating team member:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates an existing team member
 */
export const updateTeamMember = async (id: string, member: {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: 'admin' | 'salesperson';
}) => {
  // Convert role to lowercase if present
  const updateData = {
    ...member,
    role: member.role ? member.role.toLowerCase() as 'admin' | 'salesperson' : undefined
  };

  const { data, error } = await supabase
    .from('app_user')
    .update(updateData)
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
 * Deletes a team member
 */
export const deleteTeamMember = async (id: string) => {
  const { error } = await supabase
    .from('app_user')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting team member:', error);
    throw new Error(error.message);
  }
};
