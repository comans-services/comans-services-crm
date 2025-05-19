
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthCardProps {
  onSignInSuccess: () => void;
}

const AuthCard: React.FC<AuthCardProps> = ({ onSignInSuccess }) => {
  return (
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
          <SignInForm onSignInSuccess={onSignInSuccess} />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignUpForm onSignUpSuccess={() => {
            // Switch to sign in tab after successful signup
            document.getElementById('signin-tab')?.click();
          }} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthCard;
