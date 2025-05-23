
// Disconnected version of supabase base services

/**
 * Sets up real-time subscriptions for a table (disconnected version)
 */
export const setupRealTimeSubscription = (
  table: string, 
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
): (() => void) => {
  // Return an empty cleanup function
  return () => {
    // No-op since we're disconnected
  };
};
