
import React from 'react';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'ml-0 md:ml-72' : 'ml-0 md:ml-20'}`}>
        <div className="sticky top-0 right-0 p-4 md:p-8 bg-transparent backdrop-blur-sm z-50">
          <div className="flex justify-end">
            <UserMenu />
          </div>
        </div>
        <main className="p-4 md:p-8 pt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
