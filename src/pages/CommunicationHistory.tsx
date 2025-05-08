
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProspects, createProspect, setupRealTimeSubscription } from '@/services/supabaseService';
import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CommunicationHistory = () => {
  const queryClient = useQueryClient();
  const { data: prospects = [], isLoading, error, refetch } = useQuery({
    queryKey: ['prospects'],
    queryFn: getProspects,
  });

  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
  });

  // Setup real-time subscriptions
  useEffect(() => {
    // Subscribe to prospect profile changes
    const unsubProfiles = setupRealTimeSubscription('prospect_profile', '*', () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    });
    
    // Subscribe to engagement changes
    const unsubEngagements = setupRealTimeSubscription('prospect_engagement', '*', () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    });
    
    return () => {
      unsubProfiles();
      unsubEngagements();
    };
  }, [queryClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProspect({
        first_name: newLead.firstName,
        last_name: newLead.lastName,
        email: newLead.email,
        company: newLead.company
      });
      
      toast.success(`New lead created: ${newLead.firstName} ${newLead.lastName}`);
      setIsNewLeadDialogOpen(false);
      setNewLead({ firstName: '', lastName: '', email: '', company: '' });
      // Refresh the prospects list
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    } catch (error: any) {
      toast.error(`Failed to create lead: ${error.message}`);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="card p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
          <p className="text-white/70 mb-6">There was a problem loading prospect data from the database.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="pb-4">
        <h1 className="text-3xl font-bold mb-8">Status of Prospects</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Prospect Status Board</h2>
          <ProspectStatusBoard 
            prospects={prospects} 
            isLoading={isLoading} 
            onCreateLead={() => setIsNewLeadDialogOpen(true)} 
          />
        </div>
      </div>

      <Dialog open={isNewLeadDialogOpen} onOpenChange={setIsNewLeadDialogOpen}>
        <DialogContent className="bg-black/80 backdrop-blur-md border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Lead</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateLead}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="text-sm font-medium mb-2 block text-white">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={newLead.firstName}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white focus:ring-white/30"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="text-sm font-medium mb-2 block text-white">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={newLead.lastName}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white focus:ring-white/30"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-2 block text-white">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newLead.email}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white focus:ring-white/30"
                  required
                />
              </div>
              <div>
                <label htmlFor="company" className="text-sm font-medium mb-2 block text-white">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  value={newLead.company}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white focus:ring-white/30"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewLeadDialogOpen(false)}
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-crm-accent hover:bg-crm-accent/90 text-white"
              >
                Create Lead
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunicationHistory;
