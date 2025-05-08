
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProspects, SalesTracking } from '@/services/supabaseService';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const EmailCommunicationHistory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [communications, setCommunications] = useState<SalesTracking[]>([]);

  const { data: prospects } = useQuery({
    queryKey: ['prospects'],
    queryFn: getProspects,
  });

  useEffect(() => {
    if (prospects) {
      // Collect all communications from all prospects and flatten into a single array
      const allCommunications = prospects.flatMap(p => p.communications || []);
      // Sort by date, newest first
      const sorted = [...allCommunications].sort((a, b) => 
        new Date(b.date_of_communication).getTime() - new Date(a.date_of_communication).getTime()
      );
      
      setCommunications(sorted);
      setIsLoading(false);
    }
  }, [prospects]);

  if (isLoading) {
    return <div className="p-8">Loading email history...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Email Communication History</h1>
      </div>
      
      <div className="space-y-6">
        {communications.length > 0 ? communications.map((comm, index) => (
          <div key={index} className="p-6 card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">{comm.subject_text}</h2>
                <p className="text-white/70">
                  To: {comm.prospect_first_name} {comm.prospect_last_name}
                </p>
                <p className="text-white/70 text-sm">
                  From: {comm.salesperson_email}
                </p>
              </div>
              <div className="text-white/50 text-sm">
                {format(new Date(comm.date_of_communication), 'PPP')}
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mt-2">
              <p className="whitespace-pre-line">{comm.body_text || 'No content available'}</p>
            </div>
            
            <div className="mt-4 text-right">
              <Link to={`/clients/${comm.prospect_id}`}>
                <Button variant="outline" size="sm">
                  View Client
                </Button>
              </Link>
            </div>
          </div>
        )) : (
          <div className="text-center py-10 card">
            <p className="text-xl font-semibold mb-4">No email communications found</p>
            <p className="text-white/70 mb-6">Start communicating with prospects to see your history here.</p>
            <Button onClick={() => navigate('/clients')}>
              View Clients
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCommunicationHistory;
