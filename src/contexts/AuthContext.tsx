
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AuthUser, AuthSession, getCurrentSession } from '@/services/authService';

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up a mock auth state listener
    const handleAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { session } = customEvent.detail;
      setSession(session);
      setUser(session?.user || null);
    };

    // Add event listener for our custom auth events
    window.addEventListener('mockAuthChange', handleAuthChange);

    // Check for existing session on mount
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { user, session } = await getCurrentSession();
        setUser(user);
        setSession(session);
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      window.removeEventListener('mockAuthChange', handleAuthChange);
    };
  }, []);

  const contextValue = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
