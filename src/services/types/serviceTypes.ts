
// Create TeamMember type declaration
export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'salesperson';
  created_at?: string;
  updated_at?: string;
  last_active?: string;
}
