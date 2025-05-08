
import React from 'react';
import { Users, Mail, Calendar, TrendingUp, Bell, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchProspects, fetchAllCommunications, fetchTasks, toggleTaskCompletion } from '@/services/supabaseService';

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

const PriorityIndicator = ({ priority }: { priority: 'high' | 'medium' | 'low' }) => {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${colors[priority]}`}></div>
      <span className="text-xs text-white/70 capitalize">{priority}</span>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch prospects using React Query
  const { data: prospects = [], isLoading: isLoadingProspects } = useQuery({
    queryKey: ['prospects'],
    queryFn: fetchProspects,
  });

  // Fetch communications using React Query
  const { data: communications = [], isLoading: isLoadingCommunications } = useQuery({
    queryKey: ['all-communications'],
    queryFn: fetchAllCommunications,
  });

  // Fetch tasks using React Query
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const isLoading = isLoadingProspects || isLoadingCommunications || isLoadingTasks;

  // Handle "Add Client" button click
  const handleAddClient = () => {
    navigate('/clients/new');
    toast({
      title: "New Client",
      description: "Starting new client creation process",
    });
  };

  // Handle task completion toggle
  const handleTaskCompletion = async (taskId: string, completed: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const success = await toggleTaskCompletion(taskId, !completed);
    if (success) {
      // Invalidate tasks query to refetch data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  // Calculate statistics
  const urgentFollowups = prospects.filter(p => p.daysSinceLastContact !== null && p.daysSinceLastContact > 10).length;
  const todayFollowups = prospects.filter(p => p.daysSinceLastContact !== null && p.daysSinceLastContact > 5 && p.daysSinceLastContact <= 10).length;
  const thisWeekFollowups = prospects.filter(p => p.daysSinceLastContact !== null && p.daysSinceLastContact > 2 && p.daysSinceLastContact <= 5).length;

  // Get high priority tasks for dashboard
  const prioritizedTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by due date
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 5); // Only get the top 5 tasks for display

  // Get unique companies for companies section
  const companies = Array.from(new Set(prospects.map(p => p.company))).filter(Boolean);
  const companyCounts: Record<string, number> = {};
  
  prospects.forEach(prospect => {
    const company = prospect.company || 'Unknown';
    companyCounts[company] = (companyCounts[company] || 0) + 1;
  });

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
        <div className="card bg-black/80 backdrop-blur-md border border-white/20 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Today's Communication Tasks</h2>
            <Button variant="outline" size="sm" className="bg-red-600 text-white hover:bg-red-700 border-red-600" onClick={() => navigate('/todaystasks')}>
              View All <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            {prioritizedTasks.length > 0 ? (
              prioritizedTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between py-3 px-4 rounded-md transition-colors cursor-pointer border-l-4 ${
                    task.priority === 'high' ? 'border-l-red-500 bg-black/40' : 
                    task.priority === 'medium' ? 'border-l-yellow-500 bg-black/30' : 
                    'border-l-green-500 bg-black/20'
                  }`}
                  onClick={() => navigate(`/clients/${task.prospect_id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="min-w-[24px]">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-white/20"
                        onClick={(e) => handleTaskCompletion(task.id, task.completed, e)}
                      >
                        <div className={`h-5 w-5 rounded-full border border-white/40 ${
                          task.completed ? 'bg-white/40' : ''
                        }`}></div>
                      </Button>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{task.task_description}</p>
                      <div className="flex items-center gap-4">
                        <PriorityIndicator priority={task.priority} />
                        <span className="text-xs bg-white/10 px-2 py-1 rounded capitalize">
                          {task.task_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-white/70">
                      {task.prospect_profile?.first_name} {task.prospect_profile?.last_name}
                    </p>
                    <p className="text-xs text-white/50">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-white/60">
                No communication tasks for today
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => navigate('/todaystasks')} className="bg-red-600 text-white hover:bg-red-700 border-red-600">
              View all communication tasks
            </Button>
          </div>
        </div>
        
        <div className="card bg-black/80 backdrop-blur-md border border-white/20">
          <h2 className="text-xl font-bold mb-4">Companies</h2>
          <div className="space-y-4">
            {Object.entries(companyCounts).slice(0, 5).map(([company, count], i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-crm-background-from to-crm-background-to flex items-center justify-center mr-3">
                    <span className="font-bold text-xs">{company.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <p>{company.charAt(0).toUpperCase() + company.slice(1)}</p>
                </div>
                <span className="text-xs text-white/50">
                  {count} prospect{count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Card className="bg-black/80 backdrop-blur-md border border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-white">Recent Communications</CardTitle>
            <CardDescription className="text-white/70">Latest emails sent to prospects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {communications.slice(0, 4).map((comm) => (
                <div key={comm.id} className="flex items-start border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-medium">{comm.subject_text}</p>
                    <p className="text-sm text-white/70">
                      To: {comm.prospect_profile ? `${comm.prospect_profile.first_name} ${comm.prospect_profile.last_name}` : 'Unknown Client'}
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
            <Button variant="outline" className="w-full bg-red-600 text-white hover:bg-red-700 border-red-600" onClick={() => navigate('/email-communications')}>
              View All Communications
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
