
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, MoreVertical, Users, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProspects, getProspectsByCompany, getStatusColor } from '@/services/supabaseService';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch clients data using React Query with additional options and debug
  const { data: clients = [], isLoading: isLoadingClients, error: clientsError } = useQuery({
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
  const { data: companiesMap = {}, isLoading: isLoadingCompanies, error: companiesError } = useQuery({
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

  // Log when filtered clients change
  const filteredClients = clients.filter(client => 
    client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    console.log('Filtered clients:', filteredClients);
    console.log('Total clients count:', clients.length);
  }, [filteredClients, clients]);

  // Custom block styling for AI Generated Action Items and Email Communication History
  const blackBoxStyle = "bg-black text-white border border-white/20 rounded-crm shadow-lg p-6";

  // Add error handling UI
  if (clientsError) {
    return <div className="card p-6">
      <h2 className="text-xl font-bold text-red-500 mb-2">Error loading clients</h2>
      <p className="text-white/70">{clientsError.message || 'Unknown error occurred'}</p>
      <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['prospects'] })} 
        className="mt-4">
        Retry
      </Button>
    </div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Link to="/clients/new" className="btn-primary">+ Add Client</Link>
      </div>
      
      <div className="card mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-white/50" size={18} />
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setCurrentTab} className="mb-6">
        <TabsList className="bg-white/10">
          <TabsTrigger value="all" className="data-[state=active]:bg-crm-accent">
            <Users size={16} className="mr-2" /> All Clients
          </TabsTrigger>
          <TabsTrigger value="company" className="data-[state=active]:bg-crm-accent">
            <Building size={16} className="mr-2" /> By Company
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="card">
            {isLoadingClients ? (
              <div className="p-8 text-center">Loading clients...</div>
            ) : (
              <>
                {filteredClients.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-white/70 mb-4">No clients found</p>
                    <Link to="/clients/new" className="btn-primary inline-block">Add your first client</Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-4 px-4 font-medium">Status</th>
                          <th className="text-left py-4 px-4 font-medium">Name</th>
                          <th className="text-left py-4 px-4 font-medium">Company</th>
                          <th className="text-left py-4 px-4 font-medium">Email</th>
                          <th className="text-left py-4 px-4 font-medium">Last Contact</th>
                          <th className="text-left py-4 px-4 font-medium">Action Needed</th>
                          <th className="text-right py-4 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClients.map((client) => {
                          const statusColorClass = `bg-${getStatusColor(client.daysSinceLastContact)}`;
                          return (
                            <tr key={client.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="py-4 px-4">
                                <div className={`w-3 h-3 rounded-full ${statusColorClass}`} title={`${client.daysSinceLastContact} days since last contact`}></div>
                              </td>
                              <td className="py-4 px-4">
                                <Link to={`/clients/${client.id}`} className="font-medium hover:text-crm-accent transition-colors">
                                  {client.first_name} {client.last_name}
                                </Link>
                              </td>
                              <td className="py-4 px-4">{client.company ? client.company.charAt(0).toUpperCase() + client.company.slice(1) : 'N/A'}</td>
                              <td className="py-4 px-4">{client.email}</td>
                              <td className="py-4 px-4">
                                {client.daysSinceLastContact !== null 
                                  ? `${client.daysSinceLastContact} days ago` 
                                  : 'No contact'}
                              </td>
                              <td className="py-4 px-4">
                                {client.daysSinceLastContact === null ? 'Initial contact needed' :
                                  client.daysSinceLastContact <= 2 ? 'Follow up next week' :
                                  client.daysSinceLastContact <= 5 ? 'Follow up this week' :
                                  client.daysSinceLastContact <= 10 ? 'Follow up today' :
                                  'Urgent follow up required'}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                                    <Edit size={16} />
                                  </button>
                                  <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                                    <MoreVertical size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="company" className="mt-6">
          {isLoadingCompanies ? (
            <div className="card p-8 text-center">Loading companies...</div>
          ) : Object.keys(companiesMap).length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-white/70 mb-4">No companies found</p>
              <Link to="/clients/new" className="btn-primary inline-block">Add your first client</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(companiesMap).map(([companyName, companyClients], index) => (
                <div key={`company-${index}-${companyName}`} className="card">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                      <span className="font-bold">{companyName.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <h3 className="text-xl font-bold">{companyName.charAt(0).toUpperCase() + companyName.slice(1)}</h3>
                    <span className="ml-3 text-white/70 text-sm">
                      {companyClients.length} client{companyClients.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Name</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Last Contact</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyClients.map((client) => {
                        const statusColorClass = `bg-${getStatusColor(client.daysSinceLastContact)}`;
                        return (
                          <tr key={client.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4">
                              <div className={`w-3 h-3 rounded-full ${statusColorClass}`}></div>
                            </td>
                            <td className="py-3 px-4">
                              <Link to={`/clients/${client.id}`} className="font-medium hover:text-crm-accent transition-colors">
                                {client.first_name} {client.last_name}
                              </Link>
                            </td>
                            <td className="py-3 px-4">{client.email}</td>
                            <td className="py-3 px-4">
                              {client.daysSinceLastContact !== null 
                                ? `${client.daysSinceLastContact} days ago` 
                                : 'No contact'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button size="sm" onClick={() => navigate(`/clients/${client.id}`)}>
                                View
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Clients;
