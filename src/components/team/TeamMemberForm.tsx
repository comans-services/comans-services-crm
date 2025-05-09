
import React from 'react';
import { Button } from '@/components/ui/button';
import { TeamMember } from '@/services/supabaseService';

interface TeamMemberFormProps {
  currentMember: {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    role: "admin" | "salesperson";
  };
  setCurrentMember: React.Dispatch<React.SetStateAction<{
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    role: "admin" | "salesperson";
  }>>;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  currentMember,
  setCurrentMember,
  onCancel,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="text-sm font-medium mb-2 block text-white">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              value={currentMember.first_name}
              onChange={(e) => setCurrentMember({...currentMember, first_name: e.target.value})}
              className="px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="last_name" className="text-sm font-medium mb-2 block text-white">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              value={currentMember.last_name}
              onChange={(e) => setCurrentMember({...currentMember, last_name: e.target.value})}
              className="px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white w-full"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium mb-2 block text-white">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={currentMember.email}
            onChange={(e) => setCurrentMember({...currentMember, email: e.target.value})}
            className="px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="text-sm font-medium mb-2 block text-white">
            Role
          </label>
          <select
            id="role"
            value={currentMember.role}
            onChange={(e) => setCurrentMember({...currentMember, role: e.target.value as "admin" | "salesperson"})}
            className="px-3 py-2 bg-[#0f133e] border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white w-full"
          >
            <option value="admin" className="bg-[#0f133e] text-white">Admin</option>
            <option value="salesperson" className="bg-[#0f133e] text-white">Salesperson</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="bg-transparent hover:bg-white/10">
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">
          {currentMember.id ? 'Update' : 'Add'}
        </Button>
      </div>
    </form>
  );
};

export default TeamMemberForm;
