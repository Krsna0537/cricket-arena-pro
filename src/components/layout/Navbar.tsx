
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MenuIcon, Trophy, User } from 'lucide-react';

interface NavbarProps {
  toggleSidebar?: () => void;
  isAdmin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isAdmin = false }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          {toggleSidebar && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-cricket-navy" />
            <span className="text-xl font-bold text-cricket-navy">Cricket Arena Pro</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <Link to="/dashboard">
              <Button size="sm" variant="outline">Dashboard</Button>
            </Link>
          ) : (
            <Link to="/join">
              <Button size="sm" className="bg-cricket-navy hover:bg-cricket-navy-light">Join Tournament</Button>
            </Link>
          )}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">User account</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
