
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProspects, getDealStages } from '@/services/supabaseService';
import ProspectDealBoard from '@/components/prospects/ProspectDealBoard';

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Prospect Deal Board</h1>
      </div>
      
      <ProspectDealBoard 
        prospects={prospects} 
        dealStages={dealStages}
        isLoading={isLoadingProspects || isLoadingStages}
        onCreateLead={handleCreateLead}
      />
    </div>
  );
};

export default KanbanBoard;
