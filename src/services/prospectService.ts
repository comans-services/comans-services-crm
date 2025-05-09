
import { supabase } from '@/integrations/supabase/client';
import { ProspectProfile, ProspectWithEngagement } from './types/serviceTypes';
import { getStatusColor, getRecommendedAction, extractDomain, getDomainCompany } from '@/utils/clientUtils';

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
  try {
    // Insert the prospect profile
    const { data: profile, error: profileError } = await supabase
      .from('prospect_profile')
      .insert({
        first_name: prospect.first_name,
        last_name: prospect.last_name,
        email: prospect.email,
        company: prospect.company || null,
        phone: prospect.phone || null
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('Error creating prospect profile:', profileError);
      throw new Error(profileError.message);
    }

    if (!profile) {
      throw new Error('Failed to create prospect: No data returned');
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
  } catch (error) {
    console.error('Error in createProspect:', error);
    throw error;
  }
};
