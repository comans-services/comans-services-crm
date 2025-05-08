
import { supabase } from '@/integrations/supabase/client';

/**
 * Sets up real-time subscriptions for a table
 */
export const setupRealTimeSubscription = (
  table: string, 
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
) => {
  const channel = supabase
    .channel('table-changes')
    .on(
      'postgres_changes',
      {
        event: event,
        schema: 'public',
        table: table
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
