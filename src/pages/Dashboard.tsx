
import React from 'react';
import { Users, Mail, Calendar, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
  <div className="card hover-scale">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/70 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 20, className: 'stroke-2' })}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="btn-primary">+ Add Client</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Clients" 
          value={124} 
          icon={<Users />}
          color="bg-blue-500/20 text-blue-500"
        />
        <StatCard 
          title="New Clients" 
          value={8} 
          icon={<TrendingUp />}
          color="bg-green-500/20 text-green-500"
        />
        <StatCard 
          title="Newsletters Sent" 
          value={36} 
          icon={<Mail />}
          color="bg-crm-accent/20 text-crm-accent"
        />
        <StatCard 
          title="Scheduled" 
          value={2} 
          icon={<Calendar />}
          color="bg-purple-500/20 text-purple-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card col-span-2">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                  {i % 2 === 0 ? <Mail size={18} /> : <Users size={18} />}
                </div>
                <div>
                  <p className="font-medium">
                    {i % 2 === 0 ? 'Monthly Newsletter' : 'New Client Added'}
                  </p>
                  <p className="text-sm text-white/70">
                    {i % 2 === 0 
                      ? 'Newsletter sent to 25 clients' 
                      : 'Acme Corp was added as a new client'}
                  </p>
                  <p className="text-xs text-white/50 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Top Clients</h2>
          <div className="space-y-4">
            {['Acme Corp', 'Wayne Industries', 'Stark Enterprises', 'ABC Holdings'].map((client, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-crm-background-from to-crm-background-to flex items-center justify-center mr-3">
                    <span className="font-bold text-xs">{client.substring(0, 2)}</span>
                  </div>
                  <p>{client}</p>
                </div>
                <span className="text-xs text-white/50">
                  {Math.round(Math.random() * 10) + 1} newsletters
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
