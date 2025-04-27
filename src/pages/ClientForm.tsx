
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ClientForm = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the form data here
    // For now, just navigate back to the clients list
    navigate('/clients');
  };
  
  return (
    <div>
      <button 
        onClick={() => navigate('/clients')}
        className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to clients
      </button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Client</h1>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm text-white/70 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                placeholder="John Smith"
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm text-white/70 mb-2">
                Company
              </label>
              <input
                id="company"
                type="text"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                placeholder="Acme Corp"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm text-white/70 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm text-white/70 mb-2">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="address" className="block text-sm text-white/70 mb-2">
              Address
            </label>
            <input
              id="address"
              type="text"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
              placeholder="123 Main St, City, State, ZIP"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm text-white/70 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
              placeholder="Add any notes about this client..."
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              className="px-4 py-2 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => navigate('/clients')}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
