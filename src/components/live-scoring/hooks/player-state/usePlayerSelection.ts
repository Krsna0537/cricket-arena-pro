
import { useState } from 'react';
import { Player } from '@/types';

export function usePlayerSelection() {
  // Batting and bowling state
  const [striker, setStriker] = useState<Player | null>(null);
  const [nonStriker, setNonStriker] = useState<Player | null>(null);
  const [bowler, setBowler] = useState<Player | null>(null);
  const [showPlayerSelect, setShowPlayerSelect] = useState(true);
  
  const swapBatsmen = () => {
    const temp = striker;
    setStriker(nonStriker);
    setNonStriker(temp);
  };

  // Helper function to get player avatar or placeholder
  const getPlayerAvatar = (player: Player | null) => {
    if (!player) return null;
    return player.avatar || `/placeholder.svg`;
  };

  return {
    striker,
    setStriker,
    nonStriker,
    setNonStriker,
    bowler, 
    setBowler,
    showPlayerSelect,
    setShowPlayerSelect,
    swapBatsmen,
    getPlayerAvatar
  };
}
