
import React from 'react';
import { BallEvent, Team } from '@/types';

interface BowlingCardProps {
  events: BallEvent[];
  inning: number;
  team1?: Team;
  team2?: Team;
  bowler: { id: string; name: string } | null;
}

export const BowlingCard: React.FC<BowlingCardProps> = ({ 
  events, 
  inning, 
  team1, 
  team2,
  bowler
}) => {
  // Get all bowlers who have bowled (from events)
  const bowlerIds = Array.from(new Set(events.map(e => e.bowlerId)));
  
  const bowlingCards = bowlerIds.map(id => {
    const player = 
      (inning === 1 ? team2?.players : team1?.players)?.find(p => p.id === id) ||
      {id, name: `Player ${id.substring(0,4)}`};
    
    const playerEvents = events.filter(e => e.bowlerId === id);
    const balls = playerEvents.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
    const completedOvers = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    
    const runs = playerEvents.reduce((acc, e) => acc + e.runs + e.extras, 0);
    const wickets = playerEvents.filter(e => e.eventType === 'wicket').length;
    
    // Calculate maidens (0 runs in a complete over)
    let maidens = 0;
    for (let over = 1; over <= completedOvers; over++) {
      const overEvents = playerEvents.filter(e => e.over === over);
      const overRuns = overEvents.reduce((acc, e) => acc + e.runs + e.extras, 0);
      if (overRuns === 0 && overEvents.length > 0) {
        maidens++;
      }
    }
    
    let economy = 0;
    if (balls > 0) {
      const oversDecimal = balls / 6;
      economy = runs / oversDecimal;
    }
    
    return {
      playerId: id,
      playerName: player.name,
      overs: completedOvers + (remainingBalls / 10), // Display as e.g., 4.3
      maidens,
      runs,
      wickets,
      economy: parseFloat(economy.toFixed(2)),
      isCurrentBowler: bowler?.id === id
    };
  });

  return (
    <div className="mb-4">
      <div className="font-semibold text-base mb-2">Bowling</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Bowler</th>
              <th className="text-center">O</th>
              <th className="text-center">M</th>
              <th className="text-center">R</th>
              <th className="text-center">W</th>
              <th className="text-center">ECON</th>
            </tr>
          </thead>
          <tbody>
            {bowlingCards.map((b) => (
              <tr key={b.playerId} className={`${b.isCurrentBowler ? 'font-bold' : ''} border-b`}>
                <td className="py-2">{b.playerName} {b.isCurrentBowler && '🎯'}</td>
                <td className="text-center">{b.overs.toFixed(1)}</td>
                <td className="text-center">{b.maidens}</td>
                <td className="text-center">{b.runs}</td>
                <td className="text-center">{b.wickets}</td>
                <td className="text-center">{b.economy.toFixed(2)}</td>
              </tr>
            ))}
            
            {bowlingCards.length === 0 && (
              <tr>
                <td colSpan={6} className="py-2 text-center text-gray-500">No bowlers yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
