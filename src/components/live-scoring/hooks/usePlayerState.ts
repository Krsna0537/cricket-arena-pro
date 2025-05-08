
import { useState, useEffect } from 'react';
import { Player, Team } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { BallEvent } from '@/types';
import { fetchBallEvents } from '@/services/scoring';

export function usePlayerState(
  match: { id: string },
  inning: number,
  team1?: Team,
  team2?: Team,
  events: BallEvent[]
) {
  const { toast } = useToast();
  
  // Batting and bowling state
  const [striker, setStriker] = useState<Player | null>(null);
  const [nonStriker, setNonStriker] = useState<Player | null>(null);
  const [bowler, setBowler] = useState<Player | null>(null);
  const [showPlayerSelect, setShowPlayerSelect] = useState(true);
  const [availableBatsmen, setAvailableBatsmen] = useState<Player[]>([]);
  const [availableBowlers, setAvailableBowlers] = useState<Player[]>([]);
  
  // Set available batsmen and bowlers at the start of the innings
  useEffect(() => {
    async function fetchAndSetData() {
      try {
        // Set available players for this innings
        if (inning === 1 && team1) {
          setAvailableBatsmen([...team1.players]);
          setAvailableBowlers(team2?.players || []);
        } else if (inning === 2 && team2) {
          setAvailableBatsmen([...team2.players]);
          setAvailableBowlers(team1?.players || []);
        }
        
        // Check if there are existing events to determine if we should show player select
        const existingEvents = await fetchBallEvents(match.id, inning);
        
        if (existingEvents && existingEvents.length > 0) {
          // Find the most recent striker, non-striker and bowler
          const batsmen = Array.from(new Set(existingEvents.map(e => e.batsmanId)));
          const nonStrikers = Array.from(new Set(existingEvents.filter(e => e.nonStrikerId).map(e => e.nonStrikerId)));
          
          // Find current batsmen who haven't got out
          const outBatsmen = existingEvents
            .filter(e => e.eventType === 'wicket')
            .map(e => e.batsmanId);
            
          const activeBatsmen = batsmen.filter(id => !outBatsmen.includes(id));
          
          if (activeBatsmen.length >= 2) {
            // We have both striker and non-striker
            const strikerId = existingEvents[existingEvents.length - 1].batsmanId;
            const strikerPlayer = inning === 1 
              ? team1?.players.find(p => p.id === strikerId)
              : team2?.players.find(p => p.id === strikerId);
              
            const nonStrikerId = existingEvents[existingEvents.length - 1].nonStrikerId;
            const nonStrikerPlayer = inning === 1 
              ? team1?.players.find(p => p.id === nonStrikerId)
              : team2?.players.find(p => p.id === nonStrikerId);
              
            if (strikerPlayer) setStriker(strikerPlayer);
            if (nonStrikerPlayer) setNonStriker(nonStrikerPlayer);
            
            // Also find the bowler
            const lastBowlerId = existingEvents[existingEvents.length - 1].bowlerId;
            const bowlerPlayer = inning === 1
              ? team2?.players.find(p => p.id === lastBowlerId)
              : team1?.players.find(p => p.id === lastBowlerId);
              
            if (bowlerPlayer) setBowler(bowlerPlayer);
            
            setShowPlayerSelect(false);
          } else {
            setShowPlayerSelect(true);
          }
        } else {
          setShowPlayerSelect(true);
        }
      } catch (error) {
        console.error("Error loading player data:", error);
        toast({
          title: "Error",
          description: "Failed to load player data",
          variant: "destructive"
        });
      }
    }
    
    fetchAndSetData();
  }, [inning, team1, team2, match.id, toast]);

  // Remove out batsman from available batsmen
  const updateAvailableBatsmenAfterWicket = (outBatsmanId: string) => {
    setAvailableBatsmen(prev => prev.filter(p => p.id !== outBatsmanId));
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
    availableBatsmen,
    setAvailableBatsmen,
    availableBowlers,
    setAvailableBowlers,
    updateAvailableBatsmenAfterWicket
  };
}
