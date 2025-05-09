
import { supabase } from '@/integrations/supabase/client';
import { SalesTracking } from './types/serviceTypes';

/**
 * Records a new communication with a prospect
 */
export const recordCommunication = async (communication: {
  prospect_id: string;
  subject_text: string;
  body_text?: string;
  salesperson_email: string;
  prospect_first_name: string;
  prospect_last_name: string;
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

  return {
    ...data,
    prospect_first_name: communication.prospect_first_name,
    prospect_last_name: communication.prospect_last_name
  };
};
