
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';
import { fetchProspects, fetchDealStages } from '@/services/supabaseService';

const CommunicationHistory = () => {
  // Fetch prospects from the database
  const { 
    data: prospects = [], 
    isLoading: isLoadingProspects 
  } = useQuery({
    queryKey: ['prospects'],
    queryFn: fetchProspects
  });
  
  // Fetch deal stages from the database
  const {
    data: dealStages = [],
    isLoading: isLoadingDealStages
  } = useQuery({
    queryKey: ['dealStages'],
    queryFn: fetchDealStages
  });

  const isLoading = isLoadingProspects || isLoadingDealStages;

  return (
    <div className="flex flex-col h-full">
      <div className="pb-4">
        <h1 className="text-3xl font-bold mb-8">Status of Prospects</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Prospect Status Board</h2>
          <ProspectStatusBoard 
            prospects={prospects} 
            dealStages={dealStages}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunicationHistory;
