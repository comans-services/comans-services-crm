
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { fetchTasks, Task, toggleTaskCompletion } from '@/services/supabaseService';

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
  
  // Fetch tasks using React Query
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const handleCompleteTask = async (taskId: string, completed: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const success = await toggleTaskCompletion(taskId, !completed);
    if (success) {
      // Invalidate tasks query to refetch data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading tasks data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading tasks data</div>;
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
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-center justify-between py-3 px-4 rounded-md transition-colors cursor-pointer border-l-4 ${
                  task.priority === 'high' ? 'border-l-red-500 bg-black/40' : 
                  task.priority === 'medium' ? 'border-l-yellow-500 bg-black/30' : 
                  'border-l-green-500 bg-black/20'
                } ${task.completed ? 'opacity-50' : ''}`}
                onClick={() => navigate(`/clients/${task.prospect_id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="min-w-[24px]">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full hover:bg-white/20"
                      onClick={(e) => handleCompleteTask(task.id, task.completed, e)}
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-black/80 backdrop-blur-md border border-white/20">
          <h2 className="text-xl font-bold mb-4">Task Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70">High Priority</span>
              <span className="font-bold">{tasks.filter(t => t.priority === 'high').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Medium Priority</span>
              <span className="font-bold">{tasks.filter(t => t.priority === 'medium').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Low Priority</span>
              <span className="font-bold">{tasks.filter(t => t.priority === 'low').length}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
              <span className="font-bold">Total Tasks</span>
              <span className="font-bold">{tasks.length}</span>
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
              onClick={() => navigate('/prospect-status')}
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
