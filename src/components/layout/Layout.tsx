
import React from 'react';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 animate-fade-in">
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
