
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { 
  getAllTeamMembers, 
  addTeamMember as addTeamMemberService, 
  updateTeamMember as updateTeamMemberService,
  deleteTeamMember as deleteTeamMemberService,
  TeamMember,
  setupRealTimeSubscription
} from '@/services/supabaseService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, User, Mail, Phone, Edit, Trash2, Building } from 'lucide-react';
import { format } from 'date-fns';

const TeamManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'salesperson' as 'admin' | 'salesperson'
  });
  
  const queryClient = useQueryClient();
  
  // Fetch team members using React Query
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: getAllTeamMembers,
  });

  // Setup real-time subscription for team members
  useEffect(() => {
    const unsubTeamMembers = setupRealTimeSubscription('team_members', '*', () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      toast({
        title: "Team updated",
        description: "A team member has been added, updated, or removed.",
      });
    });
    
    return () => {
      unsubTeamMembers();
    };
  }, [queryClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (value: string) => {
    if (value === 'admin' || value === 'salesperson') {
      setFormData({ ...formData, role: value });
    }
  };

  const openAddDialog = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      role: 'salesperson'
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (member: TeamMember) => {
    setCurrentMember(member);
    setFormData({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      role: member.role as 'admin' | 'salesperson'
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (member: TeamMember) => {
    setCurrentMember(member);
    setIsDeleteDialogOpen(true);
  };

  const handleAddTeamMember = async () => {
    try {
      if (!formData.first_name || !formData.last_name || !formData.email) {
        toast({
          title: "Missing information",
          description: "Please fill in all fields.",
          variant: "destructive",
        });
        return;
      }
      
      await addTeamMemberService({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        role: formData.role
      });
      
      toast({
        title: "Team member added",
        description: `${formData.first_name} ${formData.last_name} has been added to the team.`,
      });
      
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error adding team member",
        description: "There was a problem adding the team member.",
        variant: "destructive",
      });
      console.error("Error adding team member:", error);
    }
  };

  const handleUpdateTeamMember = async () => {
    if (!currentMember) return;
    
    try {
      if (!formData.first_name || !formData.last_name || !formData.email) {
        toast({
          title: "Missing information",
          description: "Please fill in all fields.",
          variant: "destructive",
        });
        return;
      }
      
      await updateTeamMemberService(currentMember.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        role: formData.role
      });
      
      toast({
        title: "Team member updated",
        description: `${formData.first_name} ${formData.last_name}'s information has been updated.`,
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error updating team member",
        description: "There was a problem updating the team member's information.",
        variant: "destructive",
      });
      console.error("Error updating team member:", error);
    }
  };

  const handleDeleteTeamMember = async () => {
    if (!currentMember) return;
    
    try {
      await deleteTeamMemberService(currentMember.id);
      
      toast({
        title: "Team member removed",
        description: `${currentMember.first_name} ${currentMember.last_name} has been removed from the team.`,
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error removing team member",
        description: "There was a problem removing the team member.",
        variant: "destructive",
      });
      console.error("Error deleting team member:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Loading team members...</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <Button onClick={openAddDialog}>
          <UserPlus size={16} className="mr-2" />
          Add Team Member
        </Button>
      </div>
      
      {teamMembers.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-lg">
          <User size={64} className="mx-auto text-white/30" />
          <h2 className="text-2xl font-bold mt-6 mb-2">No Team Members Yet</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Add your first team member to start collaborating and managing client relationships together.
          </p>
          <Button onClick={openAddDialog}>
            <UserPlus size={16} className="mr-2" />
            Add Your First Team Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="border-white/10 overflow-hidden">
              <div className={`h-3 ${member.role === 'admin' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>{member.first_name} {member.last_name}</span>
                  <div className="flex space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(member)}>
                      <Edit size={16} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => openDeleteDialog(member)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2 text-white/70" />
                    <span className="text-sm">{member.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Building size={16} className="mr-2 text-white/70" />
                    <span className="text-sm capitalize">{member.role}</span>
                  </div>
                  {member.created_at && (
                    <div className="text-xs text-white/50">
                      Joined: {format(new Date(member.created_at), 'MMMM d, yyyy')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Team Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="salesperson">Salesperson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTeamMember}>Add Team Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Team Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_first_name">First Name</Label>
                <Input
                  id="edit_first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_last_name">Last Name</Label>
                <Input
                  id="edit_last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="salesperson">Salesperson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTeamMember}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Team Member Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Team Member</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to remove {currentMember?.first_name} {currentMember?.last_name} from the team?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTeamMember}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
