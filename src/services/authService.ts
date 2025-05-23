
// Disconnected implementation of auth service
import { User, Session } from '@supabase/supabase-js';

export type AuthUser = User;
export type AuthSession = Session;

/**
 * Sign up with email and password (disconnected version)
 */
export const signUp = async (email: string, password: string): Promise<{ user: AuthUser | null; session: AuthSession | null; error: string | null }> => {
  return { user: null, session: null, error: 'Supabase connection removed' };
};

/**
 * Sign in with email and password (disconnected version)
 */
export const signIn = async (email: string, password: string): Promise<{ user: AuthUser | null; session: AuthSession | null; error: string | null }> => {
  return { user: null, session: null, error: 'Supabase connection removed' };
};

/**
 * Sign out the current user (disconnected version)
 */
export const signOut = async (): Promise<void> => {
  // No-op since we're disconnected
};

/**
 * Get the current user and session (disconnected version)
 */
export const getCurrentSession = async (): Promise<{ user: AuthUser | null; session: AuthSession | null }> => {
  return { user: null, session: null };
};

/**
 * Clean up all auth state (disconnected version)
 */
export const cleanupAuthState = () => {
  // No-op since we're disconnected
};
