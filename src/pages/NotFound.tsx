
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80"
          alt="Cricket Field" 
          className="h-96 object-contain"
          loading="lazy"
        />
      </div>
      <div className="text-center space-y-4 relative z-10">
        <h1 className="text-6xl font-bold text-cricket-navy">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
        <div className="mt-8">
          <Link to="/">
            <Button className="bg-cricket-navy hover:bg-cricket-navy-light">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
