
import React from 'react';
import { WicketType, Player, Team } from '@/types';
import { BallEvent } from '@/types';

interface BattingCardProps {
  events: BallEvent[];
  inning: number;
  team1?: Team;
  team2?: Team;
  striker: Player | null;
  nonStriker: Player | null;
}

export const BattingCard: React.FC<BattingCardProps> = ({ 
  events, 
  inning, 
  team1, 
  team2,
  striker,
  nonStriker
}) => {
  // Get all batsmen who have batted (from events)
  const batsmanIds = Array.from(new Set(events.map(e => e.batsmanId)));
  
  const battingCards = batsmanIds.map(id => {
    const player = 
      (inning === 1 ? team1?.players : team2?.players)?.find(p => p.id === id) || 
      {id, name: `Player ${id.substring(0,4)}`};
    
    const playerEvents = events.filter(e => e.batsmanId === id);
    const balls = playerEvents.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
    const runs = playerEvents.reduce((acc, e) => acc + e.runs, 0);
    const fours = playerEvents.filter(e => e.runs === 4).length;
    const sixes = playerEvents.filter(e => e.runs === 6).length;
    
    const isOut = playerEvents.some(e => e.eventType === 'wicket');
    const wicketEvent = playerEvents.find(e => e.eventType === 'wicket');
    
    const wicketType = wicketEvent?.wicketType as WicketType | undefined;
    const bowlerId = wicketEvent?.bowlerId;
    const fielderId = wicketEvent?.fielderId;
    
    const sr = balls > 0 ? ((runs / balls) * 100).toFixed(1) : '0.0';
    
    return { 
      playerId: id,
      playerName: player.name, 
      runs, 
      balls, 
      fours, 
      sixes, 
      strikeRate: parseFloat(sr),
      isOut, 
      wicketType,
      bowlerId,
      fielderId,
      isStriker: striker?.id === id,
      isNonStriker: nonStriker?.id === id
    };
  });

  return (
    <div className="mb-4">
      <div className="font-semibold text-base mb-2">Batting</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Batsman</th>
              <th className="text-center">R</th>
              <th className="text-center">B</th>
              <th className="text-center">4s</th>
              <th className="text-center">6s</th>
              <th className="text-center">SR</th>
            </tr>
          </thead>
          <tbody>
            {battingCards.map((b) => {
              const bowlerName = b.bowlerId 
                ? ((inning === 1 ? team2 : team1)?.players.find(p => p.id === b.bowlerId)?.name || 'Unknown')
                : '';
                
              const fielderName = b.fielderId
                ? ((inning === 1 ? team2 : team1)?.players.find(p => p.id === b.fielderId)?.name || 'Unknown')
                : '';
              
              // Format dismissal text
              let dismissalText = '';
              if (b.isOut && b.wicketType) {
                switch (b.wicketType) {
                  case 'bowled':
                    dismissalText = `b ${bowlerName}`;
                    break;
                  case 'caught':
                    dismissalText = `c ${fielderName} b ${bowlerName}`;
                    break;
                  case 'lbw':
                    dismissalText = `lbw b ${bowlerName}`;
                    break;
                  case 'run-out':
                    dismissalText = `run out (${fielderName})`;
                    break;
                  case 'stumped':
                    dismissalText = `st ${fielderName} b ${bowlerName}`;
                    break;
                  case 'hit-wicket':
                    dismissalText = `hit wicket b ${bowlerName}`;
                    break;
                }
              }
              
              return (
                <tr key={b.playerId} className={`${b.isStriker || b.isNonStriker ? 'font-bold' : ''} border-b`}>
                  <td className="py-2">
                    {b.playerName} {b.isStriker ? '⚡' : b.isNonStriker ? '🏏' : ''}
                    {b.isOut ? 
                      <span className="text-xs text-gray-600 block">{dismissalText}</span> :
                      b.isStriker || b.isNonStriker ? <span className="text-xs text-green-600 block">not out</span> : ''
                    }
                  </td>
                  <td className="text-center">{b.runs}</td>
                  <td className="text-center">{b.balls}</td>
                  <td className="text-center">{b.fours}</td>
                  <td className="text-center">{b.sixes}</td>
                  <td className="text-center">{b.strikeRate}</td>
                </tr>
              );
            })}
            
            {battingCards.length === 0 && (
              <tr>
                <td colSpan={6} className="py-2 text-center text-gray-500">No batsmen yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
