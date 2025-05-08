
import { useState } from 'react';
import { Player, Match, BallEvent, WicketType, BallEventType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/context/AppContext';

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
  }
) {
  const { toast } = useToast();
  const { addBallEvent } = useApp();
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Wicket taking fields
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [wicketType, setWicketType] = useState<WicketType | ''>('');
  const [fielder, setFielder] = useState<Player | null>(null);
  
  // Extras fields
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [extrasType, setExtrasType] = useState<string>('');
  const [extrasRuns, setExtrasRuns] = useState<number>(1);

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
        setShowWicketModal(true);
        setIsLoading(false);
        return;
      }
      
      // Handle extras
      if (['wide', 'no-ball', 'bye', 'leg-bye'].includes(eventType)) {
        setExtrasType(eventType);
        setShowExtrasModal(true);
        setIsLoading(false);
        return;
      }
      
      // Determine ball number: legal deliveries only for ball count
      const legalCount = events.filter(e => !['wide', 'no-ball'].includes(e.eventType)).length;
      const nextLegal = (!['wide', 'no-ball'].includes(eventType)) ? legalCount + 1 : legalCount;
      const overNum = Math.floor((nextLegal - 1) / 6) + 1;
      const ballNum = (!['wide', 'no-ball'].includes(eventType)) ? ((nextLegal - 1) % 6) + 1 : (legalCount % 6) + 1;
      
      const battingTeamId = inning === 1 ? team1!.id : team2!.id;
      
      // Record the ball event with detailed logging
      console.log('[LiveScoring] addBallEvent payload', {
        matchId: match.id,
        teamId: battingTeamId,
        inning,
        over: overNum,
        ball: ballNum,
        eventType,
        runs,
        extras,
        batsmanId: players.striker.id,
        bowlerId: players.bowler.id,
        nonStrikerId: players.nonStriker.id,
        isStriker: true
      });
      
      try {
        await addBallEvent({
          matchId: match.id,
          teamId: battingTeamId,
          inning,
          over: overNum,
          ball: ballNum,
          eventType,
          runs,
          extras,
          batsmanId: players.striker.id,
          bowlerId: players.bowler.id,
          nonStrikerId: players.nonStriker.id,
          isStriker: true
        });
        
        console.log('[LiveScoring] addBallEvent success');
      } catch (e) {
        console.error('[LiveScoring] addBallEvent error', e);
        throw e;
      }
      
      // Strike rotation logic
      let swap = false;
      if (eventType === 'run' && runs % 2 === 1) swap = true;
      
      // End of over: swap strike and prompt for new bowler
      if (ballNum === 6 && !['wide', 'no-ball'].includes(eventType)) {
        swap = !swap;
        players.setBowler(null);
        players.setShowPlayerSelect(true);
      }
      
      if (swap) {
        const temp = players.striker;
        players.setStriker(players.nonStriker);
        players.setNonStriker(temp);
      }
      
      // Auto-update match score
      const updatedMatch = {...match};
      if (inning === 1) {
        updatedMatch.scoreTeam1 = {
          runs: summary.runs + runs + extras,
          wickets: summary.wickets,
          overs: summary.overs + (!['wide', 'no-ball'].includes(eventType) ? 0.1 : 0)
        };
      } else {
        updatedMatch.scoreTeam2 = {
          runs: summary.runs + runs + extras,
          wickets: summary.wickets,
          overs: summary.overs + (!['wide', 'no-ball'].includes(eventType) ? 0.1 : 0)
        };
      }
      onUpdateScore(updatedMatch);
    } catch (e) {
      console.error('[LiveScoring] addBallEvent error', String(e));
      toast({
        title: "Error",
        description: "Failed to record ball event: " + String(e),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }
  
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
        eventType: extrasType as BallEventType,
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
    isLoading,
    showWicketModal,
    setShowWicketModal,
    wicketType,
    setWicketType,
    fielder,
    setFielder,
    showExtrasModal,
    setShowExtrasModal,
    extrasType,
    setExtrasType,
    extrasRuns,
    setExtrasRuns,
    handleBall,
    handleWicketConfirm,
    handleExtrasConfirm
  };
}
