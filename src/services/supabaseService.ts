
// src/services/supabaseService.ts
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/* ──────────────────────────────────────────────────────────────── */
/*  Types – every column you care about in each table              */
/* ──────────────────────────────────────────────────────────────── */

export interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  client_since: string | null;     // ISO date string
  persona_id: string | null;
  lead_source_id: string | null;
  deal_stage_id: string | null;
  created_at: string;
  updated_at: string;

  /* UI-only helpers (not in DB) */
  dragId?: string;
  daysSinceLastContact?: number | null;
  
  /* Nested relationship data */
  prospect_engagement?: {
    last_contact_date: string | null;
  }[];
}

export interface DealStage {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface Communication {
  id: string;
  subject_text: string;
  body_text: string | null;
  salesperson_email: string;
  prospect_id: string;
  date_of_communication: string;
  created_at: string;
  updated_at: string;
  prospect_profile?: {
    first_name: string;
    last_name: string;
    email: string; // Added email field to fix EmailCommunicationHistory errors
  };
}

export interface Task {
  id: string;
  task_description: string;
  task_type: string;
  priority: 'high' | 'medium' | 'low';
  due_date: string;
  completed: boolean;
  prospect_id: string;
  created_at: string;
  updated_at: string;
  prospect_profile?: {
    first_name: string;
    last_name: string;
  };
}

export interface AppUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'salesperson';
  last_active: string | null;
  created_at: string;
  updated_at: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Deal stages                                                    */
/* ──────────────────────────────────────────────────────────────── */

export const fetchDealStages = async (): Promise<DealStage[]> => {
  const { data, error } = await supabase
    .from('deal_stage')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('Error fetching deal stages:', error);
    toast.error('Failed to load deal stages');
    return [];
  }

  return data as DealStage[] ?? [];
};

/* ──────────────────────────────────────────────────────────────── */
/*  Prospects                                                      */
/* ──────────────────────────────────────────────────────────────── */

export const fetchProspects = async (): Promise<Prospect[]> => {
  console.log('Fetching prospects from Supabase...');
  const { data, error } = await supabase
    .from('prospect_profile')
    .select(`
      *,
      prospect_engagement(last_contact_date)
    `);

  if (error) {
    console.error('Error fetching prospects:', error);
    toast.error('Failed to load prospects');
    return [];
  }

  console.log('Raw prospects data from Supabase:', data);
  
  if (!data || data.length === 0) {
    console.log('No prospects found in the database');
    return [];
  }

  /* Add UI helpers */
  const processedData = (data ?? []).map((p: any) => {
    const lastContactDate =
      p.prospect_engagement?.[0]?.last_contact_date ?? null;

    const daysSinceLastContact =
      lastContactDate
        ? Math.ceil(
            (Date.now() - new Date(lastContactDate).getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : null;

    return {
      ...p,
      dragId: `drag-${p.id}`,
      daysSinceLastContact,
    };
  });
  
  console.log('Processed prospects data:', processedData);
  return processedData;
};

/* Get single prospect */
export const fetchProspectById = async (id: string): Promise<Prospect | null> => {
  const { data, error } = await supabase
    .from('prospect_profile')
    .select(`
      *,
      prospect_engagement(last_contact_date)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching prospect:', error);
    toast.error('Failed to load prospect details');
    return null;
  }

  if (!data) return null;

  const lastContactDate =
    data.prospect_engagement?.[0]?.last_contact_date ?? null;

  const daysSinceLastContact =
    lastContactDate
      ? Math.ceil(
          (Date.now() - new Date(lastContactDate).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

  return {
    ...data,
    dragId: `drag-${data.id}`,
    daysSinceLastContact,
  };
};

/* Get prospects by company */
export const getProspectsByCompany = async (): Promise<Record<string, Prospect[]>> => {
  console.log('Fetching prospects grouped by company...');
  const prospects = await fetchProspects();
  
  const companiesMap: Record<string, Prospect[]> = {};
  
  prospects.forEach(prospect => {
    const company = (prospect.company || 'other').toLowerCase();
    if (!companiesMap[company]) {
      companiesMap[company] = [];
    }
    companiesMap[company].push(prospect);
  });
  
  console.log('Companies data:', Object.keys(companiesMap));
  return companiesMap;
};

/* ──────────────────────────────────────────────────────────────── */
/*  Update prospect's stage                                        */
/* ──────────────────────────────────────────────────────────────── */

export const updateProspectDealStage = async (
  prospectId: string,
  dealStageId: string,
): Promise<boolean> => {
  const { error } = await supabase
    .from('prospect_profile')
    .update({ deal_stage_id: dealStageId })
    .eq('id', prospectId);

  if (error) {
    console.error('Error updating prospect deal stage:', error);
    toast.error('Failed to update prospect status');
    return false;
  }

  toast.success('Prospect status updated');
  return true;
};

/* ──────────────────────────────────────────────────────────────── */
/*  Communications                                                 */
/* ──────────────────────────────────────────────────────────────── */

export const fetchAllCommunications = async (): Promise<Communication[]> => {
  const { data, error } = await supabase
    .from('sales_tracking')
    .select(`
      *,
      prospect_profile (
        first_name,
        last_name,
        email
      )
    `)
    .order('date_of_communication', { ascending: false });

  if (error) {
    console.error('Error fetching communications:', error);
    toast.error('Failed to load communications');
    return [];
  }

  return data as Communication[] ?? [];
};

export const fetchProspectCommunications = async (prospectId: string): Promise<Communication[]> => {
  const { data, error } = await supabase
    .from('sales_tracking')
    .select(`
      *,
      prospect_profile (
        first_name,
        last_name,
        email
      )
    `)
    .eq('prospect_id', prospectId)
    .order('date_of_communication', { ascending: false });

  if (error) {
    console.error('Error fetching prospect communications:', error);
    toast.error('Failed to load prospect communications');
    return [];
  }

  return data as Communication[] ?? [];
};

/* ──────────────────────────────────────────────────────────────── */
/*  Tasks                                                          */
/* ──────────────────────────────────────────────────────────────── */

export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('today_tasks')
    .select(`
      *,
      prospect_profile (
        first_name,
        last_name
      )
    `)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    toast.error('Failed to load tasks');
    return [];
  }

  // Ensure the priority is cast to the correct union type
  return (data as any[] ?? []).map(task => ({
    ...task,
    priority: task.priority as 'high' | 'medium' | 'low'
  }));
};

export const fetchProspectTasks = async (prospectId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('today_tasks')
    .select(`
      *,
      prospect_profile (
        first_name,
        last_name
      )
    `)
    .eq('prospect_id', prospectId)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching prospect tasks:', error);
    toast.error('Failed to load prospect tasks');
    return [];
  }

  // Ensure the priority is cast to the correct union type
  return (data as any[] ?? []).map(task => ({
    ...task,
    priority: task.priority as 'high' | 'medium' | 'low'
  }));
};

export const toggleTaskCompletion = async (
  taskId: string, 
  completed: boolean
): Promise<boolean> => {
  const { error } = await supabase
    .from('today_tasks')
    .update({ completed })
    .eq('id', taskId);

  if (error) {
    console.error('Error updating task completion:', error);
    toast.error('Failed to update task');
    return false;
  }

  toast.success(completed ? 'Task marked as completed' : 'Task marked as incomplete');
  return true;
};

/* ──────────────────────────────────────────────────────────────── */
/*  Team members                                                   */
/* ──────────────────────────────────────────────────────────────── */

export const fetchTeamMembers = async (): Promise<AppUser[]> => {
  const { data, error } = await supabase
    .from('app_user')
    .select('*')
    .order('last_name');

  if (error) {
    console.error('Error fetching team members:', error);
    toast.error('Failed to load team members');
    return [];
  }

  return data as AppUser[] ?? [];
};

export const addTeamMember = async (memberData: Omit<AppUser, 'id' | 'created_at' | 'updated_at' | 'last_active'>): Promise<boolean> => {
  const { error } = await supabase
    .from('app_user')
    .insert([memberData]);

  if (error) {
    console.error('Error adding team member:', error);
    toast.error('Failed to add team member');
    return false;
  }

  toast.success('Team member added successfully');
  return true;
};

export const updateTeamMember = async (id: string, memberData: Partial<AppUser>): Promise<boolean> => {
  const { error } = await supabase
    .from('app_user')
    .update(memberData)
    .eq('id', id);

  if (error) {
    console.error('Error updating team member:', error);
    toast.error('Failed to update team member');
    return false;
  }

  toast.success('Team member updated successfully');
  return true;
};

export const deleteTeamMember = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('app_user')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting team member:', error);
    toast.error('Failed to delete team member');
    return false;
  }

  toast.success('Team member deleted successfully');
  return true;
};

/* ──────────────────────────────────────────────────────────────── */
/*  Helper functions                                               */
/* ──────────────────────────────────────────────────────────────── */

export const getStatusColor = (daysSinceLastContact: number | null): string => {
  if (daysSinceLastContact === null) {
    return 'gray-400';
  }
  if (daysSinceLastContact <= 2) {
    return 'green-500';
  }
  if (daysSinceLastContact <= 5) {
    return 'yellow-500';
  }
  if (daysSinceLastContact <= 10) {
    return 'orange-500';
  }
  return 'red-500';
};

export const getRecommendedAction = (daysSinceLastContact: number | null): string => {
  if (daysSinceLastContact === null) {
    return 'Initial contact needed';
  }
  if (daysSinceLastContact <= 2) {
    return 'Follow up next week';
  }
  if (daysSinceLastContact <= 5) {
    return 'Follow up this week';
  }
  if (daysSinceLastContact <= 10) {
    return 'Follow up today';
  }
  return 'Urgent follow up required';
};
