
import React, { useState, useEffect } from 'react';
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
import { getTeamMembers, addTeamMember, updateTeamMember, removeTeamMember, getUserActivity, setupRealTimeSubscription } from '@/services/supabaseService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

interface TeamMemberFormData {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

const TeamManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMemberFormData>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'Salesperson'
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
      role: 'Salesperson'
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
                  <TableHead className="text-white">Created At</TableHead>
                  <TableHead className="text-white">Updated At</TableHead>
                  <TableHead className="text-right text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(teamMembers) && teamMembers.map((member) => (
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
                        member.role === 'Admin' ? 'bg-crm-accent/20 text-crm-accent' : 'bg-blue-500/20 text-blue-500'
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
                    <TableCell className="text-white">
                      {member.created_at ? format(new Date(member.created_at), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-white">
                      {member.updated_at ? format(new Date(member.updated_at), 'MMM d, yyyy') : 'N/A'}
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
              {Array.isArray(activityLog) && activityLog.length > 0 ? activityLog.map((log) => (
                <div key={log.id} className="flex items-start border-b border-white/10 pb-4 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                    <User size={14} />
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">
                        {log.app_user?.first_name} {log.app_user?.last_name}
                      </span>{' '}
                      <span className="text-white/70">{log.activity_type}</span>
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      {formatTimeAgo(new Date(log.occurred_at))}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-white/50">
                  No activity recorded yet
                </div>
              )}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="text-sm font-medium mb-2 block text-white">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={currentMember.first_name}
                    onChange={(e) => setCurrentMember({...currentMember, first_name: e.target.value})}
                    className="px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="text-sm font-medium mb-2 block text-white">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={currentMember.last_name}
                    onChange={(e) => setCurrentMember({...currentMember, last_name: e.target.value})}
                    className="px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-2 block text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={currentMember.email}
                  onChange={(e) => setCurrentMember({...currentMember, email: e.target.value})}
                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="text-sm font-medium mb-2 block text-white">
                  Role
                </label>
                <select
                  id="role"
                  value={currentMember.role}
                  onChange={(e) => setCurrentMember({...currentMember, role: e.target.value})}
                  className="px-3 py-2 bg-[#0f133e] border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-crm-accent/50 text-white w-full"
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

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return format(date, 'MMM d, yyyy');
}

export default TeamManagement;
