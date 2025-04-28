
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, Settings, Trello, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isExpanded, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
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
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu size={24} />
      </Button>

      <div className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:translate-x-0`}>
        <div className={`${isExpanded ? 'w-72' : 'w-20'} h-screen bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col transition-all duration-300`}>
          <div className={`p-6 flex items-center justify-between ${!isExpanded && 'px-3'}`}>
            {isExpanded ? (
              <h1 className="text-2xl font-bold text-white">ComansServicesCRM</h1>
            ) : (
              <h1 className="text-2xl font-bold text-white">CS</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hidden md:flex"
            >
              {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </Button>
          </div>
          
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`nav-item ${location.pathname === item.path ? 'active' : ''} ${!isExpanded && 'justify-center'}`}
                    title={!isExpanded ? item.name : undefined}
                  >
                    {item.icon}
                    {isExpanded && <span>{item.name}</span>}
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
