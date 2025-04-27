
import React, { useState } from 'react';
import { Search, Plus, Edit, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample client data
const SAMPLE_CLIENTS = [
  { id: 1, name: 'John Smith', company: 'Acme Corp', email: 'john@acmecorp.com', phone: '(123) 456-7890' },
  { id: 2, name: 'Lisa Johnson', company: 'Wayne Industries', email: 'lisa@wayneindustries.com', phone: '(234) 567-8901' },
  { id: 3, name: 'Michael Brown', company: 'Stark Enterprises', email: 'michael@starkent.com', phone: '(345) 678-9012' },
  { id: 4, name: 'Emily Davis', company: 'ABC Holdings', email: 'emily@abcholdings.com', phone: '(456) 789-0123' },
  { id: 5, name: 'David Wilson', company: 'XYZ Ltd', email: 'david@xyzltd.com', phone: '(567) 890-1234' },
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients] = useState(SAMPLE_CLIENTS);
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-4 font-medium">Name</th>
                <th className="text-left py-4 px-4 font-medium">Company</th>
                <th className="text-left py-4 px-4 font-medium">Email</th>
                <th className="text-left py-4 px-4 font-medium">Phone</th>
                <th className="text-right py-4 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <Link to={`/clients/${client.id}`} className="font-medium hover:text-crm-accent transition-colors">
                      {client.name}
                    </Link>
                  </td>
                  <td className="py-4 px-4">{client.company}</td>
                  <td className="py-4 px-4">{client.email}</td>
                  <td className="py-4 px-4">{client.phone}</td>
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
      </div>
    </div>
  );
};

export default Clients;
