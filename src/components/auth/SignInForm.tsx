
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signIn, cleanupAuthState } from '@/services/authService';

interface SignInFormProps {
  onSignInSuccess: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSignInSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        // The profile setup dialog will appear automatically if needed
        onSignInSuccess();
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};

export default SignInForm;
