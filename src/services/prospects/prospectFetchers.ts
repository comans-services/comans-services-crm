
import { supabase } from '@/integrations/supabase/client';
import { ProspectWithEngagement } from '@/services/types/serviceTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetches all prospects from the database
 */
export const getProspects = async (): Promise<ProspectWithEngagement[]> => {
  const { data, error } = await supabase
    .from('prospect_profile')
    .select(`
      *,
      engagement:prospect_engagement(*),
      communications:sales_tracking(*)
    `)
    .is('is_deleted', null)
    .or('is_deleted.eq.false');

  if (error) {
    console.error('Error fetching prospects:', error);
    throw new Error(`Failed to fetch prospects: ${error.message}`);
  }

  // Process the results into the expected format
  return (data || []).map(prospect => {
    // Extract the days since last contact if present
    const engagementData = Array.isArray(prospect.engagement) ? prospect.engagement[0] : prospect.engagement;
    const lastContactDate = engagementData?.last_contact_date;
    
    const daysSinceLastContact = lastContactDate 
      ? Math.floor((Date.now() - new Date(lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
      : null;
    
    // Determine status color based on days since last contact
    let statusColor = 'gray';
    if (daysSinceLastContact !== null) {
      if (daysSinceLastContact <= 7) statusColor = 'green';
      else if (daysSinceLastContact <= 14) statusColor = 'yellow';
      else if (daysSinceLastContact <= 30) statusColor = 'orange';
      else statusColor = 'red';
    }
    
    // Generate a recommended action based on status
    let recommendedAction = 'Schedule initial contact';
    if (daysSinceLastContact !== null) {
      if (daysSinceLastContact <= 7) recommendedAction = 'Follow up on previous conversation';
      else if (daysSinceLastContact <= 14) recommendedAction = 'Check in with client';
      else if (daysSinceLastContact <= 30) recommendedAction = 'Send re-engagement email';
      else recommendedAction = 'Urgent: Contact client immediately';
    }

    // Ensure engagement is a single object, not an array
    const engagement = Array.isArray(prospect.engagement) 
      ? (prospect.engagement[0] || { last_contact_date: null, prospect_id: prospect.id })
      : (prospect.engagement || { last_contact_date: null, prospect_id: prospect.id });

    return {
      ...prospect,
      company: prospect.company || 'Unknown',
      engagement,
      communications: prospect.communications || [],
      daysSinceLastContact,
      statusColor,
      recommendedAction,
      dragId: uuidv4() // Add unique ID for drag-and-drop functionality
    };
  });
};

/**
 * Utility functions for determining status color and recommended action
 */
const getStatusColor = (daysSinceLastContact: number | null): string => {
  if (daysSinceLastContact === null) return 'gray';
  if (daysSinceLastContact <= 7) return 'green';
  if (daysSinceLastContact <= 14) return 'yellow';
  if (daysSinceLastContact <= 30) return 'orange';
  return 'red';
};

const getRecommendedAction = (daysSinceLastContact: number | null): string => {
  if (daysSinceLastContact === null) return 'Schedule initial contact';
  if (daysSinceLastContact <= 7) return 'Follow up on previous conversation';
  if (daysSinceLastContact <= 14) return 'Check in with client';
  if (daysSinceLastContact <= 30) return 'Send re-engagement email';
  return 'Urgent: Contact client immediately';
};

/**
 * Extract domain from email
 */
const extractDomain = (email: string): string => {
  const parts = email.split('@');
  return parts.length > 1 ? parts[1] : '';
};

/**
 * Get company name from domain
 */
const getDomainCompany = (domain: string): string => {
  if (!domain) return 'Unknown';
  const parts = domain.split('.');
  return parts.length > 0 ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Unknown';
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
