
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import ClientList from '@/components/clients/ClientList';
import ClientsByCompany from '@/components/clients/ClientsByCompany';
import ClientSearch from '@/components/clients/ClientSearch';
import ClientsError from '@/components/clients/ClientsError';
import { useClientsData } from '@/hooks/useClientsData';

const Clients = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const { 
    filteredClients, 
    companiesMap, 
    searchTerm, 
    setSearchTerm, 
    isLoadingClients, 
    isLoadingCompanies, 
    clientsError, 
    companiesError 
  } = useClientsData();

  if (clientsError) {
    return <ClientsError error={clientsError as Error} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Link to="/clients/new" className="btn-primary">+ Add Client</Link>
      </div>
      
      <ClientSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
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
            <ClientList clients={filteredClients} isLoading={isLoadingClients} />
          </div>
        </TabsContent>
        
        <TabsContent value="company" className="mt-6">
          <ClientsByCompany
            companiesMap={companiesMap}
            isLoading={isLoadingCompanies}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Clients;
