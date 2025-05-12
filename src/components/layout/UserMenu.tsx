
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/services/authService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(`Error logging out: ${error.message}`);
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-2 rounded-full transition-colors">
            <div className="w-8 h-8 rounded-full bg-crm-accent flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium">{user?.email || 'User'}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-lg border-white/10 text-white">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-white/10"
            onClick={() => navigate('/settings')}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Account Info</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-white/10"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-white/10 text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
