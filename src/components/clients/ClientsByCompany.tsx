
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Prospect } from '@/services/supabaseService';
import { getStatusColor } from '@/utils/clientUtils';
import { Button } from '@/components/ui/button';

interface ClientsByCompanyProps {
  companiesMap: Record<string, Prospect[]>;
  isLoading: boolean;
}

const ClientsByCompany = ({ companiesMap, isLoading }: ClientsByCompanyProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="card p-8 text-center">Loading companies...</div>;
  }

  if (Object.keys(companiesMap).length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-white/70 mb-4">No companies found</p>
        <Link to="/clients/new" className="btn-primary inline-block">Add your first client</Link>
      </div>
    );
  }

  return (
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
  );
};

export default ClientsByCompany;
