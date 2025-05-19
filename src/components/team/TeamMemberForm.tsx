
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from "@/components/ui/dialog";
import { TeamMember } from '@/services/types/serviceTypes';

interface TeamMemberFormProps {
  initialMember: {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'salesperson';
  };
  onClose: () => void;
  onSubmit: (member: any) => Promise<void>;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ 
  initialMember, 
  onClose, 
  onSubmit 
}) => {
  const [member, setMember] = useState(initialMember);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMember({ ...member, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(member);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="text-sm font-medium mb-2 block text-white">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              value={member.first_name}
              onChange={handleChange}
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
              value={member.last_name}
              onChange={handleChange}
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
            value={member.email}
            onChange={handleChange}
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
            value={member.role}
            onChange={handleChange}
            className="px-3 py-2 bg-[#0f133e] border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white w-full"
          >
            <option value="admin" className="bg-[#0f133e] text-white">admin</option>
            <option value="salesperson" className="bg-[#0f133e] text-white">salesperson</option>
          </select>
        </div>
      </div>
      
      <DialogFooter className="mt-4">
        <Button type="button" variant="outline" onClick={onClose} className="bg-transparent hover:bg-white/10">
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">
          {member.id ? 'Update' : 'Add'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default TeamMemberForm;
