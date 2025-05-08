
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DealStage {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

/**
 * Fetch all deal stages from the database
 */
export const fetchDealStages = async (): Promise<DealStage[]> => {
  try {
    const { data, error } = await supabase
      .from('deal_stage')
      .select('*')
      .order('sort_order');
    
    if (error) {
      console.error('Error fetching deal stages:', error);
      toast.error('Failed to load deal stages');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchDealStages:', error);
    return [];
  }
};

/**
 * Update a prospect's deal stage
 */
export const updateProspectDealStage = async (prospectId: string, dealStageId: string): Promise<boolean> => {
  try {
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
  } catch (error) {
    console.error('Error in updateProspectDealStage:', error);
    return false;
  }
};

/**
 * Fetch all prospects with their last contact date
 */
export const fetchProspects = async () => {
  try {
    const { data: prospectData, error } = await supabase
      .from('prospect_profile')
      .select(`
        *,
        prospect_engagement(last_contact_date)
      `);
      
    if (error) {
      console.error("Error fetching prospects:", error);
      toast.error('Failed to load prospects');
      return [];
    }
    
    // Process prospects to add dragId and calculate days since last contact
    const processedProspects = prospectData.map(prospect => {
      // Extract last contact date from engagement if available
      const lastContactDate = prospect.prospect_engagement && 
        prospect.prospect_engagement[0]?.last_contact_date;
      
      // Calculate days since last contact
      let daysSinceLastContact = null;
      if (lastContactDate) {
        const diffTime = Date.now() - new Date(lastContactDate).getTime();
        daysSinceLastContact = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      
      return {
        ...prospect,
        dragId: `drag-${prospect.id}`,
        daysSinceLastContact
      };
    });
    
    return processedProspects;
  } catch (error) {
    console.error("Error in fetchProspects:", error);
    return [];
  }
};

/**
 * Fetch communications for a prospect
 */
export const fetchProspectCommunications = async (prospectId: string) => {
  try {
    const { data, error } = await supabase
      .from('sales_tracking')
      .select('*')
      .eq('prospect_id', prospectId)
      .order('date_of_communication', { ascending: false });
    
    if (error) {
      console.error("Error fetching prospect communications:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchProspectCommunications:", error);
    return [];
  }
};

/**
 * Create a new prospect communication
 */
export const createProspectCommunication = async (communicationData: {
  prospect_id: string;
  subject_text: string;
  body_text?: string;
  salesperson_email: string;
}) => {
  try {
    const { error } = await supabase
      .from('sales_tracking')
      .insert([communicationData]);
    
    if (error) {
      console.error("Error creating prospect communication:", error);
      toast.error('Failed to log communication');
      return false;
    }
    
    toast.success('Communication logged successfully');
    return true;
  } catch (error) {
    console.error("Error in createProspectCommunication:", error);
    return false;
  }
};
