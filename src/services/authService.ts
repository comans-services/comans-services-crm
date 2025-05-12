
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Session, User } from '@supabase/supabase-js';

export type AuthUser = User;
export type AuthSession = Session;

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string): Promise<{ user: AuthUser | null; session: AuthSession | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error: any) {
    console.error('Error signing up:', error);
    return { user: null, session: null, error: error.message };
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string): Promise<{ user: AuthUser | null; session: AuthSession | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error: any) {
    console.error('Error signing in:', error);
    return { user: null, session: null, error: error.message };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    // Clean up existing auth state first
    cleanupAuthState();
    
    // Then perform the signout
    await supabase.auth.signOut({ scope: 'global' });
    
    // Force a page reload to reset all app state
    window.location.href = '/login';
  } catch (error: any) {
    console.error('Error signing out:', error);
    toast.error(`Error signing out: ${error.message}`);
  }
};

/**
 * Get the current user and session
 */
export const getCurrentSession = async (): Promise<{ user: AuthUser | null; session: AuthSession | null }> => {
  const { data } = await supabase.auth.getSession();
  return { 
    user: data.session?.user || null, 
    session: data.session || null 
  };
};

/**
 * Clean up all auth state to prevent authentication limbo
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};
