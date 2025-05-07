
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
              size="lg"
            >
              {r}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Extras & Wicket</h4>
        <div className="grid grid-cols-5 gap-2">
          <Button onClick={() => handleBall('wicket')} disabled={!isLive || isLoading} variant="destructive" size="lg" className="font-semibold">
            Wicket
          </Button>
          <Button onClick={() => handleBall('wide')} disabled={!isLive || isLoading} variant="outline" size="lg" className="border-2 border-amber-500 text-amber-600">
            Wide
          </Button>
          <Button onClick={() => handleBall('no-ball')} disabled={!isLive || isLoading} variant="outline" size="lg" className="border-2 border-orange-500 text-orange-600">
            No Ball
          </Button>
          <Button onClick={() => handleBall('bye')} disabled={!isLive || isLoading} variant="outline" size="lg" className="border-2 border-purple-500 text-purple-600">
            Bye
          </Button>
          <Button onClick={() => handleBall('leg-bye')} disabled={!isLive || isLoading} variant="outline" size="lg" className="border-2 border-indigo-500 text-indigo-600">
            Leg Bye
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Quick Actions</h4>
        <div className="grid grid-cols-4 gap-2">
          <Button onClick={() => handleBall('run', 1, 0)} disabled={!isLive || isLoading} variant="secondary" size="lg">
            1 + Strike Change
          </Button>
          <Button onClick={() => handleBall('wide', 0, 1)} disabled={!isLive || isLoading} variant="secondary" size="lg">
            Wide + 1
          </Button>
          <Button onClick={() => handleBall('no-ball', 1, 1)} disabled={!isLive || isLoading} variant="secondary" size="lg">
            No Ball + 1
          </Button>
          <Button onClick={() => handleBall('bye', 0, 1)} disabled={!isLive || isLoading} variant="secondary" size="lg">
            Bye + 1
          </Button>
        </div>
      </div>
    </>
  );
};
