
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProspects, getDealStages } from '@/services/supabaseService';
import ProspectDealBoard from '@/components/prospects/ProspectDealBoard';

const KanbanBoard = () => {
  const { data: prospects = [], isLoading: isLoadingProspects } = useQuery({
    queryKey: ['prospects'],
    queryFn: getProspects,
  });
  
  const { data: dealStages = [], isLoading: isLoadingStages } = useQuery({
    queryKey: ['dealStages'],
    queryFn: getDealStages,
  });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Status of Prospects</h1>
      
      <h2 className="text-2xl font-semibold mb-6">Prospect Status Board</h2>
      
      <div className="bg-[#0C0E24] rounded-xl p-4 overflow-x-auto">
        <ProspectDealBoard 
          prospects={prospects} 
          dealStages={dealStages}
          isLoading={isLoadingProspects || isLoadingStages}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
