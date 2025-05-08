import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProspects, fetchDealStages } from '@/services/supabaseService';
import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';

const StatusOfProspect: React.FC = () => {
  // Fetch prospects and deal stages data
  const { 
    data: prospects = [], 
    isLoading: isLoadingProspects, 
    error: prospectsError 
  } = useQuery({
    queryKey: ['prospects'],
    queryFn: fetchProspects,
  });

  const { 
    data: dealStages = [], 
    isLoading: isLoadingDealStages, 
    error: dealStagesError 
  } = useQuery({
    queryKey: ['dealStages'],
    queryFn: fetchDealStages,
  });

  // Combined loading / error states
  const isLoading = isLoadingProspects || isLoadingDealStages;
  const error = prospectsError || dealStagesError;

  if (error) {
    console.error('Error loading data:', error);
    return (
      <div className="p-8 text-red-500">
        Sorry – there was a problem loading prospect data.
      </div>
    );
  }

  console.log('Prospects:', prospects.length, 'Deal Stages:', dealStages.length);

  return (
    <div className="flex flex-col h-full bg-[#10121F]">
      <div className="pb-4">
        <h1 className="text-4xl font-bold mb-8 text-white">Status of Prospects</h1>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-white">Prospect Status Board</h2>
          
          {/* Use the existing ProspectStatusBoard component */}
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

export default StatusOfProspect;
