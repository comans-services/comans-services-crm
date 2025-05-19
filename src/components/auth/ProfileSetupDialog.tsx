
import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateUserProfile } from '@/services/teamService';

interface ProfileSetupDialogProps {
  isOpen: boolean;
  onComplete: () => void;
  userId: string;
}

const ProfileSetupDialog = ({ isOpen, onComplete, userId }: ProfileSetupDialogProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'admin' | 'salesperson'>('salesperson');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Please enter both your first and last name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateUserProfile(userId, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role
      });
      
      toast.success('Profile setup complete!');
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-[#0f133e] text-white border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription className="text-white/70">
            Please provide your name and role to complete your profile setup.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-sm font-medium block text-white mb-1">
                First Name
              </label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="text-sm font-medium block text-white mb-1">
                Last Name
              </label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="role" className="text-sm font-medium block text-white mb-1">
              Your Role
            </label>
            <Select 
              value={role} 
              onValueChange={(value: 'admin' | 'salesperson') => setRole(value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f133e] border-white/20">
                <SelectItem value="admin" className="text-white hover:bg-white/10">Admin</SelectItem>
                <SelectItem value="salesperson" className="text-white hover:bg-white/10">Salesperson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700 text-white w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Complete Setup'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetupDialog;
