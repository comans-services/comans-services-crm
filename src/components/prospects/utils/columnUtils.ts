
import { ProspectWithEngagement } from '@/services/supabaseService';
import { v4 as uuidv4 } from 'uuid';

export type StatusColumn = {
  id: string;
  title: string;
  prospects: ProspectWithEngagement[];
}

// Define status columns
export const getInitialColumns = (): StatusColumn[] => [
  {
    id: 'new-lead',
    title: 'New Lead',
    prospects: []
  },
  {
    id: 'contacted',
    title: 'Contacted',
    prospects: []
  },
  {
    id: 'meeting-scheduled',
    title: 'Meeting Scheduled',
    prospects: []
  },
  {
    id: 'qualified',
    title: 'Qualified',
    prospects: []
  },
  {
    id: 'proposal-sent',
    title: 'Proposal Sent',
    prospects: []
  },
  {
    id: 'closed-won',
    title: 'Closed Won',
    prospects: []
  },
  {
    id: 'closed-lost',
    title: 'Closed Lost',
    prospects: []
  }
];

// Ensure each prospect has a unique draggable ID
export const ensureUniqueIds = (prospects: ProspectWithEngagement[]): ProspectWithEngagement[] => {
  return prospects.map(prospect => {
    return { 
      ...prospect, 
      dragId: `drag-${prospect.id}` 
    };
  });
};

// Distribute prospects among statuses based on engagement data
export const distributeProspects = (prospects: ProspectWithEngagement[]): StatusColumn[] => {
  const columns = [...getInitialColumns()];
  const uniqueProspects = ensureUniqueIds(prospects);
  
  uniqueProspects.forEach(prospect => {
    const daysSinceLastContact = prospect.daysSinceLastContact;
    let statusId: string;
    
    // Logic to distribute prospects based on days since last contact
    if (daysSinceLastContact === null) {
      statusId = 'new-lead';
    } else if (daysSinceLastContact <= 2) {
      statusId = 'contacted';
    } else if (daysSinceLastContact <= 5) {
      statusId = 'meeting-scheduled';
    } else if (daysSinceLastContact <= 7) {
      statusId = 'qualified';
    } else if (daysSinceLastContact <= 10) {
      statusId = 'proposal-sent';
    } else if (daysSinceLastContact <= 15) {
      statusId = 'closed-won';
    } else {
      statusId = 'closed-lost';
    }
    
    const column = columns.find(col => col.id === statusId);
    if (column) {
      column.prospects.push(prospect);
    }
  });
  
  return columns;
};
