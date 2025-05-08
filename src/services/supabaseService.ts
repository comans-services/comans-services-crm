
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

/* ──────────────────────────────────────────────────────────────── */
/*  Deal stages                                                    */
/* ──────────────────────────────────────────────────────────────── */

export const fetchDealStages = async (): Promise<DealStage[]> => {
  const { data, error } = await supabase
    .from('deal_stage')                 // 🔄 generic removed
    .select<DealStage>('*')             // 🔄 generic added here
    .order('sort_order');

  if (error) {
    console.error('Error fetching deal stages:', error);
    toast.error('Failed to load deal stages');
    return [];
  }

  return data ?? [];
};

/* ──────────────────────────────────────────────────────────────── */
/*  Prospects                                                      */
/* ──────────────────────────────────────────────────────────────── */

export const fetchProspects = async (): Promise<Prospect[]> => {
  const { data, error } = await supabase
    .from('prospect_profile')           // 🔄 generic removed
    .select<Prospect>(`                // 🔄 generic added here
      *,
      prospect_engagement(last_contact_date)
    `);

  if (error) {
    console.error('Error fetching prospects:', error);
    toast.error('Failed to load prospects');
    return [];
  }

  /* Add UI helpers */
  return (data ?? []).map((p) => {
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
        last_name
      )
    `)
    .order('date_of_communication', { ascending: false });

  if (error) {
    console.error('Error fetching communications:', error);
    toast.error('Failed to load communications');
    return [];
  }

  return data ?? [];
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

  return data ?? [];
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
