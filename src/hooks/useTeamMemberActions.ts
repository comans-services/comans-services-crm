
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { removeTeamMember } from '@/services/teamService';
import { TeamMember } from '@/services/types/serviceTypes';

export const useTeamMemberActions = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<{
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'salesperson';
  }>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'salesperson'
  });

  const handleAddNewMember = () => {
    setCurrentMember({
      first_name: '',
      last_name: '',
      email: '',
      role: 'salesperson'
    });
    setIsDialogOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setCurrentMember({
      id: member.id,
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      role: member.role
    });
    setIsDialogOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    // Show confirmation toast
    toast({
      title: "Confirm Deletion",
      description: "Are you sure you want to delete this team member?",
      action: (
        <button 
          onClick={async () => {
            try {
              await removeTeamMember(id);
              toast({
                title: "Team member removed",
                description: "The team member has been removed successfully.",
              });
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
              });
            }
          }}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete
        </button>
      ),
    });
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    currentMember,
    handleAddNewMember,
    handleEditMember,
    handleDeleteMember
  };
};
