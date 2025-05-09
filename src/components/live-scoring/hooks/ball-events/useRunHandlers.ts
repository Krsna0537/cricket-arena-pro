
import { Player, Match, BallEvent, BallEventType } from '@/types';

// Define the props interface for clarity and type safety
interface RunHandlersProps {
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
  };
  addBallEvent: (event: any) => Promise<any>;
  toast: any;
  setIsLoading: (loading: boolean) => void;
  setBowler: (bowler: Player | null) => void;
  setShowPlayerSelect: (show: boolean) => void;
}

export function useRunHandlers({
  match,
  inning,
  team1,
  team2,
  events,
  summary,
  onUpdateScore,
  players,
  addBallEvent,
  setBowler,
  setShowPlayerSelect
}: RunHandlersProps) {
  // Handle regular runs
  const handleRunsEvent = async (eventType: BallEventType, runs = 0, extras = 0) => {
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
      batsmanId: players.striker!.id,
      bowlerId: players.bowler!.id,
      nonStrikerId: players.nonStriker!.id,
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
        batsmanId: players.striker!.id,
        bowlerId: players.bowler!.id,
        nonStrikerId: players.nonStriker!.id,
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
      setBowler(null);
      setShowPlayerSelect(true);
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
  };

  return {
    handleRunsEvent
  };
}
