
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NotAuthorizedPage = () => {
  const { userRole } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-red-500 mb-6">
        <ShieldAlert className="h-24 w-24" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        You don't have permission to access this page. 
        {userRole === 'viewer' && (
          " This page requires creator privileges. You can update your role in your profile settings."
        )}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/profile">View Your Profile</Link>
        </Button>
        {userRole === 'viewer' && (
          <Button variant="secondary" asChild>
            <Link to="/profile" className="text-amber-700 border-amber-500">
              Upgrade to Creator
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
