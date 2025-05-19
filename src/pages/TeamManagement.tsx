
import React from 'react';
import TeamHeader from '@/components/team/TeamHeader';
import TeamContent from '@/components/team/TeamContent';
import TeamMemberDialog from '@/components/team/TeamMemberDialog';
import { useTeamData } from '@/hooks/useTeamData';
import { useTeamMemberActions } from '@/hooks/useTeamMemberActions';

const TeamManagement = () => {
  const { 
    teamMembers, 
    activityLog, 
    isLoading, 
    error 
  } = useTeamData();
  
  const { 
    isDialogOpen, 
    setIsDialogOpen,
    currentMember, 
    handleAddNewMember,
    handleEditMember,
    handleDeleteMember
  } = useTeamMemberActions();

  if (isLoading) {
    return <div className="text-center py-10">Loading team data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading data. Please try again.</div>;
  }

  return (
    <div>
      <TeamHeader onAddMember={handleAddNewMember} />
      
      <TeamContent 
        teamMembers={teamMembers}
        activityLog={activityLog}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
      />
      
      <TeamMemberDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentMember={currentMember}
      />
    </div>
  );
};

export default TeamManagement;
