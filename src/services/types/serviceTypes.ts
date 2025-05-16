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
  is_deleted?: boolean;
  deleted_at?: string;
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
