
import { supabase } from '@/integrations/supabase/client';
import { ProspectWithEngagement } from '../types/serviceTypes';
import { extractDomain, getDomainCompany } from '@/utils/clientUtils';

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
