
import { supabase } from '@/integrations/supabase/client';
import { getStatusColor, getRecommendedAction, extractDomain, getDomainCompany } from '@/utils/clientUtils';
import { format } from 'date-fns';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

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
  role: "admin" | "salesperson";
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
  app_user?: TeamMember;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdAt: string;
  completed: boolean;
  status?: 'todo' | 'in-progress' | 'completed';
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
export function extractActionItemsFromDocument(fileName: string): Promise<ActionItem[]> {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Generate 2-4 random action items
      const numberOfItems = Math.floor(Math.random() * 3) + 2;
      const actionItems: ActionItem[] = [];
      
      const priorities = ['low', 'medium', 'high'] as const;
      
      // Sample action item titles based on document type
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      const actionTitles = {
        pdf: [
          'Review product specifications',
          'Schedule follow-up call',
          'Prepare proposal',
          'Send case studies',
          'Discuss budget constraints'
        ],
        docx: [
          'Update contract terms',
          'Finalize pricing structure',
          'Address legal concerns',
          'Share testimonials',
          'Present ROI analysis'
        ],
        xlsx: [
          'Analyze financial projections',
          'Compare pricing options',
          'Review purchase history',
          'Update forecast model',
          'Discuss volume discounts'
        ],
        default: [
          'Schedule next meeting',
          'Send additional information',
          'Follow up on questions',
          'Prepare presentation',
          'Request stakeholder meeting'
        ]
      };
      
      const titles = actionTitles[fileExtension as keyof typeof actionTitles] || actionTitles.default;
      
      // Generate random action items
      for (let i = 0; i < numberOfItems; i++) {
        const randomTitleIndex = Math.floor(Math.random() * titles.length);
        const daysToAdd = Math.floor(Math.random() * 14) + 1;
        const today = new Date();
        const dueDate = new Date(today.setDate(today.getDate() + daysToAdd));
        
        actionItems.push({
          id: crypto.randomUUID(),
          title: titles[randomTitleIndex],
          description: `AI extracted task from ${fileName}. This is a simulated action item that would be created by analyzing the content of the uploaded document.`,
          dueDate: dueDate.toISOString(),
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          completed: false,
          status: 'todo',
          createdAt: new Date().toISOString()
        });
        
        // Remove used title to avoid duplicates
        titles.splice(randomTitleIndex, 1);
      }
      
      resolve(actionItems);
    }, 1500); // 1.5 second delay to simulate processing
  });
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

      // Find communications for this prospect
      const prospectCommunications = (communications || [])
        .filter(c => c.prospect_id === profile.id)
        .map(c => ({
          ...c,
          prospect_first_name: profile.first_name,
          prospect_last_name: profile.last_name
        }))
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

  // Get prospect details first
  const { data: prospect, error: prospectError } = await supabase
    .from('prospect_profile')
    .select('first_name, last_name')
    .eq('id', communication.prospect_id)
    .single();
    
  if (prospectError) {
    console.error('Error getting prospect details:', prospectError);
    throw new Error(prospectError.message);
  }

  // Insert communication record with prospect name details
  const { data, error } = await supabase
    .from('sales_tracking')
    .insert({
      prospect_id: communication.prospect_id,
      subject_text: communication.subject_text,
      body_text: communication.body_text || null,
      salesperson_email: communication.salesperson_email,
      date_of_communication: now,
      prospect_first_name: prospect.first_name,
      prospect_last_name: prospect.last_name
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

  return data as SalesTracking;
};

/**
 * Fetches all team members (app_users)
 */
export const getTeamMembers = async (): Promise<TeamMember[]> => {
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
  role: "admin" | "salesperson";
}): Promise<TeamMember> => {
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
  role?: "admin" | "salesperson";
}): Promise<TeamMember> => {
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
export const removeTeamMember = async (id: string): Promise<boolean> => {
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
export const getUserActivity = async (limit = 10): Promise<UserActivity[]> => {
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
}): Promise<UserActivity> => {
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
  callback: (payload: RealtimePostgresChangesPayload<Record<string, any>>) => void
) => {
  const channel = supabase
    .channel(`table-changes:${table}`)
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
