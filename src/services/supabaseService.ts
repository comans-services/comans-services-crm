import { supabase } from '@/integrations/supabase/client';
import { getStatusColor, getRecommendedAction, extractDomain, getDomainCompany } from '@/utils/clientUtils';
import { ProspectProfile, ProspectEngagement, SalesTracking, ProspectWithEngagement } from '@/services/mockDataService';

/**
 * Fetches all prospects with their engagement data from Supabase
 */
export const getProspects = async (): Promise<ProspectWithEngagement[]> => {
  try {
    // First query the prospect profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('prospect_profile')
      .select('*');
    
    if (profilesError) {
      console.error('Error fetching prospect profiles:', profilesError);
      throw new Error(profilesError.message);
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    // Get all prospect IDs for engagement query
    const prospectIds = profiles.map(profile => profile.id);

    // Query engagement data for all prospects
    const { data: engagements, error: engagementsError } = await supabase
      .from('prospect_engagement')
      .select('*')
      .in('prospect_id', prospectIds);
    
    if (engagementsError) {
      console.error('Error fetching prospect engagements:', engagementsError);
      throw new Error(engagementsError.message);
    }

    // Query communications data for all prospects
    const { data: communications, error: communicationsError } = await supabase
      .from('sales_tracking')
      .select('*')
      .in('prospect_id', prospectIds);
    
    if (communicationsError) {
      console.error('Error fetching sales tracking data:', communicationsError);
      throw new Error(communicationsError.message);
    }

    // Map prospect profiles with engagement and communication data
    const prospects: ProspectWithEngagement[] = profiles.map(profile => {
      // Find engagement data for this prospect
      const engagement = engagements?.find(e => e.prospect_id === profile.id) || {
        id: '',
        prospect_id: profile.id,
        last_contact_date: null,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      };

      // Find communications for this prospect
      const prospectCommunications = (communications || [])
        .filter(c => c.prospect_id === profile.id)
        .sort((a, b) => new Date(b.date_of_communication).getTime() - new Date(a.date_of_communication).getTime());

      // Calculate days since last contact
      const daysSinceLastContact = engagement.last_contact_date
        ? Math.floor((new Date().getTime() - new Date(engagement.last_contact_date).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      // Determine status color and recommended action
      const statusColor = getStatusColor(daysSinceLastContact);
      const recommendedAction = getRecommendedAction(daysSinceLastContact);

      // Get company from email domain
      const domain = extractDomain(profile.email);
      const company = profile.company || getDomainCompany(domain);

      return {
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        company,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        engagement,
        communications: prospectCommunications.map(comm => ({
          id: comm.id,
          prospect_id: comm.prospect_id,
          prospect_first_name: profile.first_name,
          prospect_last_name: profile.last_name,
          salesperson_email: comm.salesperson_email,
          subject_text: comm.subject_text,
          body_text: comm.body_text,
          date_of_communication: comm.date_of_communication,
          created_at: comm.created_at,
          updated_at: comm.updated_at
        })),
        daysSinceLastContact,
        statusColor,
        recommendedAction
      };
    });

    return prospects;
  } catch (error) {
    console.error('Error in getProspects:', error);
    throw error;
  }
};

/**
 * Fetches a single prospect by ID with engagement data
 */
export const getProspectById = async (id: string): Promise<ProspectWithEngagement | null> => {
  try {
    if (!id) return null;

    // Get the prospect profile
    const { data: profile, error: profileError } = await supabase
      .from('prospect_profile')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError) {
      console.error('Error fetching prospect profile:', profileError);
      throw new Error(profileError.message);
    }

    if (!profile) return null;

    // Get engagement data
    const { data: engagement, error: engagementError } = await supabase
      .from('prospect_engagement')
      .select('*')
      .eq('prospect_id', id)
      .maybeSingle();
    
    if (engagementError) {
      console.error('Error fetching prospect engagement:', engagementError);
      throw new Error(engagementError.message);
    }

    // Get communications
    const { data: communications, error: communicationsError } = await supabase
      .from('sales_tracking')
      .select('*')
      .eq('prospect_id', id)
      .order('date_of_communication', { ascending: false });
    
    if (communicationsError) {
      console.error('Error fetching sales tracking data:', communicationsError);
      throw new Error(communicationsError.message);
    }

    // Create the engagement object if it doesn't exist
    const prospectEngagement = engagement || {
      id: '',
      prospect_id: profile.id,
      last_contact_date: null,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    };

    // Calculate days since last contact
    const daysSinceLastContact = prospectEngagement.last_contact_date
      ? Math.floor((new Date().getTime() - new Date(prospectEngagement.last_contact_date).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Determine status color and recommended action
    const statusColor = getStatusColor(daysSinceLastContact);
    const recommendedAction = getRecommendedAction(daysSinceLastContact);

    // Get company from email domain
    const domain = extractDomain(profile.email);
    const company = profile.company || getDomainCompany(domain);

    // Map communications
    const prospectCommunications = communications?.map(comm => ({
      id: comm.id,
      prospect_id: comm.prospect_id,
      prospect_first_name: profile.first_name,
      prospect_last_name: profile.last_name,
      salesperson_email: comm.salesperson_email,
      subject_text: comm.subject_text,
      body_text: comm.body_text,
      date_of_communication: comm.date_of_communication,
      created_at: comm.created_at,
      updated_at: comm.updated_at
    })) || [];

    return {
      id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      company,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      engagement: prospectEngagement,
      communications: prospectCommunications,
      daysSinceLastContact,
      statusColor,
      recommendedAction
    };
  } catch (error) {
    console.error('Error in getProspectById:', error);
    throw error;
  }
};

/**
 * Groups prospects by company domain
 */
export const getProspectsByCompany = async (): Promise<Record<string, ProspectWithEngagement[]>> => {
  const prospects = await getProspects();
  const companiesMap: Record<string, ProspectWithEngagement[]> = {};
  
  prospects.forEach(prospect => {
    const company = prospect.company;
    if (!companiesMap[company]) {
      companiesMap[company] = [];
    }
    companiesMap[company].push(prospect);
  });
  
  return companiesMap;
};

/**
 * Creates a new prospect
 */
export const createProspect = async (prospect: {
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  phone?: string;
}): Promise<ProspectWithEngagement> => {
  // Insert the prospect profile
  const { data: profile, error: profileError } = await supabase
    .from('prospect_profile')
    .insert({
      first_name: prospect.first_name,
      last_name: prospect.last_name,
      email: prospect.email,
      company: prospect.company,
      phone: prospect.phone
    })
    .select()
    .single();
  
  if (profileError) {
    console.error('Error creating prospect profile:', profileError);
    throw new Error(profileError.message);
  }

  // Create engagement record
  const { data: engagement, error: engagementError } = await supabase
    .from('prospect_engagement')
    .insert({
      prospect_id: profile.id
    })
    .select()
    .single();
  
  if (engagementError) {
    console.error('Error creating prospect engagement:', engagementError);
    throw new Error(engagementError.message);
  }

  // Get company from email domain if not provided
  const domain = extractDomain(profile.email);
  const company = profile.company || getDomainCompany(domain);

  return {
    id: profile.id,
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    company,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    engagement,
    communications: [],
    daysSinceLastContact: null,
    statusColor: 'gray',
    recommendedAction: 'Initial contact recommended'
  };
};

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

/**
 * Sets up real-time subscriptions for a table
 */
export const setupRealTimeSubscription = (
  table: string, 
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
) => {
  const channel = supabase
    .channel('table-changes')
    .on(
      'postgres_changes',
      {
        event: event,
        schema: 'public',
        table: table
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
