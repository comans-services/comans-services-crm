
import React from 'react';
import { Save } from 'lucide-react';

const Settings = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the settings here
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-6">Company Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="company-name" className="block text-sm text-white/70 mb-2">
                    Company Name
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                    defaultValue="Ember LLC"
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm text-white/70 mb-2">
                    Website
                  </label>
                  <input
                    id="website"
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                    defaultValue="https://ember.example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm text-white/70 mb-2">
                    Contact Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                    defaultValue="contact@ember.example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm text-white/70 mb-2">
                    Contact Phone
                  </label>
                  <input
                    id="phone"
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                    defaultValue="(123) 456-7890"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="address" className="block text-sm text-white/70 mb-2">
                  Company Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                  defaultValue="123 Business St, Suite 100, New York, NY 10001"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Email Settings</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="sender-name" className="block text-sm text-white/70 mb-2">
                  Sender Name
                </label>
                <input
                  id="sender-name"
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                  defaultValue="Ember CRM"
                />
                <p className="text-xs text-white/50 mt-2">
                  This name will appear in the "From" field of your newsletters.
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="reply-to" className="block text-sm text-white/70 mb-2">
                  Reply-to Email
                </label>
                <input
                  id="reply-to"
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                  defaultValue="newsletters@ember.example.com"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email-signature" className="block text-sm text-white/70 mb-2">
                  Email Signature
                </label>
                <textarea
                  id="email-signature"
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                  defaultValue="Best regards,\nThe Ember Team\ncontact@ember.example.com\n(123) 456-7890"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Account Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/70">Account Type</p>
                <p className="font-medium">Professional</p>
              </div>
              
              <div>
                <p className="text-sm text-white/70">Member Since</p>
                <p className="font-medium">April 15, 2023</p>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <button className="w-full btn-primary">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-bold mb-4">API Integration</h2>
            <div className="mb-4">
              <p className="text-sm text-white/70">API Key</p>
              <div className="flex mt-2">
                <input
                  type="password"
                  readOnly
                  value="••••••••••••••••••••"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-l-md text-white focus:outline-none"
                />
                <button className="bg-white/10 hover:bg-white/20 px-4 border border-white/20 border-l-0 rounded-r-md transition-colors">
                  View
                </button>
              </div>
            </div>
            
            <div>
              <button className="w-full mt-2 py-2 px-4 border border-white/20 rounded-md hover:bg-white/10 transition-colors">
                Regenerate API Key
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
