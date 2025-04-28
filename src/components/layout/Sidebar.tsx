
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, Settings, Trello, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Clients List', path: '/clients', icon: <Users size={20} /> },
    { name: 'Client Pipeline', path: '/clients/kanban', icon: <Trello size={20} /> },
    { name: 'Newsletters', path: '/newsletters', icon: <Mail size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu size={24} />
      </Button>

      <div className={`fixed inset-y-0 left-0 z-40 transform ${isCollapsed ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-200 ease-in-out md:translate-x-0`}>
        <div className="w-72 h-screen bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white">ComansServicesCRM</h1>
          </div>
          
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
