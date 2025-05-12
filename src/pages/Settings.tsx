
import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/services/authService';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [userData, setUserData] = useState({
    username: user?.user_metadata?.username || user?.email?.split('@')[0] || "User",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the settings here
    toast.success("Settings saved successfully");
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      toast.error(`Error logging out: ${error.message}`);
    }
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <div className="card max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-white/70">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-white/70">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
              disabled={!!user?.email} // Disable if email is from auth
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-white/70">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
            />
          </div>
          
          <div className="pt-4">
            <Button 
              type="button" 
              onClick={handleLogout}
              className="w-full bg-crm-accent hover:bg-crm-accent/90 text-white"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
