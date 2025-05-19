
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TeamHeaderProps {
  onAddMember: () => void;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ onAddMember }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Team Management</h1>
      <Button className="bg-red-600 text-white hover:bg-red-700" onClick={onAddMember}>
        <Plus size={16} className="mr-2" /> Add Team Member
      </Button>
    </div>
  );
};

export default TeamHeader;
