
import React from 'react';
import { BallEvent, Team } from '@/types';

interface BallLogProps {
  events: BallEvent[];
  inning: number;
  team1?: Team;
  team2?: Team;
}

export const BallLog: React.FC<BallLogProps> = ({ events, inning, team1, team2 }) => {
  const sortedEvents = [...events].sort((a, b) => {
    if (a.over !== b.over) return b.over - a.over;
    return b.ball - a.ball;
  });
  
  const groupedByOver = sortedEvents.reduce((acc, event) => {
    const overKey = `Over ${event.over}`;
    if (!acc[overKey]) acc[overKey] = [];
    acc[overKey].push(event);
    return acc;
  }, {} as Record<string, BallEvent[]>);
  
  const formatBall = (event: BallEvent) => {
    const batsmanName = (inning === 1 ? team1?.players : team2?.players)?.find(p => p.id === event.batsmanId)?.name || 'Unknown';
    const bowlerName = (inning === 1 ? team2?.players : team1?.players)?.find(p => p.id === event.bowlerId)?.name || 'Unknown';
    
    if (event.eventType === 'wicket') {
      return <span className="text-red-600 font-bold">WICKET! {batsmanName} out</span>;
    }
    
    if (event.eventType === 'wide') {
      return <span>Wide, {event.extras} run(s)</span>;
    }
    
    if (event.eventType === 'no-ball') {
      return <span>No Ball, {event.extras} run(s)</span>;
    }
    
    if (event.eventType === 'bye') {
      return <span>{event.extras} Bye(s)</span>;
    }
    
    if (event.eventType === 'leg-bye') {
      return <span>{event.extras} Leg Bye(s)</span>;
    }
    
    if (event.runs === 4) {
      return <span className="text-blue-600">FOUR by {batsmanName}</span>;
    }
    
    if (event.runs === 6) {
      return <span className="text-green-600">SIX by {batsmanName}</span>;
    }
    
    return <span>{event.runs} run(s) by {batsmanName}</span>;
  };
  
  return (
    <div>
      <div className="font-semibold text-base mb-2">Commentary</div>
      {Object.entries(groupedByOver).length > 0 ? (
        Object.entries(groupedByOver).map(([overKey, overEvents]) => (
          <div key={overKey} className="mb-4">
            <div className="font-semibold mb-2">{overKey}</div>
            <div className="space-y-2">
              {overEvents
                .sort((a, b) => b.ball - a.ball)
                .map((event, idx) => (
                  <div key={`${event.over}.${event.ball}-${idx}`} className="text-sm border-l-2 border-gray-300 pl-3 py-1">
                    <span className="font-mono text-xs bg-gray-200 px-1 rounded mr-2">{event.over}.{event.ball}</span>
                    {formatBall(event)}
                  </div>
                ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No balls bowled yet</div>
      )}
    </div>
  );
};
