
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

interface ClientsErrorProps {
  error: Error | null;
  queryKey?: string[];
}

const ClientsError = ({ error, queryKey = ['prospects'] }: ClientsErrorProps) => {
  const queryClient = useQueryClient();

  if (!error) return null;

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-red-500 mb-2">Error loading data</h2>
      <p className="text-white/70">{error.message || 'Unknown error occurred'}</p>
      <Button 
        onClick={() => queryClient.invalidateQueries({ queryKey })} 
        className="mt-4">
        Retry
      </Button>
    </div>
  );
};

export default ClientsError;
