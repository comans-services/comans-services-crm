
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMockProspects } from '@/services/mockDataService';
import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CommunicationHistory = () => {
  const { data: prospects = [], isLoading, refetch } = useQuery({
    queryKey: ['prospects'],
    queryFn: getMockProspects,
  });

  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create the lead in the backend
    toast.success(`New lead created: ${newLead.firstName} ${newLead.lastName}`);
    setIsNewLeadDialogOpen(false);
    setNewLead({ firstName: '', lastName: '', email: '', company: '' });
    // Refresh the prospects list
    refetch();
  };

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
