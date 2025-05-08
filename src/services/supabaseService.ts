import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';

// Types that match our Supabase tables
export interface ProspectWithEngagement {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
  client_since: string | null;
  daysSinceLastContact: number | null;
  statusColor: string;
  recommendedAction: string;
  dragId?: string;
  deal_stage_id?: string | null;
  engagement?: {
    id: string;
    prospect_id: string;
    engagement_stage_id: string | null;
    last_contact_date: string | null;
    created_at: string;
    updated_at: string;
  };
  communications: Array<{
    id: string;
    prospect_id: string;
    salesperson_email: string;
    subject_text: string;
    body_text: string | null;
    date_of_communication: string;
    created_at: string;
    updated_at: string;
  }>;
}

// Fetch all prospects with their engagement data
export const getProspects = async (): Promise<ProspectWithEngagement[]> => {
  try {
    // Fetch prospects
    const { data: prospects, error: prospectsError } = await supabase
      .from('prospect_profile')
      .select('*');

    if (prospectsError) {
      console.error("Error fetching prospects:", prospectsError);
      return [];
    }

    // Fetch engagements for all prospects
    const { data: engagements, error: engagementsError } = await supabase
      .from('prospect_engagement')
      .select('*');

    if (engagementsError) {
      console.error("Error fetching engagements:", engagementsError);
      return [];
    }

    // Fetch communications (sales_tracking) for all prospects
    const { data: communications, error: communicationsError } = await supabase
      .from('sales_tracking')
      .select('*');

    if (communicationsError) {
      console.error("Error fetching communications:", communicationsError);
      return [];
    }

    // Process and combine the data
    const prospectsWithEngagement: ProspectWithEngagement[] = prospects.map((prospect: any) => {
      // Find engagement for this prospect
      const engagement = engagements.find((eng: any) => eng.prospect_id === prospect.id) || null;
      
      // Find communications for this prospect
      const prospectCommunications = communications
        .filter((comm: any) => comm.prospect_id === prospect.id)
        .sort((a: any, b: any) => 
          new Date(b.date_of_communication).getTime() - new Date(a.date_of_communication).getTime()
        );

      // Calculate days since last contact
      const lastContactDate = engagement?.last_contact_date;
      const daysSinceLastContact = lastContactDate 
        ? Math.floor((new Date().getTime() - new Date(lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
        : null;
      
      // Determine status color based on days since last contact
      let statusColor = 'gray';
      let recommendedAction = 'No previous contact';
      
      if (daysSinceLastContact !== null) {
        if (daysSinceLastContact <= 2) {
          statusColor = 'green-500';
          recommendedAction = 'Follow up next week';
        } else if (daysSinceLastContact <= 5) {
          statusColor = 'yellow-500';
          recommendedAction = 'Follow up this week';
        } else if (daysSinceLastContact <= 10) {
          statusColor = 'orange-500';
          recommendedAction = 'Follow up today';
        } else {
          statusColor = 'red-500';
          recommendedAction = 'Urgent follow up required';
        }
      }

      return {
        ...prospect,
        engagement,
        communications: prospectCommunications,
        daysSinceLastContact,
        statusColor,
        recommendedAction,
        // Create a unique dragId for the prospect
        dragId: `drag-${prospect.id}`
      };
    });

    return prospectsWithEngagement;
  } catch (error) {
    console.error("Error in getProspects:", error);
    return [];
  }
};

// Fetch a single prospect by ID
export const getProspectById = async (id: string): Promise<ProspectWithEngagement | null> => {
  try {
    // Fetch prospect
    const { data: prospect, error: prospectError } = await supabase
      .from('prospect_profile')
      .select('*')
      .eq('id', id)
      .single();

    if (prospectError) {
      console.error("Error fetching prospect:", prospectError);
      return null;
    }

    // Fetch engagement
    const { data: engagement, error: engagementError } = await supabase
      .from('prospect_engagement')
      .select('*')
      .eq('prospect_id', id)
      .maybeSingle();

    if (engagementError) {
      console.error("Error fetching engagement:", engagementError);
      // Continue without engagement data
    }

    // Fetch communications
    const { data: communications, error: communicationsError } = await supabase
      .from('sales_tracking')
      .select('*')
      .eq('prospect_id', id)
      .order('date_of_communication', { ascending: false });

    if (communicationsError) {
      console.error("Error fetching communications:", communicationsError);
      // Continue without communications data
    }

    // Calculate days since last contact
    const lastContactDate = engagement?.last_contact_date;
    const daysSinceLastContact = lastContactDate 
      ? Math.floor((new Date().getTime() - new Date(lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
      : null;
    
    // Determine status color and action
    let statusColor = 'gray';
    let recommendedAction = 'No previous contact';
    
    if (daysSinceLastContact !== null) {
      if (daysSinceLastContact <= 2) {
        statusColor = 'green-500';
        recommendedAction = 'Follow up next week';
      } else if (daysSinceLastContact <= 5) {
        statusColor = 'yellow-500';
        recommendedAction = 'Follow up this week';
      } else if (daysSinceLastContact <= 10) {
        statusColor = 'orange-500';
        recommendedAction = 'Follow up today';
      } else {
        statusColor = 'red-500';
        recommendedAction = 'Urgent follow up required';
      }
    }

    return {
      ...prospect,
      engagement: engagement || undefined,
      communications: communications || [],
      daysSinceLastContact,
      statusColor,
      recommendedAction,
      dragId: `drag-${prospect.id}`
    };
  } catch (error) {
    console.error("Error in getProspectById:", error);
    return null;
  }
};

// Group prospects by company domain
export const getProspectsByCompany = async (): Promise<Record<string, ProspectWithEngagement[]>> => {
  try {
    const prospects = await getProspects();
    const companiesMap: Record<string, ProspectWithEngagement[]> = {};
    
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

// Create a new prospect
export const createProspect = async (prospectData: {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}): Promise<boolean> => {
  try {
    // Insert into prospect_profile table
    const { data: newProspect, error: prospectError } = await supabase
      .from('prospect_profile')
      .insert({
        first_name: prospectData.firstName,
        last_name: prospectData.lastName,
        email: prospectData.email,
        company: prospectData.company
      })
      .select('id')
      .single();

    if (prospectError) {
      console.error("Error creating prospect:", prospectError);
      return false;
    }

    // Create engagement record for the prospect
    const { error: engagementError } = await supabase
      .from('prospect_engagement')
      .insert({
        prospect_id: newProspect.id
      });

    if (engagementError) {
      console.error("Error creating engagement:", engagementError);
      // Don't return false here, as the prospect was created
    }

    return true;
  } catch (error) {
    console.error("Error in createProspect:", error);
    return false;
  }
};

// Update prospect's engagement stage
export const updateProspectEngagementStage = async (
  prospectId: string,
  engagementStageId: string
): Promise<boolean> => {
  try {
    // Check if engagement record exists
    const { data: existingEngagement, error: checkError } = await supabase
      .from('prospect_engagement')
      .select('id')
      .eq('prospect_id', prospectId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking engagement:", checkError);
      return false;
    }

    if (existingEngagement) {
      // Update existing engagement
      const { error: updateError } = await supabase
        .from('prospect_engagement')
        .update({ 
          engagement_stage_id: engagementStageId,
          updated_at: new Date().toISOString()
        })
        .eq('prospect_id', prospectId);

      if (updateError) {
        console.error("Error updating engagement:", updateError);
        return false;
      }
    } else {
      // Create new engagement
      const { error: insertError } = await supabase
        .from('prospect_engagement')
        .insert({
          prospect_id: prospectId,
          engagement_stage_id: engagementStageId
        });

      if (insertError) {
        console.error("Error creating engagement:", insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error in updateProspectEngagementStage:", error);
    return false;
  }
};

// Update prospect's deal stage
export const updateProspectDealStage = async (
  prospectId: string,
  dealStageId: string
): Promise<boolean> => {
  try {
    // Update prospect's deal_stage_id
    const { error: updateError } = await supabase
      .from('prospect_profile')
      .update({ 
        deal_stage_id: dealStageId,
        updated_at: new Date().toISOString()
      })
      .eq('id', prospectId);

    if (updateError) {
      console.error("Error updating deal stage:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateProspectDealStage:", error);
    return false;
  }
};

// Fetch all engagement stages
export const getEngagementStages = async () => {
  try {
    const { data, error } = await supabase
      .from('engagement_stage')
      .select('*')
      .order('sort_order');
    
    if (error) {
      console.error("Error fetching engagement stages:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getEngagementStages:", error);
    return [];
  }
};

// Fetch all deal stages
export const getDealStages = async () => {
  try {
    const { data, error } = await supabase
      .from('deal_stage')
      .select('*')
      .order('sort_order');
    
    if (error) {
      console.error("Error fetching deal stages:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getDealStages:", error);
    return [];
  }
};

// Fetch all lead sources
export const getLeadSources = async () => {
  try {
    const { data, error } = await supabase
      .from('lead_source')
      .select('*')
      .order('sort_order');
    
    if (error) {
      console.error("Error fetching lead sources:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getLeadSources:", error);
    return [];
  }
};
