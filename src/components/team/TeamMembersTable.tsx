
import React from 'react';
import { User, Edit, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTimeAgo } from '@/utils/dateUtils';
import { TeamMember } from '@/services/types/serviceTypes';

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({ 
  teamMembers, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/10">
          <TableHead className="text-white">Name</TableHead>
          <TableHead className="text-white">Email</TableHead>
          <TableHead className="text-white">Role</TableHead>
          <TableHead className="text-white">Last Active</TableHead>
          <TableHead className="text-right text-white">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teamMembers.map((member) => (
          <TableRow key={member.id} className="border-white/10">
            <TableCell className="font-medium text-white">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
                  <User size={14} />
                </div>
                {member.first_name} {member.last_name}
              </div>
            </TableCell>
            <TableCell className="text-white">{member.email}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                member.role === 'admin' ? 'bg-crm-accent/20 text-crm-accent' : 'bg-blue-500/20 text-blue-500'
              }`}>
                {member.role}
              </span>
            </TableCell>
            <TableCell className="text-white">
              <div className="flex items-center text-white/70">
                <Clock size={14} className="mr-1" /> 
                {member.last_active 
                  ? formatTimeAgo(new Date(member.last_active))
                  : 'Never'}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(member)} className="bg-transparent hover:bg-white/10">
                  <Edit size={14} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(member.id)} className="bg-transparent hover:bg-white/10">
                  <Trash2 size={14} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TeamMembersTable;
