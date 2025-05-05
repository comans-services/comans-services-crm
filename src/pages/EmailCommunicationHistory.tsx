
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMockProspects } from '@/services/mockDataService';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, Calendar, Upload, Search } from 'lucide-react';

const EmailCommunicationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch clients data using React Query
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: getMockProspects,
  });

  // Flatten communications from all clients
  const allCommunications = clients.flatMap(client => 
    client.communications.map(comm => ({
      ...comm,
      clientName: `${client.first_name} ${client.last_name}`,
      clientEmail: client.email,
      clientId: client.id,
      // Add a default activity_type for all communications
      activity_type: 'Email'
    }))
  );

  // Sort by date (newest first)
  const sortedCommunications = [...allCommunications].sort((a, b) => 
    new Date(b.date_of_communication).getTime() - new Date(a.date_of_communication).getTime()
  );

  // Filter communications based on search term
  const filteredCommunications = sortedCommunications.filter(comm => 
    comm.subject_text.toLowerCase().includes(searchTerm.toLowerCase()) || 
    comm.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Email Communication History</h1>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-white/50" size={18} />
          <Input
            type="text"
            placeholder="Search communications..."
            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">All Communications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-white/70">Loading communications...</p>
            </div>
          ) : filteredCommunications.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/20">
                    <TableHead className="text-left py-4 px-4 font-medium text-white">Client</TableHead>
                    <TableHead className="text-left py-4 px-4 font-medium text-white">Subject</TableHead>
                    <TableHead className="text-left py-4 px-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Activity size={16} />
                        <span>Activity</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-left py-4 px-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Date</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right py-4 px-4 font-medium text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommunications.map((comm, index) => (
                    <TableRow key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <TableCell className="py-4 px-4">
                        <div>
                          <p className="font-medium">{comm.clientName}</p>
                          <p className="text-sm text-white/70">{comm.clientEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">{comm.subject_text}</TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center">
                          <span className={`w-2.5 h-2.5 rounded-full bg-crm-accent mr-2`}></span>
                          <span>{comm.activity_type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        {format(new Date(comm.date_of_communication), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => window.open(`/clients/${comm.clientId}`, '_blank')}
                        >
                          View Client
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-white/70">No communications found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailCommunicationHistory;
