
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

  return {
    striker,
    setStriker,
    nonStriker,
    setNonStriker,
    bowler, 
    setBowler,
    showPlayerSelect,
    setShowPlayerSelect,
    swapBatsmen
  };
}
