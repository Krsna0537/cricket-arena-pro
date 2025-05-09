
import { useState } from 'react';
import { Player, Match, BallEvent } from '@/types';

// Define the props interface for clarity and type safety
interface ExtrasHandlersProps {
  match: Match;
  inning: number;
  team1: { id: string, players: Player[] } | undefined;
  team2: { id: string, players: Player[] } | undefined;
  events: BallEvent[];
  summary: { 
    runs: number; 
    wickets: number; 
    overs: number; 
  };
  onUpdateScore: (match: Match) => void;
  players: {
    striker: Player | null;
    nonStriker: Player | null;
    bowler: Player | null;
  };
  addBallEvent: (event: any) => Promise<any>;
  toast: any;
  setIsLoading: (loading: boolean) => void;
}

export function useExtrasHandlers({
  match,
  inning,
  team1,
  team2,
  events,
  summary,
  onUpdateScore,
  players,
  addBallEvent,
  toast,
  setIsLoading
}: ExtrasHandlersProps) {
  // Extras fields
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [extrasType, setExtrasType] = useState<string>('');
  const [extrasRuns, setExtrasRuns] = useState<number>(1);

  // Handle extras confirmation
  const handleExtrasConfirm = async () => {
    try {
      setIsLoading(true);
      
      // Determine ball number
      const legalCount = events.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
      const nextLegal = (extrasType === 'wide' || extrasType === 'no-ball') ? legalCount : legalCount + 1;
      const overNum = Math.floor((nextLegal - 1) / 6) + 1;
      const ballNum = (extrasType === 'wide' || extrasType === 'no-ball') ? (legalCount % 6) + 1 : ((nextLegal - 1) % 6) + 1;
      
      // Record the extras
      await addBallEvent({
        matchId: match.id,
        teamId: inning === 1 ? team1!.id : team2!.id,
        inning,
        over: overNum,
        ball: ballNum,
        eventType: extrasType as any,
        runs: 0,
        extras: extrasRuns,
        batsmanId: players.striker!.id,
        bowlerId: players.bowler!.id,
        nonStrikerId: players.nonStriker!.id,
        isStriker: true,
        extrasType: extrasType
      });
      
      // Reset extras form
      setShowExtrasModal(false);
      setExtrasType('');
      setExtrasRuns(1);
      
      // Auto-update match score
      const updatedMatch = {...match};
      if (inning === 1) {
        updatedMatch.scoreTeam1 = {
          runs: summary.runs + extrasRuns,
          wickets: summary.wickets,
          overs: summary.overs + (extrasType !== 'wide' && extrasType !== 'no-ball' ? 0.1 : 0)
        };
      } else {
        updatedMatch.scoreTeam2 = {
          runs: summary.runs + extrasRuns,
          wickets: summary.wickets,
          overs: summary.overs + (extrasType !== 'wide' && extrasType !== 'no-ball' ? 0.1 : 0)
        };
      }
      onUpdateScore(updatedMatch);
      
      toast({
        title: "Extras Recorded",
        description: `${extrasRuns} run(s) added as ${extrasType}`
      });
    } catch (error) {
      console.error("Error recording extras:", error);
      toast({
        title: "Error",
        description: "Failed to record extras",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showExtrasModal,
    setShowExtrasModal,
    extrasType,
    setExtrasType,
    extrasRuns,
    setExtrasRuns,
    handleExtrasConfirm
  };
}
