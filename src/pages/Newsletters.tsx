
import React, { useState } from 'react';
import { Search, Calendar, Clock, Users, Edit, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample newsletter data
const SAMPLE_NEWSLETTERS = [
  { 
    id: 1, 
    title: 'Q1 Industry Updates', 
    sentDate: '2023-04-05', 
    status: 'sent',
    recipients: 124,
    openRate: 68,
  },
  { 
    id: 2, 
    title: 'March Product Updates', 
    sentDate: '2023-03-12', 
    status: 'sent',
    recipients: 118,
    openRate: 72,
  },
  { 
    id: 3, 
    title: 'February Newsletter', 
    sentDate: '2023-02-08', 
    status: 'sent',
    recipients: 110,
    openRate: 65,
  },
  { 
    id: 4, 
    title: 'May Preview', 
    scheduledDate: '2023-05-01', 
    status: 'scheduled',
    recipients: 124,
    openRate: null,
  },
  { 
    id: 5, 
    title: 'Spring Sale Announcement', 
    status: 'draft',
    recipients: null,
    openRate: null,
  }
];

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'sent':
      return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Sent</span>;
    case 'scheduled':
      return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Scheduled</span>;
    case 'draft':
      return <span className="px-2 py-1 bg-white/10 text-white/70 rounded-full text-xs">Draft</span>;
    default:
      return null;
  }
};

const Newsletters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newsletters] = useState(SAMPLE_NEWSLETTERS);
  
  const filteredNewsletters = newsletters.filter(newsletter => 
    newsletter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Newsletters</h1>
        <Link to="/newsletters/new" className="btn-primary">+ Create Newsletter</Link>
      </div>
      
      <div className="card mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search newsletters..."
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
                <th className="text-left py-4 px-4 font-medium">Title</th>
                <th className="text-left py-4 px-4 font-medium">Date</th>
                <th className="text-left py-4 px-4 font-medium">Status</th>
                <th className="text-left py-4 px-4 font-medium">Recipients</th>
                <th className="text-left py-4 px-4 font-medium">Open Rate</th>
                <th className="text-right py-4 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNewsletters.map((newsletter) => (
                <tr key={newsletter.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <Link to={`/newsletters/${newsletter.id}`} className="font-medium hover:text-crm-accent transition-colors">
                      {newsletter.title}
                    </Link>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {newsletter.status === 'scheduled' ? (
                        <>
                          <Calendar size={16} className="mr-2 text-white/70" />
                          <span>Scheduled for {newsletter.scheduledDate}</span>
                        </>
                      ) : newsletter.status === 'sent' ? (
                        <>
                          <Clock size={16} className="mr-2 text-white/70" />
                          <span>Sent on {newsletter.sentDate}</span>
                        </>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(newsletter.status)}
                  </td>
                  <td className="py-4 px-4">
                    {newsletter.recipients ? (
                      <div className="flex items-center">
                        <Users size={16} className="mr-2 text-white/70" />
                        <span>{newsletter.recipients}</span>
                      </div>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {newsletter.openRate ? `${newsletter.openRate}%` : '—'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      {newsletter.status !== 'sent' && (
                        <>
                          <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                            <Send size={16} />
                          </button>
                        </>
                      )}
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

export default Newsletters;
