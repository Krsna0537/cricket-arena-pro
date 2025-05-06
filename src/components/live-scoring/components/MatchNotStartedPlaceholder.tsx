
import React from 'react';
import { AlertCircle } from 'lucide-react';

const MatchNotStartedPlaceholder: React.FC = () => {
  return (
    <div className="text-center py-8">
      <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      <h3 className="text-lg font-bold mb-2">Match Not Started</h3>
      <p className="text-gray-500 mb-6">Click the "Start Match" button to begin live scoring</p>
    </div>
  );
};

export default MatchNotStartedPlaceholder;
