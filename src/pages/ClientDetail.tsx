
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, Building, User, FileText, Upload } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProspectById } from '@/services/supabaseService';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import DocumentUploader from '@/components/clients/DocumentUploader';
import ActionItemsList from '@/components/clients/ActionItemsList';
import { ActionItem } from '@/services/mockAiService';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clientId = id || '';
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  
  // Fetch client data using React Query
  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => getProspectById(clientId),
    enabled: !!clientId,
  });

  const handleActionItemsExtracted = (items: ActionItem[]) => {
    setActionItems(prevItems => [...items, ...prevItems]);
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Loading client details...</h2>
      </div>
    );
  }
  
  if (error || !client) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Client Not Found</h2>
        <Button 
          className="btn-primary"
          onClick={() => navigate('/clients')}
        >
          Back to Clients
        </Button>
      </div>
    );
  }

  const communications = client.communications || [];
  const statusColorClass = `bg-${client.statusColor}`;
  const textColorClass = `text-${client.statusColor}`;

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
        <div className="flex items-center">
          <h1 className="text-3xl font-bold mr-4">{client.first_name} {client.last_name}</h1>
          <div className={`px-3 py-1 rounded-full flex items-center ${statusColorClass} bg-opacity-20`}>
            <div className={`w-3 h-3 rounded-full ${statusColorClass} mr-2`}></div>
            <span className={`text-sm font-medium ${textColorClass}`}>
              {client.daysSinceLastContact !== null 
                ? `${client.daysSinceLastContact} days since last contact` 
                : 'No contact history'}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="btn-primary">
            <Edit size={16} className="mr-2" />
            Edit Client
          </Button>
        </div>
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
                <p className="font-medium">{client.first_name} {client.last_name}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                <Building size={20} />
              </div>
              <div>
                <p className="text-sm text-white/70">Company</p>
                <p className="font-medium">{client.company ? client.company.charAt(0).toUpperCase() + client.company.slice(1) : 'Not specified'}</p>
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
                <p className="font-medium">{client.phone || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Status Information</h2>
          <div className="mb-6">
            <p className="text-sm text-white/70 mb-2">Next Recommended Action</p>
            <p className="text-white/90 font-medium">{client.recommendedAction}</p>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-white/70 mb-2">Last Contact Date</p>
            <p className="font-medium">
              {client.engagement?.last_contact_date 
                ? format(new Date(client.engagement.last_contact_date), 'MMMM d, yyyy') 
                : 'No contact recorded'}
            </p>
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-white/70 mb-2">Client Since</p>
            <p className="font-medium">{client.client_since 
              ? format(new Date(client.client_since), 'MMMM d, yyyy')
              : format(new Date(client.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <DocumentUploader 
          clientId={clientId} 
          clientName={`${client.first_name} ${client.last_name}`}
          onActionItemsExtracted={handleActionItemsExtracted}
        />

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold">AI Generated Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ActionItemsList items={actionItems} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Email Communication History</CardTitle>
          </CardHeader>
          <CardContent>
            {communications.length > 0 ? (
              <div className="space-y-6">
                {communications.map((comm, index) => (
                  <div key={index} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{comm.subject_text}</h3>
                        <p className="text-sm text-white/70">
                          From: {comm.salesperson_email} • 
                          Sent on {format(new Date(comm.date_of_communication), 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload size={16} className="mr-2" /> Export
                      </Button>
                    </div>
                    <div className="mt-3 bg-white/5 p-4 rounded-md">
                      <p className="text-white/80">{comm.body_text?.substring(0, 150)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-white/70">No email communications found for this client.</p>
                <Button className="mt-4">Send First Email</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDetail;
