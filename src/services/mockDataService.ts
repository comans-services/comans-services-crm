
import { format, subDays } from 'date-fns';

// Types that match our Supabase tables
export interface ProspectProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ProspectEngagement {
  id: string;
  prospect_id: string;
  last_contact_date: string | null;
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

export interface ProspectWithEngagement extends ProspectProfile {
  engagement: ProspectEngagement;
  communications: SalesTracking[];
  daysSinceLastContact: number | null;
  statusColor: string;
  recommendedAction: string;
  company: string;
}

// Mock data generator
const generateMockProspects = (count: number): ProspectWithEngagement[] => {
  const domains = ['acme.com', 'globex.com', 'initech.com', 'umbrella.corp', 'hooli.com'];
  const prospects: ProspectWithEngagement[] = [];

  for (let i = 0; i < count; i++) {
    // Generate random days since last contact (null for some prospects)
    const daysSinceLastContact = Math.random() > 0.1 ? Math.floor(Math.random() * 20) : null;
    const lastContactDate = daysSinceLastContact 
      ? format(subDays(new Date(), daysSinceLastContact), "yyyy-MM-dd'T'HH:mm:ss'Z'")
      : null;
    
    // Determine domain/company
    const domainIndex = i % domains.length;
    const domain = domains[domainIndex];
    
    const firstName = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Jennifer'][i % 8];
    const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'][i % 8];
    const prospectId = `prospect-${i + 1}`;
    
    // Generate communications
    const communicationsCount = Math.floor(Math.random() * 5) + 1;
    const communications: SalesTracking[] = [];
    
    for (let j = 0; j < communicationsCount; j++) {
      const daysAgo = j === 0 && daysSinceLastContact ? daysSinceLastContact : Math.floor(Math.random() * 30) + 1;
      communications.push({
        id: `comm-${i}-${j}`,
        prospect_id: prospectId,
        prospect_first_name: firstName,
        prospect_last_name: lastName,
        salesperson_email: `sales${j % 3 + 1}@ourcrm.com`,
        subject_text: [
          `Follow up on our conversation`, 
          `New product announcement`, 
          `Meeting request`, 
          `Proposal details`,
          `Quarterly update`
        ][j % 5],
        body_text: `Hello ${firstName}, I wanted to follow up on our previous conversation about our services. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor magna at cursus tempus.`,
        date_of_communication: format(subDays(new Date(), daysAgo), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        created_at: format(subDays(new Date(), daysAgo), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        updated_at: format(subDays(new Date(), daysAgo), "yyyy-MM-dd'T'HH:mm:ss'Z'")
      });
    }
    
    // Sort communications by date (newest first)
    communications.sort((a, b) => 
      new Date(b.date_of_communication).getTime() - new Date(a.date_of_communication).getTime()
    );
    
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

    prospects.push({
      id: prospectId,
      first_name: firstName,
      last_name: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      company: domain.split('.')[0],
      created_at: format(subDays(new Date(), 30 + i), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      updated_at: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      engagement: {
        id: `eng-${i + 1}`,
        prospect_id: prospectId,
        last_contact_date: lastContactDate,
        created_at: format(subDays(new Date(), 30), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        updated_at: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'")
      },
      communications,
      daysSinceLastContact,
      statusColor,
      recommendedAction
    });
  }

  return prospects;
};

// Mock data functions that mirror what we'd use with Supabase
export const getMockProspects = (): Promise<ProspectWithEngagement[]> => {
  return Promise.resolve(generateMockProspects(10));
};

export const getMockProspectById = (id: string): Promise<ProspectWithEngagement | null> => {
  const prospects = generateMockProspects(10);
  const prospect = prospects.find(p => p.id === id) || null;
  return Promise.resolve(prospect);
};

// Group prospects by company domain
export const getProspectsByCompany = (): Promise<Record<string, ProspectWithEngagement[]>> => {
  const prospects = generateMockProspects(10);
  const companiesMap: Record<string, ProspectWithEngagement[]> = {};
  
  prospects.forEach(prospect => {
    const company = prospect.company;
    if (!companiesMap[company]) {
      companiesMap[company] = [];
    }
    companiesMap[company].push(prospect);
  });
  
  return Promise.resolve(companiesMap);
};
