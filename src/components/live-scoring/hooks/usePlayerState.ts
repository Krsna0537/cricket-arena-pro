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
  events: BallEvent[]
) {
  // Use the player selection hook
  const playerSelection = usePlayerSelection();
  
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
    playerSelection.setShowPlayerSelect
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
