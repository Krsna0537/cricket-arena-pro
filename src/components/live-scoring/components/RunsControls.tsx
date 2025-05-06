
import React from 'react';
import { Button } from '@/components/ui/button';
import { BallEventType } from '@/types';

interface RunsControlsProps {
  isLive: boolean;
  isLoading: boolean;
  handleBall: (eventType: BallEventType, runs?: number, extras?: number) => void;
}

export const RunsControls: React.FC<RunsControlsProps> = ({ 
  isLive,
  isLoading,
  handleBall
}) => {
  return (
    <>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Runs</h4>
        <div className="grid grid-cols-7 gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map(r => (
            <Button 
              key={r} 
              onClick={() => handleBall('run', r, 0)} 
              disabled={!isLive || isLoading}
              className={
                r === 4 ? "bg-blue-600 hover:bg-blue-700" :
                r === 6 ? "bg-green-600 hover:bg-green-700" :
                undefined
              }
            >
              {r}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Extras & Wicket</h4>
        <div className="grid grid-cols-5 gap-2">
          <Button onClick={() => handleBall('wicket')} disabled={!isLive || isLoading} variant="destructive">
            Wicket
          </Button>
          <Button onClick={() => handleBall('wide')} disabled={!isLive || isLoading} variant="outline">
            Wide
          </Button>
          <Button onClick={() => handleBall('no-ball')} disabled={!isLive || isLoading} variant="outline">
            No Ball
          </Button>
          <Button onClick={() => handleBall('bye')} disabled={!isLive || isLoading} variant="outline">
            Bye
          </Button>
          <Button onClick={() => handleBall('leg-bye')} disabled={!isLive || isLoading} variant="outline">
            Leg Bye
          </Button>
        </div>
      </div>
    </>
  );
};
