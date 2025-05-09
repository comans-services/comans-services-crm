
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getTeamMembers, 
  addTeamMember, 
  updateTeamMember, 
  removeTeamMember, 
  setupRealTimeSubscription,
  TeamMember
} from '@/services/supabaseService';
import { 
  Button, 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast
} from '@/components/ui';
import { Check, Edit2, Trash2, UserPlus, X, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

// Form schema for team member
const teamMemberSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(['admin', 'salesperson'], {
    required_error: "Please select a role",
  }),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

const TeamManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch team members data
  const { data: teamMembers = [], isLoading, error } = useQuery({
    queryKey: ['team-members'],
    queryFn: getTeamMembers,
  });

  // Form for adding new team member
  const addForm = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: 'salesperson',
    },
  });

  // Form for editing team member
  const editForm = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: 'salesperson',
    },
  });

  // Set up real-time subscription for app_user table
  useEffect(() => {
    const unsubscribe = setupRealTimeSubscription('app_user', '*', (payload) => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: 'Team updated',
        description: 'Team members data has been updated.',
        variant: 'default',
      });
    });
    
    return () => {
      unsubscribe();
    };
  }, [queryClient, toast]);

  // Handle add team member form submission
  const onAddSubmit = async (data: TeamMemberFormValues) => {
    try {
      await addTeamMember(data);
      toast({
        title: 'Team member added',
        description: `${data.first_name} ${data.last_name} has been added to the team.`,
        variant: 'default',
      });
      setIsAddDialogOpen(false);
      addForm.reset();
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to add team member. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle edit team member form submission
  const onEditSubmit = async (data: TeamMemberFormValues) => {
    if (!currentMember) return;
    
    try {
      await updateTeamMember(currentMember.id, data);
      toast({
        title: 'Team member updated',
        description: `${data.first_name} ${data.last_name}'s information has been updated.`,
        variant: 'default',
      });
      setIsEditDialogOpen(false);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to update team member. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle delete team member
  const handleDeleteMember = async () => {
    if (!currentMember) return;
    
    try {
      await removeTeamMember(currentMember.id);
      toast({
        title: 'Team member removed',
        description: `${currentMember.first_name} ${currentMember.last_name} has been removed from the team.`,
        variant: 'default',
      });
      setIsDeleteDialogOpen(false);
      setCurrentMember(null);
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    } catch (error) {
      console.error('Error removing team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove team member. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Open edit dialog and populate form with member data
  const handleEditMember = (member: TeamMember) => {
    setCurrentMember(member);
    editForm.reset({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      role: member.role,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteConfirm = (member: TeamMember) => {
    setCurrentMember(member);
    setIsDeleteDialogOpen(true);
  };

  // Filter team members based on active tab
  const filteredMembers = teamMembers.filter(member => {
    if (activeTab === 'all') return true;
    return member.role === activeTab;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading team data...</div>;
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Error Loading Team Data</h2>
        <p className="text-white/70 mb-6">There was a problem loading team data from the database.</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['team-members'] })}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-white/10">
          <TabsTrigger value="all" className="data-[state=active]:bg-crm-accent">All</TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-crm-accent">Admins</TabsTrigger>
          <TabsTrigger value="salesperson" className="data-[state=active]:bg-crm-accent">Salespeople</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-4 font-medium">Name</th>
                <th className="text-left py-4 px-4 font-medium">Email</th>
                <th className="text-left py-4 px-4 font-medium">Role</th>
                <th className="text-left py-4 px-4 font-medium">Last Active</th>
                <th className="text-right py-4 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/70">
                    No team members found. Add your first team member to get started.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">{member.first_name} {member.last_name}</td>
                    <td className="py-4 px-4">{member.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.role === 'admin' ? 'bg-crm-accent text-white' : 'bg-white/10 text-white'
                      }`}>
                        {member.role === 'admin' ? 'Admin' : 'Salesperson'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {member.last_active ? 
                        format(new Date(member.last_active), 'MMM d, yyyy HH:mm') : 
                        'Not logged in yet'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditMember(member)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(member)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Team Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to your CRM system.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={addForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="salesperson">Salesperson</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Admins can manage team members and access all features.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Team Member</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Team Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update team member information.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="salesperson">Salesperson</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {currentMember?.first_name} {currentMember?.last_name} from the team?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
