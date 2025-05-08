
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProspects } from '@/services/supabaseService';
import ProspectStatusBoard from '@/components/prospects/ProspectStatusBoard';

const KanbanBoard = () => {
  const navigate = useNavigate();
  const { data: prospects = [], isLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: getProspects,
  });

  const handleCreateLead = () => {
    navigate('/clients/new');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Prospect Board</h1>
      </div>
      
      <ProspectStatusBoard 
        prospects={prospects} 
        isLoading={isLoading}
        onCreateLead={handleCreateLead}
      />
    </div>
  );
};

export default KanbanBoard;
