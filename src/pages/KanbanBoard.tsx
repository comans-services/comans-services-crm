
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProspects, getDealStages } from '@/services/supabaseService';
import ProspectDealBoard from '@/components/prospects/ProspectDealBoard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const KanbanBoard = () => {
  const navigate = useNavigate();
  
  const { data: prospects = [], isLoading: isLoadingProspects } = useQuery({
    queryKey: ['prospects'],
    queryFn: getProspects,
  });
  
  const { data: dealStages = [], isLoading: isLoadingStages } = useQuery({
    queryKey: ['dealStages'],
    queryFn: getDealStages,
  });

  const handleCreateLead = () => {
    navigate('/clients/new');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Prospect Board</h1>
        <Button 
          onClick={handleCreateLead}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-1" size={16} />
          Create Lead
        </Button>
      </div>
      
      <div className="card bg-black/40 backdrop-blur-sm border border-white/10 p-4">
        <ProspectDealBoard 
          prospects={prospects} 
          dealStages={dealStages}
          isLoading={isLoadingProspects || isLoadingStages}
          onCreateLead={handleCreateLead}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
