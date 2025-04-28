
import React, { useEffect, useState } from 'react';
import { Users, Mail, Calendar, TrendingUp, Bell, ArrowRight } from 'lucide-react';
import { getMockProspects, ProspectWithEngagement } from '../services/mockDataService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
  <div className="card hover-scale">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/70 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 24, className: 'stroke-2' })}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Fetch prospects using React Query
  const { data: prospects = [], isLoading, error } = useQuery({
    queryKey: ['prospects'],
    queryFn: getMockProspects,
  });

  // Handle "Add Client" button click
  const handleAddClient = () => {
    navigate('/clients/new');
    toast({
      title: "New Client",
      description: "Starting new client creation process",
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading dashboard data</div>;
  }

  // Calculate statistics
  const urgentFollowups = prospects.filter(p => p.daysSinceLastContact !== null && p.daysSinceLastContact > 10).length;
  const todayFollowups = prospects.filter(p => p.daysSinceLastContact !== null && p.daysSinceLastContact > 5 && p.daysSinceLastContact <= 10).length;
  const thisWeekFollowups = prospects.filter(p => p.daysSinceLastContact !== null && p.daysSinceLastContact > 2 && p.daysSinceLastContact <= 5).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button className="btn-primary" onClick={handleAddClient}>+ Add Client</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Clients" 
          value={prospects.length} 
          icon={<Users />}
          color="bg-blue-500/20 text-blue-500"
        />
        <StatCard 
          title="Urgent Follow-ups" 
          value={urgentFollowups} 
          icon={<Bell />}
          color="bg-red-500/20 text-red-500"
        />
        <StatCard 
          title="Today Follow-ups" 
          value={todayFollowups} 
          icon={<TrendingUp />}
          color="bg-orange-500/20 text-orange-500"
        />
        <StatCard 
          title="This Week" 
          value={thisWeekFollowups} 
          icon={<Calendar />}
          color="bg-yellow-500/20 text-yellow-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Communication Frequency</h2>
            <Button variant="outline" size="sm" className="bg-crm-accent text-white hover:bg-crm-accent/90" onClick={() => navigate('/clients')}>
              View All <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            {prospects.slice(0, 5).map((prospect) => (
              <div 
                key={prospect.id} 
                className="flex items-center justify-between border-b border-white/10 pb-4 hover:bg-white/5 p-2 rounded-md transition-colors cursor-pointer"
                onClick={() => navigate(`/clients/${prospect.id}`)}
              >
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-full bg-${prospect.statusColor}/20 text-${prospect.statusColor} flex items-center justify-center mr-4`}>
                    <div className={`w-5 h-5 rounded-full bg-${prospect.statusColor}`}></div>
                  </div>
                  <div>
                    <p className="font-medium">
                      {prospect.first_name} {prospect.last_name}
                    </p>
                    <p className="text-sm text-white/70">
                      {prospect.company.charAt(0).toUpperCase() + prospect.company.slice(1)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">
                    {prospect.daysSinceLastContact !== null
                      ? `${prospect.daysSinceLastContact} days ago`
                      : 'No contact'}
                  </p>
                  <p className="text-sm text-white/70">{prospect.recommendedAction}</p>
                </div>
              </div>
            ))}
          </div>
          
          {prospects.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => navigate('/clients')} className="text-white">
                View all {prospects.length} clients
              </Button>
            </div>
          )}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Companies</h2>
          <div className="space-y-4">
            {Array.from(new Set(prospects.map(p => p.company))).slice(0, 5).map((company, i) => {
              const companyProspects = prospects.filter(p => p.company === company);
              return (
                <div key={i} className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-crm-background-from to-crm-background-to flex items-center justify-center mr-3">
                      <span className="font-bold text-xs">{company.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <p>{company.charAt(0).toUpperCase() + company.slice(1)}</p>
                  </div>
                  <span className="text-xs text-white/50">
                    {companyProspects.length} prospect{companyProspects.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Communications</CardTitle>
            <CardDescription>Latest emails sent to prospects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prospects.slice(0, 3).flatMap(p => p.communications).slice(0, 4).map((comm, i) => (
                <div key={i} className="flex items-start border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-medium">{comm.subject_text}</p>
                    <p className="text-sm text-white/70">
                      To: {comm.prospect_first_name} {comm.prospect_last_name}
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      {format(new Date(comm.date_of_communication), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/newsletters')}>
              View All Communications
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
