
// Mock implementation of auth service with working login/logout
import { User, Session } from '@supabase/supabase-js';

export type AuthUser = User;
export type AuthSession = Session;

// Mock session and user for local usage
const createMockSession = (email: string): { user: AuthUser; session: AuthSession } => {
  const userId = `mock-${new Date().getTime()}`;
  
  const mockUser: AuthUser = {
    id: userId,
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: email,
    role: 'authenticated',
    identities: null,
  } as AuthUser;

  const mockSession: AuthSession = {
    access_token: `mock-token-${userId}`,
    refresh_token: `mock-refresh-${userId}`,
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: mockUser
  } as AuthSession;

  return { user: mockUser, session: mockSession };
};

// Local storage keys
const USER_STORAGE_KEY = 'crm_mock_user';
const SESSION_STORAGE_KEY = 'crm_mock_session';

// Get stored authentication data
const getStoredAuth = (): { user: AuthUser | null; session: AuthSession | null } => {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    
    return { 
      user: storedUser ? JSON.parse(storedUser) : null,
      session: storedSession ? JSON.parse(storedSession) : null
    };
  } catch {
    return { user: null, session: null };
  }
};

/**
 * Sign up with email and password (mock version)
 */
export const signUp = async (email: string, password: string): Promise<{ user: AuthUser | null; session: AuthSession | null; error: string | null }> => {
  try {
    // Create mock user and session
    const { user, session } = createMockSession(email);
    
    // Store user and session in localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    
    return { user, session, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err.message || 'Error signing up' };
  }
};

/**
 * Sign in with email and password (mock version)
 */
export const signIn = async (email: string, password: string): Promise<{ user: AuthUser | null; session: AuthSession | null; error: string | null }> => {
  try {
    // Create mock user and session
    const { user, session } = createMockSession(email);
    
    // Store user and session in localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    
    // Dispatch a custom event for auth changes
    window.dispatchEvent(new CustomEvent('mockAuthChange', { 
      detail: { event: 'SIGNED_IN', session } 
    }));
    
    return { user, session, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err.message || 'Error signing in' };
  }
};

/**
 * Sign out the current user (mock version)
 */
export const signOut = async (): Promise<void> => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(SESSION_STORAGE_KEY);
  
  // Dispatch a custom event for auth changes
  window.dispatchEvent(new CustomEvent('mockAuthChange', { 
    detail: { event: 'SIGNED_OUT', session: null } 
  }));
};

/**
 * Get the current user and session (mock version)
 */
export const getCurrentSession = async (): Promise<{ user: AuthUser | null; session: AuthSession | null }> => {
  return getStoredAuth();
};

/**
 * Clean up all auth state (mock version)
 */
export const cleanupAuthState = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(SESSION_STORAGE_KEY);
};
