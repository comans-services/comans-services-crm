
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, Settings, UsersRound, MessageSquare, Calendar } from 'lucide-react';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isExpanded: boolean;
  activeIndex: number;
  index: number;
}

const SidebarLink = ({ to, icon, label, isExpanded, activeIndex, index }: SidebarLinkProps) => {
  const isActive = activeIndex === index;

  return (
    <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
      {icon}
      {isExpanded && <span>{label}</span>}
    </Link>
  );
};

const Sidebar = ({ isExpanded, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const links = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard /> },
    { to: "/clients", label: "Clients", icon: <Users /> },
    { to: "/todaystasks", label: "Today's Tasks", icon: <Calendar /> },
    { to: "/prospect-status", label: "Status of Prospects", icon: <MessageSquare /> },
    { to: "/email-communications", label: "Email Communications", icon: <Mail /> },
    { to: "/newsletters", label: "Newsletters", icon: <Mail /> },
    { to: "/team", label: "Team", icon: <UsersRound /> },
    { to: "/settings", label: "Settings", icon: <Settings /> },
  ];
  
  const activeIndex = links.findIndex(link => {
    if (link.to === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(link.to);
  });

  return (
    <div className={`fixed top-0 left-0 h-full bg-[#0a0d27] border-r border-white/5 transition-all duration-300 ease-in-out ${isExpanded ? 'w-72' : 'w-20'} z-50`}>
      <div className="p-4">
        <button onClick={onToggle} className="text-white/70 hover:text-white transition-colors">
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      <nav className="p-4 flex flex-col">
        {links.map((link, index) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            isExpanded={isExpanded}
            activeIndex={activeIndex}
            index={index}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
