
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTeamMembers, addTeamMember, updateTeamMember, removeTeamMember, getUserActivity, setupRealTimeSubscription } from '@/services/teamService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TeamMembersTable from '@/components/team/TeamMembersTable';
import ActivityLog from '@/components/team/ActivityLog';
import TeamMemberForm from '@/components/team/TeamMemberForm';
import { TeamMember } from '@/services/types/serviceTypes';

const TeamManagement = () => {
  const queryClient = useQueryClient();
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

  // Fetch team members
  const { 
    data: teamMembers = [], 
    isLoading: isLoadingTeam,
    error: teamError
  } = useQuery({
    queryKey: ['team-members'],
    queryFn: getTeamMembers
  });

  // Fetch activity logs
  const { 
    data: activityLog = [], 
    isLoading: isLoadingActivity,
    error: activityError
  } = useQuery({
    queryKey: ['user-activity'],
    queryFn: () => getUserActivity(10)
  });

  // Set up real-time subscriptions
  useEffect(() => {
    const unsubTeam = setupRealTimeSubscription('app_user', '*', () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    });
    
    const unsubActivity = setupRealTimeSubscription('user_activity', '*', () => {
      queryClient.invalidateQueries({ queryKey: ['user-activity'] });
    });
    
    return () => {
      unsubTeam();
      unsubActivity();
    };
  }, [queryClient]);

  const handleDeleteMember = (id: string) => {
    // Show confirmation toast
    toast({
      title: "Confirm Deletion",
      description: "Are you sure you want to delete this team member?",
      action: (
        <Button 
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
          variant="destructive"
        >
          Delete
        </Button>
      ),
    });
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

  const handleAddNewMember = () => {
    setCurrentMember({
      first_name: '',
      last_name: '',
      email: '',
      role: 'salesperson'
    });
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (member: any) => {
    try {
      if (member.id) {
        // Update existing member
        await updateTeamMember(member.id, {
          first_name: member.first_name,
          last_name: member.last_name,
          email: member.email,
          role: member.role
        });
        
        toast({
          title: "Team member updated",
          description: `${member.first_name} ${member.last_name} has been updated successfully.`,
        });
      } else {
        // Add new member
        await addTeamMember({
          first_name: member.first_name,
          last_name: member.last_name,
          email: member.email,
          role: member.role
        });
        
        toast({
          title: "Team member added",
          description: `${member.first_name} ${member.last_name} has been added successfully.`,
        });
      }
      
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoadingTeam || isLoadingActivity) {
    return <div className="text-center py-10">Loading team data...</div>;
  }

  if (teamError || activityError) {
    return <div className="text-center py-10 text-red-500">Error loading data. Please try again.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleAddNewMember}>
          <Plus size={16} className="mr-2" /> Add Team Member
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <Card className="bg-[#0f133e] text-white border-white/10">
          <TeamMembersTable 
            teamMembers={teamMembers}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
          />
        </Card>
        
        <Card className="bg-[#0f133e] text-white border-white/10">
          <ActivityLog activityLog={activityLog} />
        </Card>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0f133e] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>{currentMember.id ? 'Edit' : 'Add'} Team Member</DialogTitle>
            <DialogDescription className="text-white/70">
              {currentMember.id 
                ? 'Update team member information below.' 
                : 'Fill in the information below to add a new team member.'}
            </DialogDescription>
          </DialogHeader>
          
          <TeamMemberForm 
            initialMember={currentMember} 
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
