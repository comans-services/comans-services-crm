
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, Building, User } from 'lucide-react';

// Sample client data
const SAMPLE_CLIENTS = [
  { id: 1, name: 'John Smith', company: 'Acme Corp', email: 'john@acmecorp.com', phone: '(123) 456-7890', 
    notes: 'Key client in the manufacturing sector. Prefers quarterly newsletters with industry updates.',
    lastContactDate: '2023-04-10', 
    address: '123 Main Street, Suite 400, New York, NY 10001' },
  { id: 2, name: 'Lisa Johnson', company: 'Wayne Industries', email: 'lisa@wayneindustries.com', phone: '(234) 567-8901',
    notes: 'Interested in our premium newsletter package. Follow up in May about the annual subscription.',
    lastContactDate: '2023-03-28',
    address: '456 Park Avenue, Chicago, IL 60601' },
  { id: 3, name: 'Michael Brown', company: 'Stark Enterprises', email: 'michael@starkent.com', phone: '(345) 678-9012',
    notes: 'Tech-focused client, prefers newsletters with cutting-edge industry innovations.',
    lastContactDate: '2023-04-02',
    address: '789 Ocean Drive, Miami, FL 33139' },
];

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clientId = parseInt(id || '0');
  
  // Find the client with the matching id
  const client = SAMPLE_CLIENTS.find(c => c.id === clientId);
  
  if (!client) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Client Not Found</h2>
        <button 
          className="btn-primary"
          onClick={() => navigate('/clients')}
        >
          Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div>
      <button 
        onClick={() => navigate('/clients')}
        className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to clients
      </button>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{client.name}</h1>
        <button className="btn-primary">
          <Edit size={16} className="mr-2" />
          Edit Client
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card md:col-span-2">
          <h2 className="text-xl font-bold mb-5">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm text-white/70">Full Name</p>
                <p className="font-medium">{client.name}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                <Building size={20} />
              </div>
              <div>
                <p className="text-sm text-white/70">Company</p>
                <p className="font-medium">{client.company}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-white/70">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-white/70">Phone</p>
                <p className="font-medium">{client.phone}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-white/70 mb-2">Address</p>
            <p>{client.address}</p>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Client Notes</h2>
          <p className="text-white/90">{client.notes}</p>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-white/70">Last Contact Date</p>
            <p className="font-medium">{client.lastContactDate}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Newsletter History</h2>
            <button className="btn-primary">Send Newsletter</button>
          </div>
          
          <div className="border-b border-white/10 pb-4 mb-4">
            <p className="font-medium">Q1 Industry Updates</p>
            <p className="text-sm text-white/70">Sent on April 5, 2023</p>
            <p className="text-xs text-green-400 mt-1">Opened</p>
          </div>
          
          <div className="border-b border-white/10 pb-4 mb-4">
            <p className="font-medium">March Product Updates</p>
            <p className="text-sm text-white/70">Sent on March 12, 2023</p>
            <p className="text-xs text-green-400 mt-1">Opened</p>
          </div>
          
          <div>
            <p className="font-medium">February Newsletter</p>
            <p className="text-sm text-white/70">Sent on February 8, 2023</p>
            <p className="text-xs text-white/50 mt-1">Not opened</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
