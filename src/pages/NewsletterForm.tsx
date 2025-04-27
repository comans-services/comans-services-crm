
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Send } from 'lucide-react';

const NewsletterForm = () => {
  const navigate = useNavigate();
  const [scheduleLater, setScheduleLater] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the newsletter data here
    // For now, just navigate back to the newsletters list
    navigate('/newsletters');
  };
  
  return (
    <div>
      <button 
        onClick={() => navigate('/newsletters')}
        className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to newsletters
      </button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Newsletter</h1>
      </div>
      
      <div className="card mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm text-white/70 mb-2">
              Newsletter Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
              placeholder="May Newsletter"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm text-white/70 mb-2">
              Email Subject
            </label>
            <input
              id="subject"
              type="text"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
              placeholder="Important updates for May 2023"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm text-white/70 mb-2">
              Email Content
            </label>
            <textarea
              id="content"
              rows={10}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
              placeholder="Write your newsletter content here..."
            ></textarea>
            <p className="text-xs text-white/50 mt-2">
              This is a simple text editor. In a full application, a rich text editor would be implemented here.
            </p>
          </div>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recipients</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="all-clients" 
                className="w-5 h-5 bg-white/5 border border-white/20 rounded" 
              />
              <label htmlFor="all-clients" className="ml-3">All Clients (124)</label>
            </div>
            
            <div className="border-t border-white/10 py-3">
              <h3 className="font-medium mb-3">By Company</h3>
              
              {['Acme Corp', 'Wayne Industries', 'Stark Enterprises', 'ABC Holdings'].map((company, i) => (
                <div key={i} className="flex items-center mb-2">
                  <input 
                    type="checkbox" 
                    id={`company-${i}`} 
                    className="w-5 h-5 bg-white/5 border border-white/20 rounded" 
                  />
                  <label htmlFor={`company-${i}`} className="ml-3">{company}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Scheduling</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input 
                type="radio" 
                name="schedule" 
                id="send-now" 
                className="w-5 h-5" 
                checked={!scheduleLater}
                onChange={() => setScheduleLater(false)}
              />
              <label htmlFor="send-now" className="ml-3 flex items-center">
                <Send size={18} className="mr-2" />
                Send Immediately
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="radio" 
                name="schedule" 
                id="schedule-later" 
                className="w-5 h-5" 
                checked={scheduleLater}
                onChange={() => setScheduleLater(true)}
              />
              <label htmlFor="schedule-later" className="ml-3 flex items-center">
                <Calendar size={18} className="mr-2" />
                Schedule for Later
              </label>
            </div>
            
            {scheduleLater && (
              <div className="mt-4 pl-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm text-white/70 mb-2">
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm text-white/70 mb-2">
                      Time
                    </label>
                    <input
                      id="time"
                      type="time"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
                    />
                  </div>
                </div>
                
                <div className="flex items-center mt-4">
                  <Clock size={16} className="text-white/70 mr-2" />
                  <span className="text-sm text-white/70">
                    Your local timezone: EDT (UTC-4)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <button 
          type="button" 
          className="px-4 py-2 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
          onClick={() => navigate('/newsletters')}
        >
          Save as Draft
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          {scheduleLater ? 'Schedule Newsletter' : 'Send Newsletter'}
        </button>
      </div>
    </div>
  );
};

export default NewsletterForm;
