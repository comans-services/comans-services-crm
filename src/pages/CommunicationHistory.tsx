
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProspects } from '@/services/supabaseService';
import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';

const CommunicationHistory = () => {
  const { data: prospects = [], isLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: getProspects,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="pb-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Status of Prospects</h1>
        </div>
        
        <div className="card bg-black/40 backdrop-blur-sm border border-white/10 p-4">
          <ProspectStatusBoard 
            prospects={prospects} 
            isLoading={isLoading} 
            onCreateLead={() => {}} 
          />
        </div>
      </div>
    </div>
  );
};

export default CommunicationHistory;
