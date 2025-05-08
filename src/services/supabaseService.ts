
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DealStage {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface ProspectProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  deal_stage_id: string | null;
  created_at: string;
  updated_at: string;
  client_since?: string;
  daysSinceLastContact?: number | null;
}

export interface Communication {
  id: string;
  prospect_id: string;
  salesperson_email: string;
  subject_text: string;
  body_text: string | null;
  date_of_communication: string;
  created_at: string;
  updated_at: string;
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
export const fetchProspects = async (): Promise<ProspectProfile[]> => {
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
 * Fetch a single prospect by ID with all related data
 */
export const fetchProspectById = async (id: string): Promise<ProspectProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('prospect_profile')
      .select(`
        *,
        prospect_engagement(last_contact_date)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching prospect:", error);
      toast.error('Failed to load prospect details');
      return null;
    }
    
    // Calculate days since last contact
    const lastContactDate = data.prospect_engagement && 
      data.prospect_engagement[0]?.last_contact_date;
    
    let daysSinceLastContact = null;
    if (lastContactDate) {
      const diffTime = Date.now() - new Date(lastContactDate).getTime();
      daysSinceLastContact = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    return {
      ...data,
      daysSinceLastContact
    };
  } catch (error) {
    console.error("Error in fetchProspectById:", error);
    return null;
  }
};

/**
 * Fetch communications for a prospect
 */
export const fetchProspectCommunications = async (prospectId: string): Promise<Communication[]> => {
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
 * Fetch all communications
 */
export const fetchAllCommunications = async (): Promise<Communication[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_tracking')
      .select(`
        *,
        prospect_profile!sales_tracking_prospect_id_fkey(first_name, last_name, email)
      `)
      .order('date_of_communication', { ascending: false });
    
    if (error) {
      console.error("Error fetching communications:", error);
      toast.error('Failed to load communications');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchAllCommunications:", error);
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

/**
 * Get status color based on days since last contact
 */
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

/**
 * Get recommended action based on days since last contact
 */
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

/**
 * Group prospects by company
 */
export const getProspectsByCompany = async (): Promise<Record<string, ProspectProfile[]>> => {
  try {
    const prospects = await fetchProspects();
    const companiesMap: Record<string, ProspectProfile[]> = {};
    
    prospects.forEach(prospect => {
      const company = prospect.company || 'Unknown';
      if (!companiesMap[company]) {
        companiesMap[company] = [];
      }
      companiesMap[company].push(prospect);
    });
    
    return companiesMap;
  } catch (error) {
    console.error("Error in getProspectsByCompany:", error);
    return {};
  }
};
