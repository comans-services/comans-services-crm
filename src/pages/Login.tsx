
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { signIn, signUp, cleanupAuthState } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Get the intended destination from location state, or default to "/"
  const from = location.state?.from?.pathname || '/';
  
  useEffect(() => {
    // If user is already authenticated, redirect to the intended destination
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt to sign in
      const { user, error } = await signIn(email, password);
      
      if (error) {
        toast.error(error);
        return;
      }
      
      if (user) {
        toast.success('Login successful');
        // Navigate to the intended destination
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt to sign up
      const { user, error } = await signUp(email, password);
      
      if (error) {
        toast.error(error);
        return;
      }
      
      if (user) {
        toast.success('Account created successfully. Please check your email to confirm your account.');
        // Switch to sign in tab after successful signup
        document.getElementById('signin-tab')?.click();
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crm-background-from to-crm-background-to">
      <div className="w-full max-w-md p-8 space-y-8 card backdrop-blur-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">ComansServicesCRM</h1>
          <p className="mt-2 text-white/75">Sign in to access your dashboard</p>
        </div>
        
        <Tabs defaultValue="signin" className="mt-8">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger id="signin-tab" value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form className="space-y-6" onSubmit={handleSignIn}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="signin-email" className="block text-sm font-medium text-white/90 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="signin-password" className="block text-sm font-medium text-white/90">
                      Password
                    </label>
                    <a href="#" className="text-xs text-crm-accent hover:text-crm-accent/80">
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form className="space-y-6" onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-white/90 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-white/90 mb-1">
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-white/90 mb-1">
                    Confirm Password
                  </label>
                  <Input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
