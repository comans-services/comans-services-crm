
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TeamMemberForm from '@/components/team/TeamMemberForm';
import { addTeamMember, updateTeamMember } from '@/services/teamService';
import { TeamMember } from '@/services/types/serviceTypes';

interface TeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentMember: {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'salesperson';
  };
}

const TeamMemberDialog: React.FC<TeamMemberDialogProps> = ({ 
  isOpen,
  onClose,
  currentMember
}) => {
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
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          onClose={onClose}
          onSubmit={handleFormSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberDialog;
