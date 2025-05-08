
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
