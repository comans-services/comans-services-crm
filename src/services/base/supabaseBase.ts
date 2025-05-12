
import { supabase } from '@/integrations/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * Sets up real-time subscriptions for a table
 */
export const setupRealTimeSubscription = (
  table: string, 
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: RealtimePostgresChangesPayload<Record<string, any>>) => void
): (() => void) => {
  const channel = supabase
    .channel(`table-changes:${table}`)
    .on(
      'postgres_changes', // Fix: Changed from 'system' to 'postgres_changes'
      {
        event: event,
        schema: 'public',
        table: table
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
