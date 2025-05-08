import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProspects, setupRealTimeSubscription } from '@/services/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ProspectWithEngagement } from '@/services/types';

// Priority indicator component
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

const TodaysTasks = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch prospects using React Query
  const { data: prospects = [], isLoading, error } = useQuery({
    queryKey: ['prospects'],
    queryFn: getProspects,
  });

  // Setup real-time subscriptions
  useEffect(() => {
    const unsubscribe = setupRealTimeSubscription('prospect_engagement', '*', () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    });
    
    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  // Generate prioritized to-do list for today
  const generatePrioritizedTasks = (prospects: ProspectWithEngagement[]) => {
    const tasks = [];
    
    // Add urgent follow-ups as high priority
    const urgentProspects = prospects.filter(p => p.daysSinceLastContact !== null && p.daysSinceLastContact > 10);
    for (const prospect of urgentProspects) {
      tasks.push({
        id: `task-urgent-${prospect.id}`,
        type: 'follow-up',
        prospect,
        priority: 'high' as const,
        description: `Contact ${prospect.first_name} ${prospect.last_name} (${prospect.daysSinceLastContact} days since last contact)`
      });
    }
    
    // Add today's follow-ups as medium priority
    const todayProspects = prospects.filter(p => p.daysSinceLastContact !== null && p.daysSinceLastContact > 5 && p.daysSinceLastContact <= 10);
    for (const prospect of todayProspects) {
      tasks.push({
        id: `task-today-${prospect.id}`,
        type: 'follow-up',
        prospect,
        priority: 'medium' as const,
        description: `Follow up with ${prospect.first_name} ${prospect.last_name} from ${prospect.company}`
      });
    }
    
    // Add weekly follow-ups as low priority
    const weeklyProspects = prospects.filter(p => p.daysSinceLastContact !== null && p.daysSinceLastContact > 2 && p.daysSinceLastContact <= 5);
    for (const prospect of weeklyProspects) {
      tasks.push({
        id: `task-weekly-${prospect.id}`,
        type: 'check-in',
        prospect,
        priority: 'low' as const,
        description: `Schedule check-in with ${prospect.first_name} ${prospect.last_name}`
      });
    }
    
    return tasks;
  };
  
  const prioritizedTasks = generatePrioritizedTasks(prospects);

  const handleCompleteTask = (taskId: string, description: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Marked "${description}" as done`);
    // In a real app, this would update the task in the backend
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading tasks data...</div>;
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
        <p className="text-white/70 mb-6">There was a problem loading task data from the database.</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['prospects'] })}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Today's Communication Tasks</h1>
      </div>
      
      <div className="card bg-black/80 backdrop-blur-md border border-white/20 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Priority Tasks</h2>
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
                onClick={() => navigate(`/clients/${task.prospect.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="min-w-[24px]">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full hover:bg-white/20"
                      onClick={(e) => handleCompleteTask(task.id, task.description, e)}
                    >
                      <div className="h-5 w-5 rounded-full border border-white/40"></div>
                    </Button>
                  </div>
                  <div>
                    <p className="font-medium mb-1">{task.description}</p>
                    <div className="flex items-center gap-4">
                      <PriorityIndicator priority={task.priority} />
                      {task.type === 'follow-up' && (
                        <span className="text-xs bg-white/10 px-2 py-1 rounded">Follow-up</span>
                      )}
                      {task.type === 'check-in' && (
                        <span className="text-xs bg-white/10 px-2 py-1 rounded">Check-in</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-white/70">{task.prospect.company}</p>
                  <p className="text-xs text-white/50">
                    {task.prospect.daysSinceLastContact} days ago
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-black/80 backdrop-blur-md border border-white/20">
          <h2 className="text-xl font-bold mb-4">Task Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70">High Priority</span>
              <span className="font-bold">{prioritizedTasks.filter(t => t.priority === 'high').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Medium Priority</span>
              <span className="font-bold">{prioritizedTasks.filter(t => t.priority === 'medium').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Low Priority</span>
              <span className="font-bold">{prioritizedTasks.filter(t => t.priority === 'low').length}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
              <span className="font-bold">Total Tasks</span>
              <span className="font-bold">{prioritizedTasks.length}</span>
            </div>
          </div>
        </div>
        
        <div className="card bg-black/80 backdrop-blur-md border border-white/20">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-between text-white border-white/20"
              onClick={() => navigate('/clients')}
            >
              View All Clients <ArrowRight size={16} />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between text-white border-white/20"
              onClick={() => navigate('/communications')}
            >
              View Prospect Status <ArrowRight size={16} />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between bg-crm-accent text-white hover:bg-crm-accent/90"
              onClick={() => navigate('/clients/new')}
            >
              Add New Client <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysTasks;
