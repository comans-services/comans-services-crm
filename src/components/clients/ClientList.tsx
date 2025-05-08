
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, MoreVertical } from 'lucide-react';
import { Prospect } from '@/services/supabaseService';
import { getStatusColor } from '@/utils/clientUtils';

interface ClientListProps {
  clients: Prospect[];
  isLoading: boolean;
}

const ClientList = ({ clients, isLoading }: ClientListProps) => {
  if (isLoading) {
    return <div className="p-8 text-center">Loading clients...</div>;
  }

  if (clients.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/70 mb-4">No clients found</p>
        <Link to="/clients/new" className="btn-primary inline-block">Add your first client</Link>
      </div>
    );
  }

  return (
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
          {clients.map((client) => {
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
  );
};

export default ClientList;
