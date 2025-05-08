
import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2, Plus, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getTeamMembers, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember, 
  getActivityLogs, 
  setupRealTimeSubscription 
} from '@/services/supabaseService';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface TeamMemberFormData {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'salesperson';
}

const TeamManagement = () => {
  const queryClient = useQueryClient();
  const { data: teamMembers = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: getTeamMembers,
  });

  const { data: activityLogs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: () => getActivityLogs(10),
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMemberFormData>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'salesperson'
  });

  // Setup real-time subscriptions
  useEffect(() => {
    // Subscribe to app_user changes
    const unsubUsers = setupRealTimeSubscription('app_user', '*', () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    });
    
    // Subscribe to sales_tracking changes
    const unsubActivity = setupRealTimeSubscription('sales_tracking', '*', () => {
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    });
    
    return () => {
      unsubUsers();
      unsubActivity();
    };
  }, [queryClient]);

  const handleDeleteMember = (id: string) => {
    // Show confirmation toast
    toast("Confirm Deletion", {
      description: "Are you sure you want to delete this team member?",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteTeamMember(id);
            toast.success("Team member removed successfully");
          } catch (error: any) {
            toast.error(`Error: ${error.message}`);
          }
        }
      }
    });
  };

  const handleEditMember = (member: any) => {
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
        
        toast.success(`${currentMember.first_name} ${currentMember.last_name} has been updated successfully`);
      } else {
        // Add new member
        await createTeamMember({
          first_name: currentMember.first_name,
          last_name: currentMember.last_name,
          email: currentMember.email,
          role: currentMember.role
        });
        
        toast.success(`${currentMember.first_name} ${currentMember.last_name} has been added successfully`);
      }
      
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  // Function to format last active time
  const formatLastActive = (lastActive: string | null) => {
    if (!lastActive) return "Never active";
    
    return formatDistanceToNow(new Date(lastActive), { addSuffix: true });
  };

  // Function to get action text from activity log
  const getActionText = (log: any) => {
    // Basic logic to determine action type based on subject
    const subject = log.subject_text.toLowerCase();
    const prospect = log.prospect ? `${log.prospect.first_name} ${log.prospect.last_name}` : "a client";
    
    if (subject.includes('welcome') || subject.includes('introduction')) {
      return `Added ${prospect}`;
    } else if (subject.includes('update') || subject.includes('changed')) {
      return `Updated ${prospect} information`;
    } else if (subject.includes('delete') || subject.includes('removed')) {
      return `Deleted ${prospect}`;
    } else if (subject.includes('newsletter')) {
      return `Sent a newsletter`;
    } else if (subject.includes('export')) {
      return `Exported client report`;
    } else {
      return `Contacted ${prospect}`;
    }
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
            {isLoadingMembers ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
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
                  {teamMembers.map((member: any) => (
                    <TableRow key={member.id} className="border-white/10">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
                            <User size={14} />
                          </div>
                          {`${member.first_name} ${member.last_name}`}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{member.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.role === 'admin' ? 'bg-crm-accent/20 text-crm-accent' : 'bg-blue-500/20 text-blue-500'
                        }`}>
                          {member.role === 'admin' ? 'Admin' : 'Salesperson'}
                        </span>
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="flex items-center text-white/70">
                          <Clock size={14} className="mr-1" /> {formatLastActive(member.last_active)}
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
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-[#0f133e] text-white border-white/10">
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingLogs ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {activityLogs.map((log: any) => {
                  // Extract the email username (part before @)
                  const userEmail = log.salesperson_email;
                  const userName = userEmail ? userEmail.split('@')[0].split('.').map((part: string) => 
                    part.charAt(0).toUpperCase() + part.slice(1)
                  ).join(' ') : 'Unknown User';
                  
                  return (
                    <div key={log.id} className="flex items-start border-b border-white/10 pb-4 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                        <User size={14} />
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">{userName}</span>{' '}
                          <span className="text-white/70">{getActionText(log)}</span>
                        </p>
                        <p className="text-xs text-white/50 mt-1">
                          {formatDistanceToNow(new Date(log.date_of_communication), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={currentMember.first_name}
                  onChange={(e) => setCurrentMember({...currentMember, first_name: e.target.value})}
                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white"
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={currentMember.last_name}
                  onChange={(e) => setCurrentMember({...currentMember, last_name: e.target.value})}
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
                  onChange={(e) => setCurrentMember({...currentMember, role: e.target.value as 'admin' | 'salesperson'})}
                  className="px-3 py-2 bg-[#0f133e] border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white"
                >
                  <option value="admin" className="bg-[#0f133e] text-white">Admin</option>
                  <option value="salesperson" className="bg-[#0f133e] text-white">Salesperson</option>
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
