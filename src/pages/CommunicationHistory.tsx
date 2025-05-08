
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';

const CommunicationHistory = () => {
  // We will pass empty array as default prospects and let the component fetch them
  const prospects = [];
  const isLoading = false;

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
