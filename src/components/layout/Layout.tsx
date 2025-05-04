
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ isAdmin = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar toggleSidebar={toggleSidebar} isAdmin={isAdmin} />
      {isAdmin && <Sidebar isSidebarOpen={isSidebarOpen} />}
      <main className={`flex-1 ${isAdmin && isSidebarOpen ? 'md:ml-64' : ''}`}>
        <div className="container mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
