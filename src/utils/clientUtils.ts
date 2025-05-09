
import { ProspectProfile, ProspectWithEngagement } from '@/services/supabaseService';

/**
 * Extracts the domain from an email address
 */
export const extractDomain = (email: string): string => {
  const match = email.match(/@([^@]+)$/);
  return match ? match[1] : '';
};

/**
 * Gets the company name from a domain
 */
export const getDomainCompany = (domain: string): string => {
  return domain.split('.')[0] || '';
};

/**
 * Groups prospects by company domain
 */
export const groupProspectsByDomain = (
  prospects: ProspectWithEngagement[]
): Record<string, ProspectWithEngagement[]> => {
  const companiesMap: Record<string, ProspectWithEngagement[]> = {};
  
  prospects.forEach(prospect => {
    const domain = extractDomain(prospect.email);
    const company = getDomainCompany(domain);
    
    if (!companiesMap[company]) {
      companiesMap[company] = [];
    }
    
    companiesMap[company].push(prospect);
  });
  
  return companiesMap;
};

/**
 * Determines the status color based on days since last contact
 */
export const getStatusColor = (daysSinceLastContact: number | null): string => {
  if (daysSinceLastContact === null) {
    return 'gray';
  } else if (daysSinceLastContact <= 2) {
    return 'green-500';
  } else if (daysSinceLastContact <= 5) {
    return 'yellow-500';
  } else if (daysSinceLastContact <= 10) {
    return 'orange-500';
  } else {
    return 'red-500';
  }
};

/**
 * Determines the recommended action based on days since last contact
 */
export const getRecommendedAction = (daysSinceLastContact: number | null): string => {
  if (daysSinceLastContact === null) {
    return 'Initial contact recommended';
  } else if (daysSinceLastContact <= 2) {
    return 'Follow up next week';
  } else if (daysSinceLastContact <= 5) {
    return 'Follow up this week';
  } else if (daysSinceLastContact <= 10) {
    return 'Follow up today';
  } else {
    return 'Urgent follow up required';
  }
};
