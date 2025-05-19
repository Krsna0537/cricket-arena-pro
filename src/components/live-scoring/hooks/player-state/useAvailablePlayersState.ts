import { useState, useEffect } from 'react';
import { Player, Team, BallEvent } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { fetchBallEvents } from '@/services/scoring';

export function useAvailablePlayersState(
  match: { id: string },
  inning: number,
  team1: Team | undefined,
  team2: Team | undefined,
  events: BallEvent[],
  setStriker: (player: Player | null) => void,
  setNonStriker: (player: Player | null) => void,
  setBowler: (player: Player | null) => void,
  setShowPlayerSelect: (show: boolean) => void,
  previousBowlerId: string | null = null,
  maxOversPerBowler: number | null = null
) {
  const { toast } = useToast();
  
  const [availableBatsmen, setAvailableBatsmen] = useState<Player[]>([]);
  const [availableBowlers, setAvailableBowlers] = useState<Player[]>([]);
  
  // Set available batsmen and bowlers at the start of the innings
  useEffect(() => {
    async function fetchAndSetData() {
      try {
        // Set available players for this innings
        let bowlers: Player[] = [];
        if (inning === 1 && team2) {
          bowlers = team2.players;
        } else if (inning === 2 && team1) {
          bowlers = team1.players;
        }
        // Only allow bowlers and all-rounders
        bowlers = bowlers.filter(p => p.role === 'bowler' || p.role === 'all-rounder');

        // Exclude previous over's bowler (no consecutive overs)
        if (previousBowlerId) {
          bowlers = bowlers.filter(p => p.id !== previousBowlerId);
        }

        // Enforce max overs per bowler if set
        if (maxOversPerBowler !== null) {
          // Count overs bowled by each player
          const bowlerOverCount: Record<string, number> = {};
          events.forEach(e => {
            if (e.bowlerId && !['wide', 'no-ball'].includes(e.eventType)) {
              if (!bowlerOverCount[e.bowlerId]) bowlerOverCount[e.bowlerId] = 0;
              // Count only the first ball of each over for each bowler
              if (e.ball === 1) bowlerOverCount[e.bowlerId] += 1;
            }
          });
          bowlers = bowlers.filter(p => (bowlerOverCount[p.id] || 0) < maxOversPerBowler);
        }

        setAvailableBowlers(bowlers);

        // Set available batsmen
        if (inning === 1 && team1) {
          setAvailableBatsmen([...team1.players]);
        } else if (inning === 2 && team2) {
          setAvailableBatsmen([...team2.players]);
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
  }, [inning, team1, team2, match.id, toast, setStriker, setNonStriker, setBowler, setShowPlayerSelect, previousBowlerId, maxOversPerBowler, events]);

  // Remove out batsman from available batsmen
  const updateAvailableBatsmenAfterWicket = (outBatsmanId: string) => {
    setAvailableBatsmen(prev => prev.filter(p => p.id !== outBatsmanId));
  };

  return {
    availableBatsmen,
    setAvailableBatsmen,
    availableBowlers,
    setAvailableBowlers,
    updateAvailableBatsmenAfterWicket
  };
}
