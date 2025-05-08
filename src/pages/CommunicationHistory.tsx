
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMockProspects } from '@/services/mockDataService';
import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';

const CommunicationHistory = () => {
  const { data: prospects = [], isLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: getMockProspects,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="pb-4">
        <h1 className="text-3xl font-bold mb-8">Status of Prospects</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Prospect Status Board</h2>
          <ProspectStatusBoard 
            prospects={prospects} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunicationHistory;
