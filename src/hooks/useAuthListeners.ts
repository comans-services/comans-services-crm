
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, AuthSession } from '@/services/authService';

/**
 * Sets up authentication state listeners
 */
export const setupAuthListeners = (
  setSession: (session: AuthSession | null) => void,
  setUser: (user: AuthUser | null) => void
) => {
  // Set up auth state listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // If we've signed in, do any additional setup asynchronously
      if (event === 'SIGNED_IN' && currentSession?.user) {
        // Use setTimeout to prevent potential deadlocks
        setTimeout(() => {
          console.log('User signed in:', currentSession.user.email);
        }, 0);
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
};
