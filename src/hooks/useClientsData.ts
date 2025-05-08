
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProspects, getProspectsByCompany, Prospect } from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useClientsData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch clients data using React Query
  const { 
    data: clients = [], 
    isLoading: isLoadingClients, 
    error: clientsError 
  } = useQuery({
    queryKey: ['prospects'],
    queryFn: fetchProspects,
    staleTime: 0, // Don't use cache, always fetch fresh data
    retry: 3, // Retry failed requests up to 3 times
    meta: {
      onSuccess: (data: any) => {
        console.log('Successfully fetched clients data:', data);
      },
      onError: (err: any) => {
        console.error('Error fetching clients data:', err);
        toast.error('Failed to load clients data');
      }
    }
  });
  
  // Fetch companies data using React Query
  const { 
    data: companiesMap = {}, 
    isLoading: isLoadingCompanies, 
    error: companiesError 
  } = useQuery({
    queryKey: ['companies'],
    queryFn: getProspectsByCompany,
    staleTime: 0, // Don't use cache
    retry: 3, // Retry failed requests
    meta: {
      onSuccess: (data: any) => {
        console.log('Successfully fetched companies data:', data);
      },
      onError: (err: any) => {
        console.error('Error fetching companies data:', err);
        toast.error('Failed to load companies data');
      }
    }
  });

  // Set up real-time subscription to prospect_profile table
  useEffect(() => {
    const channel = supabase
      .channel('prospect-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'prospect_profile' 
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['prospects'] });
          queryClient.invalidateQueries({ queryKey: ['companies'] });
          
          // Show toast notification based on the event type
          if (payload.eventType === 'INSERT') {
            toast.success('New client added');
          } else if (payload.eventType === 'UPDATE') {
            toast.success('Client information updated');
          } else if (payload.eventType === 'DELETE') {
            toast.info('Client removed');
          }
        }
      )
      .subscribe();

    // Log when the subscription is set up
    console.log('Supabase real-time channel subscribed');

    // Debug the Supabase connection on component mount
    supabase.auth.getSession().then(({ data }) => {
      console.log('Current Supabase session:', data.session ? 'Active' : 'None');
    });

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
      console.log('Supabase real-time channel unsubscribed');
    };
  }, [queryClient]);

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Debug logs for filtered clients
  useEffect(() => {
    console.log('Filtered clients:', filteredClients);
    console.log('Total clients count:', clients.length);
  }, [filteredClients, clients]);

  return {
    clients,
    filteredClients,
    companiesMap,
    searchTerm,
    setSearchTerm,
    isLoadingClients,
    isLoadingCompanies,
    clientsError,
    companiesError
  };
};
