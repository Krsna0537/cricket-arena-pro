
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Trophy, 
  Users, 
  Calendar, 
  BarChart2, 
  Settings,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Tournaments', path: '/dashboard', icon: <Trophy /> },
    { name: 'Teams', path: '/teams', icon: <Users /> },
    { name: 'Schedule', path: '/schedule', icon: <Calendar /> },
    { name: 'Statistics', path: '/statistics', icon: <BarChart2 /> },
    { name: 'Live Scores', path: '/live', icon: <TrendingUp /> },
    { name: 'Settings', path: '/settings', icon: <Settings /> },
  ];

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-sidebar text-sidebar-foreground shadow-md lg:block md:block">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
              isActive(item.path) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
            )}
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
