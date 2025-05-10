import { useState } from 'react';
import { Player, Match, BallEvent, BallEventType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/context/AppContext';
import { useWicketHandlers } from './useWicketHandlers';
import { useExtrasHandlers } from './useExtrasHandlers';
import { useRunHandlers } from './useRunHandlers';

export function useBallEventHandlers(
  match: Match,
  inning: number,
  team1: { id: string, players: Player[] } | undefined,
  team2: { id: string, players: Player[] } | undefined,
  events: BallEvent[],
  summary: { 
    runs: number; 
    wickets: number; 
    overs: number; 
  },
  onUpdateScore: (match: Match) => void,
  players: {
    striker: Player | null;
    setStriker: (player: Player | null) => void;
    nonStriker: Player | null;
    setNonStriker: (player: Player | null) => void;
    bowler: Player | null;
    setBowler: (player: Player | null) => void;
    setShowPlayerSelect: (show: boolean) => void;
    updateAvailableBatsmenAfterWicket: (id: string) => void;
  },
  handleCompleteInnings: () => void
) {
  const { toast } = useToast();
  const { addBallEvent } = useApp();
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize sub-handlers
  const wicketHandlers = useWicketHandlers({
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
  });
  
  const extrasHandlers = useExtrasHandlers({
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
  });
  
  const runHandlers = useRunHandlers({
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
    setIsLoading,
    setBowler: players.setBowler,
    setShowPlayerSelect: players.setShowPlayerSelect
  });

  // Handle a new ball event
  async function handleBall(eventType: BallEventType, runs = 0, extras = 0) {
    console.log('[LiveScoring] handleBall called', { 
      eventType, runs, extras, 
      striker: players.striker, 
      nonStriker: players.nonStriker, 
      bowler: players.bowler,
      match: match
    });
    
    if (!players.striker || !players.nonStriker || !players.bowler) {
      toast({ 
        title: 'Select players', 
        description: 'Please select batsmen and bowler first', 
        variant: 'destructive' 
      });
      players.setShowPlayerSelect(true);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Handle wicket
      if (eventType === 'wicket') {
        wicketHandlers.setShowWicketModal(true);
        setIsLoading(false);
        return;
      }
      
      // Handle extras
      if (['wide', 'no-ball', 'bye', 'leg-bye'].includes(eventType)) {
        extrasHandlers.setExtrasType(eventType);
        extrasHandlers.setShowExtrasModal(true);
        setIsLoading(false);
        return;
      }
      
      // Handle regular runs
      await runHandlers.handleRunsEvent(eventType, runs, extras);
      
      // Auto-end innings if over limit reached
      const legalBalls = events.filter(e => !['wide', 'no-ball'].includes(e.eventType)).length + 1; // +1 for this ball
      if (legalBalls >= match.overs * 6) {
        handleCompleteInnings();
      }
      
    } catch (e) {
      console.error('[LiveScoring] addBallEvent error', e);
      toast({
        title: "Error",
        description: "Failed to record ball event: " + (e?.message || JSON.stringify(e)),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    ...wicketHandlers,
    ...extrasHandlers,
    handleBall
  };
}
