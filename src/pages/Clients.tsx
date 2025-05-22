import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, MoreVertical, Users, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProspects, getProspectsByCompany, setupRealTimeSubscription } from '@/services/supabaseService';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ActionItemsList from '@/components/clients/ActionItemsList';
import DocumentUploader from '@/components/clients/DocumentUploader';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [actionItems, setActionItems] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading: isLoadingClients, error: clientsError } = useQuery({
    queryKey: ['prospects'],
    queryFn: getProspects,
  });
  
  const { data: companiesMap = {}, isLoading: isLoadingCompanies, error: companiesError } = useQuery({
    queryKey: ['companies'],
    queryFn: getProspectsByCompany,
  });
  
  // Setup real-time subscriptions
  useEffect(() => {
    // Subscribe to prospect_profile changes
    const unsubscribeProfiles = setupRealTimeSubscription('prospect_profile', '*', (payload) => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.info('Client data updated');
    });
    
    // Subscribe to prospect_engagement changes
    const unsubscribeEngagements = setupRealTimeSubscription('prospect_engagement', '*', (payload) => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    });
    
    // Subscribe to sales_tracking changes
    const unsubscribeSalesTracking = setupRealTimeSubscription('sales_tracking', '*', (payload) => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    });
    
    return () => {
      unsubscribeProfiles();
      unsubscribeEngagements();
      unsubscribeSalesTracking();
    };
  }, [queryClient]);

  const filteredClients = clients.filter(client => 
    client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasError = clientsError || companiesError;

  // Handle action items extracted from document
  const handleActionItemsExtracted = (items) => {
    setActionItems(items);
  };

  if (hasError) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
        <p className="text-white/70 mb-6">There was a problem loading client data from the database.</p>
        <Button 
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['prospects'] });
            queryClient.invalidateQueries({ queryKey: ['companies'] });
          }}
        >
          Retry
        </Button>
      </div>
    );
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
      
      {/* AI Generated Action Items */}
      <div className="bg-black text-white border border-white/20 rounded-crm shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">AI Generated Action Items</h2>
        <DocumentUploader 
          clientId="general" 
          clientName="all clients" 
          onActionItemsExtracted={handleActionItemsExtracted}
        />
        <ActionItemsList items={actionItems} />
      </div>
      
      {/* Email Communication History */}
      <div className="bg-black text-white border border-white/20 rounded-crm shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Email Communication History</h2>
        <div className="space-y-4">
          {clients.slice(0, 3).flatMap(client => 
            client.communications.slice(0, 1).map((comm, idx) => (
              <div key={idx} className="border border-white/10 p-4 rounded-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="font-bold text-xs">{client.first_name.charAt(0)}{client.last_name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{client.first_name} {client.last_name}</h4>
                    <p className="text-xs text-white/70">{client.email}</p>
                  </div>
                </div>
                <h5 className="font-medium text-sm mb-1">{comm.subject_text}</h5>
                <p className="text-sm text-white/70 mb-2 line-clamp-2">{comm.body_text ? `${comm.body_text.substring(0, 120)}...` : 'No content'}</p>
                <div className="text-xs text-white/50">{new Date(comm.date_of_communication).toLocaleDateString()}</div>
              </div>
            ))
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-white/20 text-white hover:bg-white/10"
            onClick={() => navigate('/email-communications')}
          >
            View All Email Communications
          </Button>
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
            ) : filteredClients.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-white/70 mb-4">No clients found.</p>
                <Button 
                  onClick={() => navigate('/clients/new')}
                >
                  Add Your First Client
                </Button>
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
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className={`w-3 h-3 rounded-full bg-${client.statusColor}`} title={`${client.daysSinceLastContact} days since last contact`}></div>
                        </td>
                        <td className="py-4 px-4">
                          <Link to={`/clients/${client.id}`} className="font-medium hover:text-crm-accent transition-colors">
                            {client.first_name} {client.last_name}
                          </Link>
                        </td>
                        <td className="py-4 px-4">{client.company.charAt(0).toUpperCase() + client.company.slice(1)}</td>
                        <td className="py-4 px-4">{client.email}</td>
                        <td className="py-4 px-4">
                          {client.daysSinceLastContact !== null 
                            ? `${client.daysSinceLastContact} days ago` 
                            : 'No contact'}
                        </td>
                        <td className="py-4 px-4">{client.recommendedAction}</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="company" className="mt-6">
          {isLoadingCompanies ? (
            <div className="card p-8 text-center">Loading companies...</div>
          ) : Object.keys(companiesMap).length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-white/70 mb-4">No companies found.</p>
              <Button 
                onClick={() => navigate('/clients/new')}
              >
                Add Your First Client
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(companiesMap).map(([companyName, companyClients]) => (
                <div key={companyName} className="card">
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
                      {companyClients.map((client) => (
                        <tr key={client.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className={`w-3 h-3 rounded-full bg-${client.statusColor}`}></div>
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
                      ))}
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
