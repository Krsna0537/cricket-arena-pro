
import { useState } from 'react';
import { WicketType, Player, Match, BallEvent } from '@/types';

// Define the props interface for clarity and type safety
interface WicketHandlersProps {
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
    setStriker: (player: Player | null) => void;
    nonStriker: Player | null;
    setNonStriker: (player: Player | null) => void;
    bowler: Player | null;
    setBowler: (player: Player | null) => void;
    setShowPlayerSelect: (show: boolean) => void;
    updateAvailableBatsmenAfterWicket: (id: string) => void;
  };
  addBallEvent: (event: any) => Promise<any>;
  toast: any;
  setIsLoading: (loading: boolean) => void;
}

export function useWicketHandlers({
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
}: WicketHandlersProps) {
  // Wicket taking fields
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [wicketType, setWicketType] = useState<WicketType | ''>('');
  const [fielder, setFielder] = useState<Player | null>(null);
  
  // Handle wicket confirmation
  const handleWicketConfirm = async () => {
    if (!wicketType) {
      toast({
        title: "Wicket Type Required",
        description: "Please select how the batsman got out",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Determine ball number
      const legalCount = events.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
      const nextLegal = legalCount + 1;
      const overNum = Math.floor((nextLegal - 1) / 6) + 1;
      const ballNum = ((nextLegal - 1) % 6) + 1;
      
      // Record the wicket
      await addBallEvent({
        matchId: match.id,
        teamId: inning === 1 ? team1!.id : team2!.id,
        inning,
        over: overNum,
        ball: ballNum,
        eventType: 'wicket',
        runs: 0,
        extras: 0,
        batsmanId: players.striker!.id,
        bowlerId: players.bowler!.id,
        nonStrikerId: players.nonStriker!.id,
        isStriker: true,
        wicketType: wicketType as WicketType,
        fielderId: fielder?.id
      });
      
      // Update the UI
      setShowWicketModal(false);
      setWicketType('');
      setFielder(null);
      
      // Prompt for new batsman
      players.setShowPlayerSelect(true);
      players.updateAvailableBatsmenAfterWicket(players.striker!.id);
      players.setStriker(null);
      
      // Auto-update match score
      const updatedMatch = {...match};
      if (inning === 1) {
        updatedMatch.scoreTeam1 = {
          runs: summary.runs,
          wickets: summary.wickets + 1,
          overs: summary.overs + 0.1
        };
      } else {
        updatedMatch.scoreTeam2 = {
          runs: summary.runs,
          wickets: summary.wickets + 1,
          overs: summary.overs + 0.1
        };
      }
      onUpdateScore(updatedMatch);
      
      toast({
        title: "Wicket Recorded",
        description: `${players.striker?.name} is out ${wicketType}`
      });
    } catch (error) {
      console.error("Error recording wicket:", error);
      toast({
        title: "Error",
        description: "Failed to record wicket",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showWicketModal,
    setShowWicketModal,
    wicketType,
    setWicketType,
    fielder,
    setFielder,
    handleWicketConfirm
  };
}
