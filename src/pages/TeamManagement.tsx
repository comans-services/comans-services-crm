
import React, { useState } from 'react';
import { User, Edit, Trash2, Plus, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock team members data
const mockTeamMembers = [
  { id: 1, name: 'John Adams', email: 'john@ourcrm.com', role: 'Admin', lastActive: '10 minutes ago' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@ourcrm.com', role: 'Salesperson', lastActive: '2 hours ago' },
  { id: 3, name: 'Mike Williams', email: 'mike@ourcrm.com', role: 'Salesperson', lastActive: '1 day ago' },
  { id: 4, name: 'Lisa Brown', email: 'lisa@ourcrm.com', role: 'Admin', lastActive: '3 minutes ago' },
];

// Mock activity log data
const mockActivityLog = [
  { id: 1, user: 'John Adams', action: 'Added a new client', time: '10 minutes ago' },
  { id: 2, user: 'Sarah Johnson', action: 'Sent a newsletter', time: '2 hours ago' },
  { id: 3, user: 'Mike Williams', action: 'Updated client information', time: '1 day ago' },
  { id: 4, user: 'Lisa Brown', action: 'Deleted a client', time: '2 days ago' },
  { id: 5, user: 'John Adams', action: 'Exported client report', time: '3 days ago' },
];

interface TeamMemberFormData {
  id?: number;
  name: string;
  email: string;
  role: 'Admin' | 'Salesperson';
}

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [activityLog] = useState(mockActivityLog);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMemberFormData>({
    name: '',
    email: '',
    role: 'Salesperson'
  });

  const handleDeleteMember = (id: number) => {
    // Show confirmation toast
    toast({
      title: "Confirm Deletion",
      description: "Are you sure you want to delete this team member?",
      action: (
        <Button 
          onClick={() => {
            setTeamMembers(teamMembers.filter(member => member.id !== id));
            toast({
              title: "Team member removed",
              description: "The team member has been removed successfully.",
            });
          }}
          variant="destructive"
        >
          Delete
        </Button>
      ),
    });
  };

  const handleEditMember = (member: typeof teamMembers[0]) => {
    setCurrentMember({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role as 'Admin' | 'Salesperson'
    });
    setIsDialogOpen(true);
  };

  const handleAddNewMember = () => {
    setCurrentMember({
      name: '',
      email: '',
      role: 'Salesperson'
    });
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentMember.id) {
      // Update existing member
      setTeamMembers(teamMembers.map(member => 
        member.id === currentMember.id ? { 
          ...member, 
          name: currentMember.name,
          email: currentMember.email,
          role: currentMember.role
        } : member
      ));
      
      toast({
        title: "Team member updated",
        description: `${currentMember.name} has been updated successfully.`,
      });
    } else {
      // Add new member
      const newMember = {
        id: teamMembers.length + 1,
        name: currentMember.name,
        email: currentMember.email,
        role: currentMember.role,
        lastActive: 'Just now'
      };
      
      setTeamMembers([...teamMembers, newMember]);
      
      toast({
        title: "Team member added",
        description: `${currentMember.name} has been added successfully.`,
      });
    }
    
    setIsDialogOpen(false);
  };

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
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
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
                        {member.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{member.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.role === 'Admin' ? 'bg-crm-accent/20 text-crm-accent' : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {member.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center text-white/70">
                        <Clock size={14} className="mr-1" /> {member.lastActive}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditMember(member)} className="bg-transparent hover:bg-white/10">
                          <Edit size={14} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteMember(member.id)} className="bg-transparent hover:bg-white/10">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0f133e] text-white border-white/10">
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLog.map((log) => (
                <div key={log.id} className="flex items-start border-b border-white/10 pb-4 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                    <User size={14} />
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">{log.user}</span>{' '}
                      <span className="text-white/70">{log.action}</span>
                    </p>
                    <p className="text-xs text-white/50 mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
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
          
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4 py-2">
              <div className="grid w-full items-center gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  id="name"
                  value={currentMember.name}
                  onChange={(e) => setCurrentMember({...currentMember, name: e.target.value})}
                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white"
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  value={currentMember.email}
                  onChange={(e) => setCurrentMember({...currentMember, email: e.target.value})}
                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white"
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <select
                  id="role"
                  value={currentMember.role}
                  onChange={(e) => setCurrentMember({...currentMember, role: e.target.value as 'Admin' | 'Salesperson'})}
                  className="px-3 py-2 bg-[#0f133e] border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white"
                >
                  <option value="Admin" className="bg-[#0f133e] text-white">Admin</option>
                  <option value="Salesperson" className="bg-[#0f133e] text-white">Salesperson</option>
                </select>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-transparent hover:bg-white/10">
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">{currentMember.id ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
