
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMockProspects } from '@/services/mockDataService';
import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
        <h1 className="text-3xl font-bold mb-8">Communication History</h1>
        
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Lead</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateLead}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="text-sm font-medium mb-2 block">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={newLead.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="text-sm font-medium mb-2 block">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={newLead.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-2 block">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={newLead.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="company" className="text-sm font-medium mb-2 block">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  value={newLead.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsNewLeadDialogOpen(false)}
                className="px-4 py-2 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Lead
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunicationHistory;
