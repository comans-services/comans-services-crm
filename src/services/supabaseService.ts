
import { supabase } from '@/integrations/supabase/client';
import { getStatusColor, getRecommendedAction, extractDomain, getDomainCompany } from '@/utils/clientUtils';
import { format } from 'date-fns';

// Types for Supabase tables
export interface ProspectProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface ProspectEngagement {
  id: string;
  prospect_id: string;
  last_contact_date: string | null;
  engagement_stage_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SalesTracking {
  id: string;
  prospect_id: string;
  prospect_first_name: string;
  prospect_last_name: string;
  salesperson_email: string;
  subject_text: string;
  body_text: string | null;
  date_of_communication: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'salesperson';
  last_active?: string;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_detail?: any;
  occurred_at: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdAt: string;
  completed: boolean;
}

export interface ProspectWithEngagement extends ProspectProfile {
  engagement: ProspectEngagement;
  communications: SalesTracking[];
  daysSinceLastContact: number | null;
  statusColor: string;
  recommendedAction: string;
  company: string;
  dragId?: string; // Add dragId property for drag-and-drop functionality
}

// Helper function to extract action items from document
export function extractActionItemsFromDocument(documentText: string): ActionItem[] {
  // This is a mock implementation that simulates AI extraction
  const currentDate = new Date();
  const twoWeeksFromNow = new Date(currentDate);
  twoWeeksFromNow.setDate(currentDate.getDate() + 14);
  
  return [
    {
      id: `ai-${Date.now()}-1`,
      title: 'Follow up on pricing discussion',
      description: 'Discuss the updated pricing structure based on the client\'s requirements',
      priority: 'high',
      dueDate: new Date(currentDate.setDate(currentDate.getDate() + 2)).toISOString(),
      createdAt: new Date().toISOString(),
      completed: false
    },
    {
      id: `ai-${Date.now()}-2`,
      title: 'Send product specifications',
      description: 'Share detailed specifications for the enterprise plan',
      priority: 'medium',
      dueDate: new Date(currentDate.setDate(currentDate.getDate() + 5)).toISOString(),
      createdAt: new Date().toISOString(),
      completed: false
    },
    {
      id: `ai-${Date.now()}-3`,
      title: 'Schedule technical demo',
      description: 'Arrange a technical demonstration with the IT department',
      priority: 'low',
      dueDate: twoWeeksFromNow.toISOString(),
      createdAt: new Date().toISOString(),
      completed: false
    }
  ];
}

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

      // Find communications for this prospect and add required fields
      const prospectCommunications = (communications || [])
        .filter(c => c.prospect_id === profile.id)
        .sort((a, b) => new Date(b.date_of_communication).getTime() - new Date(a.date_of_communication).getTime())
        .map(comm => ({
          ...comm,
          prospect_first_name: profile.first_name,
          prospect_last_name: profile.last_name
        }));

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

      // Add dragId for drag-and-drop functionality
      return {
        ...profile,
        engagement,
        communications: prospectCommunications,
        daysSinceLastContact,
        statusColor,
        recommendedAction,
        company,
        dragId: `drag-${profile.id}`
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

    // Map communications with required fields
    const prospectCommunications = communications?.map(comm => ({
      ...comm,
      prospect_first_name: profile.first_name,
      prospect_last_name: profile.last_name
    })) || [];

    return {
      ...profile,
      engagement: prospectEngagement,
      communications: prospectCommunications,
      daysSinceLastContact,
      statusColor,
      recommendedAction,
      company,
      dragId: `drag-${profile.id}`
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
    ...profile,
    engagement,
    communications: [],
    daysSinceLastContact: null,
    statusColor: 'gray',
    recommendedAction: 'Initial contact recommended',
    company,
    dragId: `drag-${profile.id}`
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
  
  // Get prospect details for adding to the communication record
  const { data: prospect, error: prospectError } = await supabase
    .from('prospect_profile')
    .select('first_name, last_name')
    .eq('id', communication.prospect_id)
    .single();
  
  if (prospectError) {
    console.error('Error fetching prospect details:', prospectError);
    throw new Error(prospectError.message);
  }

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

  // Return the complete SalesTracking object
  return {
    ...data,
    prospect_first_name: prospect.first_name,
    prospect_last_name: prospect.last_name
  };
};

/**
 * Fetches all team members (app_users)
 */
export const getTeamMembers = async () => {
  const { data, error } = await supabase
    .from('app_user')
    .select('*');
  
  if (error) {
    console.error('Error fetching team members:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Adds a new team member
 */
export const addTeamMember = async (member: {
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'salesperson';
}) => {
  const { data, error } = await supabase
    .from('app_user')
    .insert(member)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding team member:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates an existing team member
 */
export const updateTeamMember = async (id: string, updates: {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: 'admin' | 'salesperson';
}) => {
  const { data, error } = await supabase
    .from('app_user')
    .update(updates)
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
 * Removes a team member
 */
export const removeTeamMember = async (id: string) => {
  const { error } = await supabase
    .from('app_user')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error removing team member:', error);
    throw new Error(error.message);
  }

  return true;
};

/**
 * Gets user activity logs
 */
export const getUserActivity = async (limit = 10) => {
  const { data, error } = await supabase
    .from('user_activity')
    .select('*, app_user!user_activity_user_id_fkey(*)')
    .order('occurred_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching user activity:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Records a user activity
 */
export const recordUserActivity = async (activity: {
  user_id: string;
  activity_type: string;
  activity_detail?: any;
}) => {
  const { data, error } = await supabase
    .from('user_activity')
    .insert(activity)
    .select()
    .single();
  
  if (error) {
    console.error('Error recording user activity:', error);
    throw new Error(error.message);
  }

  return data;
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
      } as any,
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
