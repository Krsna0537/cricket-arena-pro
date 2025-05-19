import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MenuIcon, Trophy, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface NavbarProps {
  toggleSidebar?: () => void;
  isAdmin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isAdmin = false }) => {
  const { user, profile, userRole, signOut } = useAuth();

  const getInitials = () => {
    if (!profile) return '?';
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    return (first + last).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          {toggleSidebar && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-cricket-navy dark:text-cricket-accent" />
            <span className="text-xl font-bold text-cricket-navy dark:text-cricket-accent">Cricket Arena Pro</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              {userRole === 'creator' && (
                <Link to="/dashboard">
                  <Button size="sm" variant="outline">Dashboard</Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.profile_picture || ''} />
                      <AvatarFallback className="bg-cricket-navy text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {profile?.first_name ? (
                      <span>
                        {profile.first_name} {profile.last_name}
                      </span>
                    ) : (
                      <span>My Account</span>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {userRole === 'viewer' && (
                    <DropdownMenuItem asChild>
                      <Link to="/join" className="cursor-pointer">
                        <Trophy className="mr-2 h-4 w-4" />
                        <span>Join Tournament</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/join">
                <Button size="sm" className="bg-cricket-navy hover:bg-cricket-navy-light dark:bg-cricket-accent dark:text-black">Join Tournament</Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
