
import React from 'react';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-72 p-4 md:p-8 animate-fade-in">
        <div className="flex justify-end mb-4">
          <UserMenu />
        </div>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
