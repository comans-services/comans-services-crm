
import React, { useState } from 'react';
import { Search, Plus, Edit, MoreVertical, Users, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProspects, getProspectsByCompany, getStatusColor } from '@/services/supabaseService';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const navigate = useNavigate();

  // Fetch clients data using React Query
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['prospects'],
    queryFn: fetchProspects,
  });
  
  // Fetch companies data using React Query
  const { data: companiesMap = {}, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: getProspectsByCompany,
  });

  const filteredClients = clients.filter(client => 
    client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Custom block styling for AI Generated Action Items and Email Communication History
  const blackBoxStyle = "bg-black text-white border border-white/20 rounded-crm shadow-lg p-6";

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
          </div>
        </TabsContent>
        
        <TabsContent value="company" className="mt-6">
          {isLoadingCompanies ? (
            <div className="card p-8 text-center">Loading companies...</div>
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
