
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMockProspects } from '@/services/mockDataService';
import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';

const CommunicationHistory = () => {
  const { data: prospects = [], isLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: getMockProspects,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Communication History</h1>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Prospect Status Board</h2>
        <ProspectStatusBoard prospects={prospects} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default CommunicationHistory;
