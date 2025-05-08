
import { supabase } from '@/integrations/supabase/client';
import type { SalesTracking } from '@/services/types';

/**
 * Records a new communication with a prospect
 */
export const recordCommunication = async (communication: {
  prospect_id: string;
  subject_text: string;
  body_text?: string;
  salesperson_email: string;
}): Promise<SalesTracking> => {
  // Get current date
  const now = new Date().toISOString();

  // Insert communication record
  const { data, error } = await supabase
    .from('sales_tracking')
    .insert({
      prospect_id: communication.prospect_id,
      subject_text: communication.subject_text,
      body_text: communication.body_text || null,
      salesperson_email: communication.salesperson_email,
      date_of_communication: now
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error recording communication:', error);
    throw new Error(error.message);
  }

  // Update last_contact_date in engagement
  await supabase
    .from('prospect_engagement')
    .update({ 
      last_contact_date: now,
      updated_at: now
    })
    .eq('prospect_id', communication.prospect_id);

  // Get the prospect details to add to the return object
  const { data: prospect } = await supabase
    .from('prospect_profile')
    .select('first_name, last_name')
    .eq('id', communication.prospect_id)
    .single();

  // Return with the required fields for SalesTracking type
  return {
    ...data,
    prospect_first_name: prospect?.first_name || '',
    prospect_last_name: prospect?.last_name || ''
  };
};

/**
 * Fetches activity logs (sales_tracking)
 */
export const getActivityLogs = async (limit: number = 10) => {
  const { data, error } = await supabase
    .from('sales_tracking')
    .select(`
      *,
      prospect:prospect_id (
        first_name,
        last_name
      )
    `)
    .order('date_of_communication', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching activity logs:', error);
    throw new Error(error.message);
  }

  return data || [];
};
