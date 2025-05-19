
import React from 'react';
import { Card } from '@/components/ui/card';
import TeamMembersTable from '@/components/team/TeamMembersTable';
import ActivityLog from '@/components/team/ActivityLog';
import { TeamMember } from '@/services/types/serviceTypes';

interface TeamContentProps {
  teamMembers: TeamMember[];
  activityLog: any[];
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
}

const TeamContent: React.FC<TeamContentProps> = ({
  teamMembers,
  activityLog,
  onEdit,
  onDelete
}) => {
  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="bg-[#0f133e] text-white border-white/10">
        <TeamMembersTable 
          teamMembers={teamMembers}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Card>
      
      <Card className="bg-[#0f133e] text-white border-white/10">
        <ActivityLog activityLog={activityLog} />
      </Card>
    </div>
  );
};

export default TeamContent;
