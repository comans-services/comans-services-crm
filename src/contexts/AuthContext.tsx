
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, AuthSession, getCurrentSession } from '@/services/authService';
import { getUserProfile, TeamMember } from '@/services/teamService';
import ProfileSetupDialog from '@/components/auth/ProfileSetupDialog';

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  userProfile: TeamMember | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  refreshUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [userProfile, setUserProfile] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
      
      // If the user is authenticated but has no profile or incomplete profile, show setup dialog
      if (!profile || !profile.first_name || !profile.last_name) {
        setShowProfileSetup(true);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const refreshUserProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If we've signed in, do any additional setup asynchronously
        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            console.log('User signed in:', currentSession.user.email);
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { session, user } = await getCurrentSession();
        setSession(session);
        setUser(user);
        
        if (user) {
          await fetchUserProfile(user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
    refreshUserProfile();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userProfile,
      isLoading, 
      isAuthenticated: !!user,
      refreshUserProfile
    }}>
      {children}
      
      {showProfileSetup && user && (
        <ProfileSetupDialog 
          isOpen={showProfileSetup} 
          onComplete={handleProfileSetupComplete} 
          userId={user.id}
        />
      )}
    </AuthContext.Provider>
  );
};
