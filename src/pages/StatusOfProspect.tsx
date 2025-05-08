
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';
import { fetchProspects, fetchDealStages } from '@/services/supabaseService';
import { toast } from 'sonner';

const StatusOfProspect: React.FC = () => {
  // Prospects
  const {
    data: prospects = [],
    isLoading: isLoadingProspects,
    error: prospectsError,
  } = useQuery({
    queryKey: ['prospects'],
    queryFn: fetchProspects,
  });

  // Deal stages
  const {
    data: dealStages = [],
    isLoading: isLoadingDealStages,
    error: dealStagesError,
  } = useQuery({
    queryKey: ['dealStages'],
    queryFn: fetchDealStages,
  });

  // Combined loading / error states
  const isLoading = isLoadingProspects || isLoadingDealStages;
  const error = prospectsError || dealStagesError;

  if (error) {
    toast.error('Failed to load prospects data');
    return (
      <div className="p-8 text-red-500">
        Sorry – there was a problem loading your data.
      </div>
    );
  }

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

export default StatusOfProspect;
