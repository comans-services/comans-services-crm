// src/pages/StatusOfProspect.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';
import {
  fetchProspects,
  fetchDealStages,
  type Prospect,
  type DealStage,
} from '@/services/supabaseService';

/**
 * Status-of-Prospects page
 * — Fetches prospects & deal stages from Supabase
 * — Surfaces any fetch errors to the user
 * — Hands the data off to <ProspectStatusBoard />
 */
const StatusOfProspect: React.FC = () => {
  /* ───────── Prospects ───────── */
  const {
    data: prospects = [],
    isLoading: isLoadingProspects,
    error: prospectsError,
  } = useQuery<Prospect[], Error>({
    queryKey: ['prospects'],
    queryFn: fetchProspects,
  });

  /* ───────── Deal stages ─────── */
  const {
    data: dealStages = [],
    isLoading: isLoadingDealStages,
    error: dealStagesError,
  } = useQuery<DealStage[], Error>({
    queryKey: ['dealStages'],
    queryFn: fetchDealStages,
  });

  /* ───────── Combined state ──── */
  const isLoading = isLoadingProspects || isLoadingDealStages;
  const error = prospectsError || dealStagesError;

  /* ───────── Error surface ───── */
  if (error) {
    toast.error('Failed to load prospect data');
    return (
      <section className="p-8 text-red-500">
        Sorry — there was a problem loading your data.
      </section>
    );
  }

  /* ───────── Render ──────────── */
  return (
    <section className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-8">Status of Prospects</h1>

      <h2 className="text-xl font-semibold mb-4">Prospect Status Board</h2>
      <ProspectStatusBoard
        prospects={prospects}
        dealStages={dealStages}
        isLoading={isLoading}
      />
    </section>
  );
};

export default StatusOfProspect;
