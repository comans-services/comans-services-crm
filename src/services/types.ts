
// Type definitions for the data models

export interface ProspectProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  phone?: string;
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
  subject_text: string;
  body_text?: string;
  salesperson_email: string;
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
}

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'salesperson';
  last_active: string | null;
  created_at: string;
  updated_at: string;
}
