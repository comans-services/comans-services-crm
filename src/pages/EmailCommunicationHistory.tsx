
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllCommunications } from '@/services/supabaseService';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, Calendar, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const EmailCommunicationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch communications data using React Query
  const { data: communications = [], isLoading } = useQuery({
    queryKey: ['communications'],
    queryFn: fetchAllCommunications,
  });

  // Filter communications based on search term
  const filteredCommunications = communications.filter(comm => 
    comm.subject_text.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (comm.prospect_profile?.first_name + ' ' + comm.prospect_profile?.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.prospect_profile?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmailClick = (communication: any) => {
    setSelectedEmail(communication);
    setIsDialogOpen(true);
  };

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

      <Card className="bg-black text-white border border-white/10">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-xl font-bold text-white">All Communications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
                  {filteredCommunications.map((comm) => (
                    <TableRow 
                      key={comm.id} 
                      className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => handleEmailClick(comm)}
                    >
                      <TableCell className="py-4 px-4">
                        <div>
                          <p className="font-medium">
                            {comm.prospect_profile ? 
                              `${comm.prospect_profile.first_name} ${comm.prospect_profile.last_name}` : 
                              'Unknown Client'}
                          </p>
                          <p className="text-sm text-white/70">
                            {comm.prospect_profile?.email || 'No email'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">{comm.subject_text}</TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center">
                          <span className={`w-2.5 h-2.5 rounded-full bg-crm-accent mr-2`}></span>
                          <span>Email</span>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/clients/${comm.prospect_id}`, '_blank');
                          }}
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

      {/* Email Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 backdrop-blur-md border border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Email Details</DialogTitle>
          </DialogHeader>
          
          {selectedEmail && (
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-3">
                <p className="text-sm text-white/70">From</p>
                <p className="font-medium">{selectedEmail.salesperson_email}</p>
              </div>
              
              <div className="border-b border-white/10 pb-3">
                <p className="text-sm text-white/70">To</p>
                <p className="font-medium">
                  {selectedEmail.prospect_profile?.email || 'Unknown recipient'}
                </p>
              </div>
              
              <div className="border-b border-white/10 pb-3">
                <p className="text-sm text-white/70">Subject</p>
                <p className="font-medium">{selectedEmail.subject_text}</p>
              </div>
              
              <div className="border-b border-white/10 pb-3">
                <p className="text-sm text-white/70">Date</p>
                <p className="font-medium">
                  {format(new Date(selectedEmail.date_of_communication), 'MMMM d, yyyy - h:mm a')}
                </p>
              </div>
              
              <div className="pt-2 whitespace-pre-wrap">
                <p className="text-sm text-white/70">Message</p>
                <div className="mt-2 bg-white/5 p-4 rounded-md">
                  {selectedEmail.body_text}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailCommunicationHistory;
