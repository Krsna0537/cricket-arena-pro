
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ExtrasModalProps {
  extrasType: string;
  extrasRuns: number;
  setExtrasRuns: (runs: number) => void;
  handleExtrasConfirm: () => void;
  setShowExtrasModal: (show: boolean) => void;
  setExtrasType: (type: string) => void;
  isLoading: boolean;
}

export const ExtrasModal: React.FC<ExtrasModalProps> = ({ 
  extrasType,
  extrasRuns, 
  setExtrasRuns,
  handleExtrasConfirm,
  setShowExtrasModal,
  setExtrasType,
  isLoading
}) => {
  return (
    <div className="mb-4 p-4 border border-yellow-300 bg-yellow-50 rounded">
      <h4 className="font-bold mb-3">Extras Details</h4>
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Extras Type</label>
          <div className="px-3 py-2 bg-white border rounded capitalize">{extrasType}</div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Runs (including extras)</label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map(run => (
              <Button
                key={run}
                variant={extrasRuns === run ? "default" : "outline"}
                className="flex-1"
                onClick={() => setExtrasRuns(run)}
              >
                {run}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={handleExtrasConfirm}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Extras
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setShowExtrasModal(false);
            setExtrasType('');
            setExtrasRuns(1);
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
