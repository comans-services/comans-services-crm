
import { ProspectProfile } from './types';

export interface ProspectWithEngagement extends ProspectProfile {
  engagement: {
    id: string;
    prospect_id: string;
    last_contact_date: string | null;
    engagement_stage_id?: string;
  };
  communications: Array<{
    id: string;
    subject_text: string;
    body_text?: string;
    salesperson_email: string;
    date_of_communication: string;
  }>;
  daysSinceLastContact: number | null;
  statusColor: string;
  recommendedAction: string;
  dragId?: string;
}

export const getMockProspects = async (): Promise<ProspectWithEngagement[]> => {
  // This is a mock implementation
  return [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      company: 'Acme Corp',
      phone: '123-456-7890',
      created_at: '2023-01-15T08:00:00Z',
      updated_at: '2023-01-15T08:00:00Z',
      engagement: {
        id: 'e1',
        prospect_id: '1',
        last_contact_date: '2023-04-10T10:30:00Z',
      },
      communications: [
        {
          id: 'c1',
          subject_text: 'Initial Outreach',
          body_text: 'Hello John, I wanted to reach out regarding our services...',
          salesperson_email: 'sales@ourcompany.com',
          date_of_communication: '2023-04-10T10:30:00Z',
        }
      ],
      daysSinceLastContact: 7,
      statusColor: 'green',
      recommendedAction: 'Follow up next week',
    },
    {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      company: 'Tech Solutions',
      phone: '987-654-3210',
      created_at: '2023-02-20T09:15:00Z',
      updated_at: '2023-02-20T09:15:00Z',
      engagement: {
        id: 'e2',
        prospect_id: '2',
        last_contact_date: '2023-03-25T14:45:00Z',
      },
      communications: [
        {
          id: 'c2',
          subject_text: 'Product Demo Follow-up',
          body_text: 'Hi Jane, thank you for attending our demo yesterday...',
          salesperson_email: 'demos@ourcompany.com',
          date_of_communication: '2023-03-25T14:45:00Z',
        }
      ],
      daysSinceLastContact: 14,
      statusColor: 'yellow',
      recommendedAction: 'Send proposal',
    }
  ];
};
