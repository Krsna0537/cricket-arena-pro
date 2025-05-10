import React from 'react';
import { BallEvent } from '@/types';
import { Badge } from '@/components/ui/badge';

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
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
      <h3 className="font-bold text-lg mb-3 text-gray-800">Over {latestOverNum}</h3>
      <div className="flex flex-wrap gap-3">
        {currentOverEvents.length > 0 ? (
          currentOverEvents.map((e, i) => {
            const ballClass = e.eventType === 'wicket' ? 'bg-red-500 border-red-600 text-white' :
              e.eventType === 'wide' || e.eventType === 'no-ball' ? 'bg-yellow-200 border-yellow-400' :
              e.runs === 4 ? 'bg-blue-500 border-blue-600 text-white' : 
              e.runs === 6 ? 'bg-green-500 border-green-600 text-white' :
              e.runs === 0 ? 'bg-gray-200 border-gray-300' :
              'bg-gray-100 border-gray-200';
            
            return (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-500 mb-1">{e.over}.{e.ball}</div>
                <Badge 
                  className={`text-base py-3 px-4 font-mono font-bold shadow-sm border ${ballClass}`}
                  variant="outline"
                >
                  {formatBall(e)}
                </Badge>
              </div>
            );
          })
        ) : (
          <span className="text-gray-500 italic">New over will start</span>
        )}
      </div>
      
      {currentOverEvents.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-600">
          <span className="font-medium">This over: </span>
          {currentOverEvents.reduce((sum, e) => sum + e.runs + e.extras, 0)} runs, 
          {' '}{currentOverEvents.filter(e => e.eventType === 'wicket').length} wicket(s)
        </div>
      )}
    </div>
  );
};
