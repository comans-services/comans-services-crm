
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMockProspects, ProspectWithEngagement } from '@/services/mockDataService';
import { format } from 'date-fns';
import { Mail, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CommunicationHistory = () => {
  const navigate = useNavigate();
  
  const { data: prospects = [], isLoading, error } = useQuery({
    queryKey: ['prospects-for-communications'],
    queryFn: getMockProspects,
  });

  // Flatten all communications from all prospects
  const allCommunications = prospects.flatMap(prospect => 
    prospect.communications.map(comm => ({
      ...comm,
      prospectName: `${prospect.first_name} ${prospect.last_name}`,
      prospectId: prospect.id,
      company: prospect.company
    }))
  );

  // Sort by date (newest first)
  allCommunications.sort((a, b) => 
    new Date(b.date_of_communication).getTime() - new Date(a.date_of_communication).getTime()
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading communications...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading communications data</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Communication History</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>All Communications</span>
            <Button variant="outline" size="sm" onClick={() => navigate('/newsletters/new')}>
              New Email
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {allCommunications.map((comm, index) => (
              <div key={index} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="font-medium">{comm.subject_text}</p>
                      <p className="text-sm text-white/70">
                        To: {comm.prospectName} - {comm.company.charAt(0).toUpperCase() + comm.company.slice(1)}
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        {format(new Date(comm.date_of_communication), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/clients/${comm.prospectId}`)}
                  >
                    View Client <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
                <div className="mt-3 bg-white/5 p-4 rounded-md">
                  <p className="text-white/80">{comm.body_text?.substring(0, 150)}...</p>
                </div>
              </div>
            ))}

            {allCommunications.length === 0 && (
              <div className="text-center py-10">
                <p className="text-white/70">No communications found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationHistory;
