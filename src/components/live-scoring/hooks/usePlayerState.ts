import { Player, Team } from '@/types';
import { BallEvent } from '@/types';
import { usePlayerSelection } from './player-state/usePlayerSelection';
import { useAvailablePlayersState } from './player-state/useAvailablePlayersState';
import { useEffect } from 'react';

export function usePlayerState(
  match: { id: string },
  inning: number,
  team1: Team | undefined,
  team2: Team | undefined,
  events: BallEvent[],
  maxOversPerBowler: number | null = null
) {
  // Use the player selection hook
  const playerSelection = usePlayerSelection();
  
  // Find previous over's bowler
  let previousBowlerId: string | null = null;
  if (events && events.length > 0) {
    // Find the last completed over
    const legalBalls = events.filter(e => !['wide', 'no-ball'].includes(e.eventType));
    if (legalBalls.length > 0) {
      const lastBall = legalBalls[legalBalls.length - 1];
      if (lastBall.ball === 6) {
        previousBowlerId = lastBall.bowlerId;
      } else if (legalBalls.length >= 6) {
        // Find the last over's last ball
        const lastOverBalls = legalBalls.slice(-6);
        if (lastOverBalls[0].ball === 1 && lastOverBalls[5].ball === 6) {
          previousBowlerId = lastOverBalls[5].bowlerId;
        }
      }
    }
  }

  // Use the available players hook
  const availablePlayers = useAvailablePlayersState(
    match,
    inning,
    team1,
    team2,
    events,
    playerSelection.setStriker,
    playerSelection.setNonStriker,
    playerSelection.setBowler,
    playerSelection.setShowPlayerSelect,
    previousBowlerId,
    maxOversPerBowler
  );

  // Reset player state on innings change
  useEffect(() => {
    playerSelection.setStriker(null);
    playerSelection.setNonStriker(null);
    playerSelection.setBowler(null);
    playerSelection.setShowPlayerSelect(true);
  }, [inning]);

  // Return combined state and functions
  return {
    ...playerSelection,
    ...availablePlayers
  };
}
