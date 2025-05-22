
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { TeamMember } from '@/services/types/serviceTypes';
import { addTeamMember, updateTeamMember, removeTeamMember } from '@/services/teamService';

interface TeamMemberFormData {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'salesperson';
}

export const useTeamMemberActions = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMemberFormData>({
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
              queryClient.invalidateQueries({ queryKey: ['team-members'] });
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
          className="bg-red-600 text-white hover:bg-red-700 h-9 rounded-md px-3"
        >
          Delete
        </button>
      ),
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (currentMember.id) {
        // Update existing member
        await updateTeamMember(currentMember.id, {
          first_name: currentMember.first_name,
          last_name: currentMember.last_name,
          email: currentMember.email,
          role: currentMember.role
        });
        
        toast({
          title: "Team member updated",
          description: `${currentMember.first_name} ${currentMember.last_name} has been updated successfully.`,
        });
      } else {
        // Add new member
        await addTeamMember({
          first_name: currentMember.first_name,
          last_name: currentMember.last_name,
          email: currentMember.email,
          role: currentMember.role
        });
        
        toast({
          title: "Team member added",
          description: `${currentMember.first_name} ${currentMember.last_name} has been added successfully.`,
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    currentMember,
    setCurrentMember,
    handleAddNewMember,
    handleEditMember,
    handleDeleteMember,
    handleFormSubmit,
  };
};
