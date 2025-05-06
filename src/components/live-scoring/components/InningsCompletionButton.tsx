
import React from 'react';
import { Button } from '@/components/ui/button';
import { Disc, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface InningsCompletionButtonProps {
  inning: number;
  isLoading: boolean;
  handleCompleteInnings: () => void;
  summary: { runs: number };
}

export const InningsCompletionButton: React.FC<InningsCompletionButtonProps> = ({ 
  inning, 
  isLoading, 
  handleCompleteInnings,
  summary
}) => {
  if (inning !== 1) return null;
  
  return (
    <div className="mt-6">
      <Alert className="bg-blue-50">
        <Info className="h-4 w-4" />
        <AlertTitle>First Innings</AlertTitle>
        <AlertDescription>
          When the first innings is complete, end it here to set the target.
        </AlertDescription>
      </Alert>
      <Button 
        className="mt-4 w-full" 
        variant="outline" 
        onClick={handleCompleteInnings}
        disabled={isLoading || summary.runs === 0}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>
            <Disc className="mr-2 h-4 w-4" />
            End First Innings
          </>
        )}
      </Button>
    </div>
  );
};
