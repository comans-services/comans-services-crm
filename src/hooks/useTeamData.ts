
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTeamMembers, getUserActivity, setupRealTimeSubscription } from '@/services/teamService';
import { useEffect } from 'react';

export const useTeamData = () => {
  const queryClient = useQueryClient();
  
  // Fetch team members
  const { 
    data: teamMembers = [], 
    isLoading: isLoadingTeam,
    error: teamError
  } = useQuery({
    queryKey: ['team-members'],
    queryFn: getTeamMembers
  });

  // Fetch activity logs
  const { 
    data: activityLog = [], 
    isLoading: isLoadingActivity,
    error: activityError
  } = useQuery({
    queryKey: ['user-activity'],
    queryFn: () => getUserActivity(10)
  });

  // Set up real-time subscriptions
  useEffect(() => {
    const unsubTeam = setupRealTimeSubscription('app_user', '*', () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    });
    
    const unsubActivity = setupRealTimeSubscription('user_activity', '*', () => {
      queryClient.invalidateQueries({ queryKey: ['user-activity'] });
    });
    
    return () => {
      unsubTeam();
      unsubActivity();
    };
  }, [queryClient]);

  return {
    teamMembers,
    activityLog,
    isLoading: isLoadingTeam || isLoadingActivity,
    error: teamError || activityError
  };
};
