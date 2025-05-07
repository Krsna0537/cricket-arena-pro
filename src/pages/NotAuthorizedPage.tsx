
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NotAuthorizedPage = () => {
  const { userRole } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0">
        <img 
          src="/images/cricket-boundary.jpg" 
          alt="Cricket Boundary" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-red-500 mb-6 relative z-10">
        <ShieldAlert className="h-24 w-24" />
      </div>
      <h1 className="text-3xl font-bold mb-2 relative z-10">Access Denied</h1>
      <p className="text-gray-600 text-center mb-6 max-w-md relative z-10">
        You don't have permission to access this page. 
        {userRole === 'viewer' && (
          " This page requires creator privileges."
        )}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/profile">View Your Profile</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
