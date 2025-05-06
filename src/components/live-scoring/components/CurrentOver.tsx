
import React from 'react';
import { BallEvent } from '@/types';

interface CurrentOverProps {
  events: BallEvent[];
}

export const CurrentOver: React.FC<CurrentOverProps> = ({ events }) => {
  // Get balls in current over
  const latestOverNum = events.length > 0 
    ? Math.max(...events.map(e => e.over))
    : 0;
    
  const currentOverEvents = events
    .filter(e => e.over === latestOverNum)
    .sort((a, b) => a.ball - b.ball);
    
  const formatBall = (event: BallEvent) => {
    if (event.eventType === 'wicket') return 'W';
    if (event.eventType === 'wide') return 'WD';
    if (event.eventType === 'no-ball') return 'NB';
    if (event.eventType === 'bye') return `${event.extras}B`;
    if (event.eventType === 'leg-bye') return `${event.extras}LB`;
    if (event.runs > 0) return event.runs.toString();
    return '•'; // dot ball
  };
  
  return (
    <div className="mb-4">
      <div className="font-semibold text-base mb-2">This Over</div>
      <div className="flex flex-wrap gap-2">
        {currentOverEvents.length > 0 ? (
          currentOverEvents.map((e, i) => {
            const ballClass = e.eventType === 'wicket' ? 'bg-red-200' :
              e.eventType === 'wide' || e.eventType === 'no-ball' ? 'bg-yellow-200' :
              e.runs === 4 ? 'bg-blue-200' : 
              e.runs === 6 ? 'bg-green-200' :
              'bg-gray-200';
            
            return (
              <span key={i} className={`px-3 py-1.5 rounded-full font-mono ${ballClass}`}>
                {formatBall(e)}
              </span>
            );
          })
        ) : (
          <span className="text-gray-500">New over will start</span>
        )}
      </div>
    </div>
  );
};
