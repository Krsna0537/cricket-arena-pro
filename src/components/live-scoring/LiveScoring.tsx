import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Team, Match, BallEventType, BallEvent, Player, WicketType, BattingCard, BowlingCard, InningsSummary } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useApp, useLiveBallEvents } from '@/context/AppContext';
import { AlertCircle, ChevronRight, Disc, Info, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface LiveScoringProps {
  match: Match;
  team1?: Team;
  team2?: Team;
  onUpdateScore: (match: Match) => void;
}

const LiveScoring: React.FC<LiveScoringProps> = ({ match, team1, team2, onUpdateScore }) => {
  const { toast } = useToast();
  const isLive = match.status === 'live';
  const { addBallEvent, fetchBallEvents, fetchInningsSummary, upsertInningsSummary } = useApp();

  // Inning state (1 or 2)
  const [inning, setInning] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("scoring");
  
  // Batting and bowling state
  const [striker, setStriker] = useState<Player | null>(null);
  const [nonStriker, setNonStriker] = useState<Player | null>(null);
  const [bowler, setBowler] = useState<Player | null>(null);
  const [showPlayerSelect, setShowPlayerSelect] = useState(true);
  const [availableBatsmen, setAvailableBatsmen] = useState<Player[]>([]);
  const [availableBowlers, setAvailableBowlers] = useState<Player[]>([]);
  
  // Wicket taking fields
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [wicketType, setWicketType] = useState<WicketType | ''>('');
  const [fielder, setFielder] = useState<Player | null>(null);
  
  // Extras fields
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [extrasType, setExtrasType] = useState<string>('');
  const [extrasRuns, setExtrasRuns] = useState<number>(1);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  
  // Real-time ball events
  const events = useLiveBallEvents(match.id, inning);
  
  // First innings completion
  const [inning1Complete, setInning1Complete] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Score summary
  const summary = React.useMemo(() => {
    const legalCount = events.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
    const completeOvers = Math.floor(legalCount / 6);
    const ballsInCurrentOver = legalCount % 6;
    const overs = completeOvers + (ballsInCurrentOver / 10);
    
    const runs = events.reduce((acc, e) => acc + e.runs + e.extras, 0);
    const wickets = events.filter(e => e.eventType === 'wicket').length;
    
    const extras = events.reduce((acc, e) => acc + e.extras, 0);
    const fours = events.filter(e => e.runs === 4).length;
    const sixes = events.filter(e => e.runs === 6).length;
    
    return { 
      runs, 
      wickets, 
      overs,
      completeOvers,
      ballsInCurrentOver,
      extras,
      fours,
      sixes
    };
  }, [events]);
  
  // Calculate run rate
  const runRate = React.useMemo(() => {
    if (summary.completeOvers === 0) return 0;
    return (summary.runs / (summary.completeOvers + (summary.ballsInCurrentOver / 6))).toFixed(2);
  }, [summary]);

  // Set available batsmen and bowlers at the start of the innings
  useEffect(() => {
    async function fetchAndSetData() {
      setLoadingSummary(true);
      
      try {
        // Check if first innings is complete
        if (inning === 2) {
          const firstInningSummary = await fetchInningsSummary(match.id, 1);
          if (firstInningSummary) {
            setInning1Complete(true);
            setTargetScore(firstInningSummary.runs + 1); // Target is always 1 more than first innings score
          }
        }
        
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
        console.error("Error loading innings data:", error);
        toast({
          title: "Error",
          description: "Failed to load innings data",
          variant: "destructive"
        });
      } finally {
        setLoadingSummary(false);
      }
    }
    
    fetchAndSetData();
  }, [inning, team1, team2, match.id, fetchBallEvents, fetchInningsSummary, toast]);

  // Debug logging for state
  useEffect(() => {
    console.log('[LiveScoring] isLive:', isLive);
    console.log('[LiveScoring] showPlayerSelect:', showPlayerSelect);
    console.log('[LiveScoring] striker:', striker);
    console.log('[LiveScoring] nonStriker:', nonStriker);
    console.log('[LiveScoring] bowler:', bowler);
  }, [isLive, showPlayerSelect, striker, nonStriker, bowler]);

  // Handle completion of first innings
  const handleCompleteInnings = async () => {
    try {
      setIsLoading(true);
      // Save the summary
      await upsertInningsSummary({
        matchId: match.id,
        inning: inning,
        runs: summary.runs,
        wickets: summary.wickets,
        overs: summary.overs,
        extras: summary.extras
      });
      
      // Update target score in database
      await supabase
        .from('target_scores')
        .upsert({
          match_id: match.id,
          innings_number: 1,
          target_runs: summary.runs + 1
        });
      
      // Switch to second innings
      setInning(2);
      setInning1Complete(true);
      setTargetScore(summary.runs + 1);
      
      // Reset batting/bowling state for new innings
      setStriker(null);
      setNonStriker(null);
      setBowler(null);
      setShowPlayerSelect(true);
      
      toast({
        title: "Innings Complete",
        description: `First innings completed with ${summary.runs}/${summary.wickets} in ${summary.overs} overs. Target: ${summary.runs + 1}`,
      });
    } catch (error) {
      console.error("Error completing innings:", error);
      toast({
        title: "Error",
        description: "Failed to complete innings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle a new ball event
  async function handleBall(eventType: BallEventType, runs = 0, extras = 0) {
    console.log('[LiveScoring] handleBall called', { eventType, runs, extras, striker, nonStriker, bowler });
    if (!striker || !nonStriker || !bowler) {
      toast({ 
        title: 'Select players', 
        description: 'Please select batsmen and bowler first', 
        variant: 'destructive' 
      });
      setShowPlayerSelect(true);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Handle wicket
      if (eventType === 'wicket') {
        setShowWicketModal(true);
        return;
      }
      
      // Handle extras
      if (eventType === 'wide' || eventType === 'no-ball' || eventType === 'bye' || eventType === 'leg-bye') {
        setExtrasType(eventType);
        setShowExtrasModal(true);
        return;
      }
      
      // Determine ball number: legal deliveries only for ball count
      const legalCount = events.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
      const nextLegal = (eventType === 'wide' || eventType === 'no-ball') ? legalCount : legalCount + 1;
      const overNum = Math.floor((nextLegal - 1) / 6) + 1;
      const ballNum = (eventType === 'wide' || eventType === 'no-ball') ? (legalCount % 6) + 1 : ((nextLegal - 1) % 6) + 1;
      
      // Record the ball event
      console.log('[LiveScoring] addBallEvent payload', {
        matchId: match.id,
        teamId: inning === 1 ? team1!.id : team2!.id,
        inning,
        over: overNum,
        ball: ballNum,
        eventType,
        runs,
        extras,
        batsmanId: striker.id,
        bowlerId: bowler.id,
        nonStrikerId: nonStriker.id,
        isStriker: true
      });
      
      await addBallEvent({
        matchId: match.id,
        teamId: inning === 1 ? team1!.id : team2!.id,
        inning,
        over: overNum,
        ball: ballNum,
        eventType,
        runs,
        extras,
        batsmanId: striker.id,
        bowlerId: bowler.id,
        nonStrikerId: nonStriker.id,
        isStriker: true
      });
      
      console.log('[LiveScoring] addBallEvent success');
      
      // Strike rotation logic
      let swap = false;
      if (eventType === 'run' && runs % 2 === 1) swap = true;
      
      // End of over: swap strike and prompt for new bowler
      if (ballNum === 6 && (eventType !== 'wide' && eventType !== 'no-ball')) {
        swap = !swap;
        setBowler(null);
        setShowPlayerSelect(true);
      }
      
      if (swap) {
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }
      
      // Auto-update match score
      const updatedMatch = {...match};
      if (inning === 1) {
        updatedMatch.scoreTeam1 = {
          runs: summary.runs + runs + extras,
          wickets: summary.wickets,
          overs: summary.overs + ((eventType !== 'wide' && eventType !== 'no-ball') ? 0.1 : 0)
        };
      } else {
        updatedMatch.scoreTeam2 = {
          runs: summary.runs + runs + extras,
          wickets: summary.wickets,
          overs: summary.overs + ((eventType !== 'wide' && eventType !== 'no-ball') ? 0.1 : 0)
        };
      }
      onUpdateScore(updatedMatch);
    } catch (e) {
      console.error('[LiveScoring] addBallEvent error', String(e));
      toast({
        title: "Error",
        description: "Failed to record ball event",
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
        batsmanId: striker.id,
        bowlerId: bowler.id,
        nonStrikerId: nonStriker.id,
        isStriker: true,
        wicketType: wicketType as WicketType,
        fielderId: fielder?.id
      });
      
      // Update the UI
      setShowWicketModal(false);
      setWicketType('');
      setFielder(null);
      
      // Prompt for new batsman
      setShowPlayerSelect(true);
      setStriker(null);
      
      // Remove out batsman from available batsmen
      setAvailableBatsmen(prev => prev.filter(p => p.id !== striker?.id));
      
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
        description: `${striker?.name} is out ${wicketType}`
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
        batsmanId: striker.id,
        bowlerId: bowler.id,
        nonStrikerId: nonStriker.id,
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
          overs: summary.overs + ((extrasType !== 'wide' && extrasType !== 'no-ball') ? 0.1 : 0)
        };
      } else {
        updatedMatch.scoreTeam2 = {
          runs: summary.runs + extrasRuns,
          wickets: summary.wickets,
          overs: summary.overs + ((extrasType !== 'wide' && extrasType !== 'no-ball') ? 0.1 : 0)
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

  // Professional Batting Card
  function BattingCard() {
    // Get all batsmen who have batted (from events)
    const batsmanIds = Array.from(new Set(events.map(e => e.batsmanId)));
    
    const battingCards = batsmanIds.map(id => {
      const player = 
        (inning === 1 ? team1?.players : team2?.players)?.find(p => p.id === id) || 
        {id, name: `Player ${id.substring(0,4)}`};
      
      const playerEvents = events.filter(e => e.batsmanId === id);
      const balls = playerEvents.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
      const runs = playerEvents.reduce((acc, e) => acc + e.runs, 0);
      const fours = playerEvents.filter(e => e.runs === 4).length;
      const sixes = playerEvents.filter(e => e.runs === 6).length;
      
      const isOut = playerEvents.some(e => e.eventType === 'wicket');
      const wicketEvent = playerEvents.find(e => e.eventType === 'wicket');
      
      const wicketType = wicketEvent?.wicketType;
      const bowlerId = wicketEvent?.bowlerId;
      const fielderId = wicketEvent?.fielderId;
      
      const sr = balls > 0 ? ((runs / balls) * 100).toFixed(1) : '0.0';
      
      return { 
        playerId: id,
        playerName: player.name, 
        runs, 
        balls, 
        fours, 
        sixes, 
        strikeRate: parseFloat(sr),
        isOut, 
        wicketType,
        bowlerId,
        fielderId,
        isStriker: striker?.id === id,
        isNonStriker: nonStriker?.id === id
      };
    });
    
    return (
      <div className="mb-4">
        <div className="font-semibold text-base mb-2">Batting</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Batsman</th>
                <th className="text-center">R</th>
                <th className="text-center">B</th>
                <th className="text-center">4s</th>
                <th className="text-center">6s</th>
                <th className="text-center">SR</th>
              </tr>
            </thead>
            <tbody>
              {battingCards.map((b) => {
                const bowlerName = b.bowlerId 
                  ? ((inning === 1 ? team2 : team1)?.players.find(p => p.id === b.bowlerId)?.name || 'Unknown')
                  : '';
                  
                const fielderName = b.fielderId
                  ? ((inning === 1 ? team2 : team1)?.players.find(p => p.id === b.fielderId)?.name || 'Unknown')
                  : '';
                
                // Format dismissal text
                let dismissalText = '';
                if (b.isOut && b.wicketType) {
                  switch (b.wicketType) {
                    case 'bowled':
                      dismissalText = `b ${bowlerName}`;
                      break;
                    case 'caught':
                      dismissalText = `c ${fielderName} b ${bowlerName}`;
                      break;
                    case 'lbw':
                      dismissalText = `lbw b ${bowlerName}`;
                      break;
                    case 'run-out':
                      dismissalText = `run out (${fielderName})`;
                      break;
                    case 'stumped':
                      dismissalText = `st ${fielderName} b ${bowlerName}`;
                      break;
                    case 'hit-wicket':
                      dismissalText = `hit wicket b ${bowlerName}`;
                      break;
                  }
                }
                
                return (
                  <tr key={b.playerId} className={`${b.isStriker || b.isNonStriker ? 'font-bold' : ''} border-b`}>
                    <td className="py-2">
                      {b.playerName} {b.isStriker ? '⚡' : b.isNonStriker ? '🏏' : ''}
                      {b.isOut ? 
                        <span className="text-xs text-gray-600 block">{dismissalText}</span> :
                        b.isStriker || b.isNonStriker ? <span className="text-xs text-green-600 block">not out</span> : ''
                      }
                    </td>
                    <td className="text-center">{b.runs}</td>
                    <td className="text-center">{b.balls}</td>
                    <td className="text-center">{b.fours}</td>
                    <td className="text-center">{b.sixes}</td>
                    <td className="text-center">{b.strikeRate}</td>
                  </tr>
                );
              })}
              
              {battingCards.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-2 text-center text-gray-500">No batsmen yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Professional Bowling Card
  function BowlingCard() {
    // Get all bowlers who have bowled (from events)
    const bowlerIds = Array.from(new Set(events.map(e => e.bowlerId)));
    
    const bowlingCards = bowlerIds.map(id => {
      const player = 
        (inning === 1 ? team2?.players : team1?.players)?.find(p => p.id === id) ||
        {id, name: `Player ${id.substring(0,4)}`};
      
      const playerEvents = events.filter(e => e.bowlerId === id);
      const balls = playerEvents.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
      const completedOvers = Math.floor(balls / 6);
      const remainingBalls = balls % 6;
      
      const runs = playerEvents.reduce((acc, e) => acc + e.runs + e.extras, 0);
      const wickets = playerEvents.filter(e => e.eventType === 'wicket').length;
      
      // Calculate maidens (0 runs in a complete over)
      let maidens = 0;
      for (let over = 1; over <= completedOvers; over++) {
        const overEvents = playerEvents.filter(e => e.over === over);
        const overRuns = overEvents.reduce((acc, e) => acc + e.runs + e.extras, 0);
        if (overRuns === 0 && overEvents.length > 0) {
          maidens++;
        }
      }
      
      let economy = 0;
      if (balls > 0) {
        const oversDecimal = balls / 6;
        economy = runs / oversDecimal;
      }
      
      return {
        playerId: id,
        playerName: player.name,
        overs: completedOvers + (remainingBalls / 10), // Display as e.g., 4.3
        maidens,
        runs,
        wickets,
        economy: parseFloat(economy.toFixed(2)),
        isCurrentBowler: bowler?.id === id
      };
    });
    
    return (
      <div className="mb-4">
        <div className="font-semibold text-base mb-2">Bowling</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Bowler</th>
                <th className="text-center">O</th>
                <th className="text-center">M</th>
                <th className="text-center">R</th>
                <th className="text-center">W</th>
                <th className="text-center">ECON</th>
              </tr>
            </thead>
            <tbody>
              {bowlingCards.map((b) => (
                <tr key={b.playerId} className={`${b.isCurrentBowler ? 'font-bold' : ''} border-b`}>
                  <td className="py-2">{b.playerName} {b.isCurrentBowler && '🎯'}</td>
                  <td className="text-center">{b.overs.toFixed(1)}</td>
                  <td className="text-center">{b.maidens}</td>
                  <td className="text-center">{b.runs}</td>
                  <td className="text-center">{b.wickets}</td>
                  <td className="text-center">{b.economy.toFixed(2)}</td>
                </tr>
              ))}
              
              {bowlingCards.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-2 text-center text-gray-500">No bowlers yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Current Over Display
  function CurrentOver() {
    // Get balls in current over
    const latestOverNum = events.length > 0 
      ? Math.max(...events.map(e => e.over))
      : 0;
      
    const currentOverEvents = events
      .filter(e => e.over === latestOverNum)
      .sort((a, b) => a.ball - b.ball);
      
    const formatBall = (event: BallEvent) => {
      if (event.eventType === 'wicket') return 'W';
      if (event.eventType === 'wide') return 'WD';
      if (event.eventType === 'no-ball') return 'NB';
      if (event.eventType === 'bye') return `${event.extras}B`;
      if (event.eventType === 'leg-bye') return `${event.extras}LB`;
      if (event.runs > 0) return event.runs.toString();
      return '•'; // dot ball
    };
    
    return (
      <div className="mb-4">
        <div className="font-semibold text-base mb-2">This Over</div>
        <div className="flex flex-wrap gap-2">
          {currentOverEvents.length > 0 ? (
            currentOverEvents.map((e, i) => {
              const ballClass = e.eventType === 'wicket' ? 'bg-red-200' :
                e.eventType === 'wide' || e.eventType === 'no-ball' ? 'bg-yellow-200' :
                e.runs === 4 ? 'bg-blue-200' : 
                e.runs === 6 ? 'bg-green-200' :
                'bg-gray-200';
              
              return (
                <span key={i} className={`px-3 py-1.5 rounded-full font-mono ${ballClass}`}>
                  {formatBall(e)}
                </span>
              );
            })
          ) : (
            <span className="text-gray-500">New over will start</span>
          )}
        </div>
      </div>
    );
  }

  // Ball-by-ball log
  function BallLog() {
    const sortedEvents = [...events].sort((a, b) => {
      if (a.over !== b.over) return b.over - a.over;
      return b.ball - a.ball;
    });
    
    const groupedByOver = sortedEvents.reduce((acc, event) => {
      const overKey = `Over ${event.over}`;
      if (!acc[overKey]) acc[overKey] = [];
      acc[overKey].push(event);
      return acc;
    }, {} as Record<string, BallEvent[]>);
    
    const formatBall = (event: BallEvent) => {
      const batsmanName = (inning === 1 ? team1?.players : team2?.players)?.find(p => p.id === event.batsmanId)?.name || 'Unknown';
      const bowlerName = (inning === 1 ? team2?.players : team1?.players)?.find(p => p.id === event.bowlerId)?.name || 'Unknown';
      
      if (event.eventType === 'wicket') {
        return <span className="text-red-600 font-bold">WICKET! {batsmanName} out</span>;
      }
      
      if (event.eventType === 'wide') {
        return <span>Wide, {event.extras} run(s)</span>;
      }
      
      if (event.eventType === 'no-ball') {
        return <span>No Ball, {event.extras} run(s)</span>;
      }
      
      if (event.eventType === 'bye') {
        return <span>{event.extras} Bye(s)</span>;
      }
      
      if (event.eventType === 'leg-bye') {
        return <span>{event.extras} Leg Bye(s)</span>;
      }
      
      if (event.runs === 4) {
        return <span className="text-blue-600">FOUR by {batsmanName}</span>;
      }
      
      if (event.runs === 6) {
        return <span className="text-green-600">SIX by {batsmanName}</span>;
      }
      
      return <span>{event.runs} run(s) by {batsmanName}</span>;
    };
    
    return (
      <div>
        <div className="font-semibold text-base mb-2">Commentary</div>
        {Object.entries(groupedByOver).length > 0 ? (
          Object.entries(groupedByOver).map(([overKey, overEvents]) => (
            <div key={overKey} className="mb-4">
              <div className="font-semibold mb-2">{overKey}</div>
              <div className="space-y-2">
                {overEvents
                  .sort((a, b) => b.ball - a.ball)
                  .map((event, idx) => (
                    <div key={`${event.over}.${event.ball}-${idx}`} className="text-sm border-l-2 border-gray-300 pl-3 py-1">
                      <span className="font-mono text-xs bg-gray-200 px-1 rounded mr-2">{event.over}.{event.ball}</span>
                      {formatBall(event)}
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No balls bowled yet</div>
        )}
      </div>
    );
  }

  // Target/Chase context (for 2nd innings)
  function TargetChase() {
    if (inning === 2 && targetScore) {
      const runsNeeded = targetScore - summary.runs;
      const ballsRemaining = 120 - (summary.completeOvers * 6 + summary.ballsInCurrentOver);
      
      const requiredRunRate = ballsRemaining > 0 ? (runsNeeded / (ballsRemaining / 6)).toFixed(2) : 0;
      
      return (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="font-medium text-blue-700">Target: {targetScore} runs</div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>Need: <span className="font-medium">{runsNeeded}</span> runs</div>
            <div>From: <span className="font-medium">{ballsRemaining}</span> balls</div>
            <div>RR: <span className="font-medium">{runRate}</span></div>
            <div>Req. RR: <span className="font-medium">{requiredRunRate}</span></div>
          </div>
        </div>
      );
    }
    return null;
  }

  // Player selection UI
  function PlayerSelect() {
    if (loadingSummary) {
      return (
        <div className="mb-4 p-4 border rounded bg-gray-50 flex justify-center items-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Loading player data...</span>
        </div>
      );
    }
    
    return (
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h4 className="font-bold mb-3">Select Players</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Striker</label>
            <Select 
              value={striker?.id || ''} 
              onValueChange={(value) => setStriker(availableBatsmen.find(p => p.id === value) || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select batsman" />
              </SelectTrigger>
              <SelectContent>
                {availableBatsmen
                  .filter(p => !nonStriker || p.id !== nonStriker.id)
                  .map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Non-Striker</label>
            <Select 
              value={nonStriker?.id || ''} 
              onValueChange={(value) => setNonStriker(availableBatsmen.find(p => p.id === value) || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select batsman" />
              </SelectTrigger>
              <SelectContent>
                {availableBatsmen
                  .filter(p => !striker || p.id !== striker.id)
                  .map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bowler</label>
            <Select 
              value={bowler?.id || ''} 
              onValueChange={(value) => setBowler(availableBowlers.find(p => p.id === value) || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bowler" />
              </SelectTrigger>
              <SelectContent>
                {availableBowlers.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button 
          className="mt-4" 
          onClick={() => {
            if (striker && nonStriker && bowler) setShowPlayerSelect(false);
          }} 
          disabled={!(striker && nonStriker && bowler)}
        >
          Confirm
        </Button>
      </div>
    );
  }
  
  // Wicket Modal
  function WicketModal() {
    const wicketTypes: WicketType[] = ['bowled', 'caught', 'lbw', 'run-out', 'stumped', 'hit-wicket'];
    
    return (
      <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded">
        <h4 className="font-bold mb-3 text-red-700">Wicket Details</h4>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Out Batsman</label>
            <div className="px-3 py-2 bg-white border rounded">{striker?.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Wicket Type</label>
            <Select 
              value={wicketType} 
              onValueChange={(value) => setWicketType(value as WicketType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="How out?" />
              </SelectTrigger>
              <SelectContent>
                {wicketTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(wicketType === 'caught' || wicketType === 'run-out' || wicketType === 'stumped') && (
            <div>
              <label className="block text-sm font-medium mb-1">Fielder</label>
              <Select 
                value={fielder?.id || ''} 
                onValueChange={(value) => setFielder(availableBowlers.find(p => p.id === value) || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fielder" />
                </SelectTrigger>
                <SelectContent>
                  {availableBowlers.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            variant="destructive"
            onClick={handleWicketConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Wicket
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowWicketModal(false);
              setWicketType('');
              setFielder(null);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
  
  // Extras Modal
  function ExtrasModal() {
    return (
      <div className="mb-4 p-4 border border-yellow-300 bg-yellow-50 rounded">
        <h4 className="font-bold mb-3">Extras Details</h4>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Extras Type</label>
            <div className="px-3 py-2 bg-white border rounded capitalize">{extrasType}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Runs (including extras)</label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map(run => (
                <Button
                  key={run}
                  variant={extrasRuns === run ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setExtrasRuns(run)}
                >
                  {run}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={handleExtrasConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Extras
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowExtrasModal(false);
              setExtrasType('');
              setExtrasRuns(1);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
  
  function ScorecardHeader() {
    return (
      <div className="mb-2">
        {loadingSummary ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold flex items-center">
                  {inning === 1 ? team1?.name : team2?.name}
                  {isLive && <Badge className="ml-2 bg-red-500 animate-pulse">LIVE</Badge>}
                </h3>
                <div className="text-2xl font-bold">
                  {summary.runs}/{summary.wickets}
                </div>
                <div className="text-sm text-gray-600">
                  {summary.overs.toFixed(1)} overs • RR {runRate}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Extras:</span> {summary.extras || 0} runs
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Boundaries:</span> {summary.fours}×4s {summary.sixes}×6s
                </div>
              </div>
            </div>
            
            <TargetChase />
          </>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Live Scoring</span>
          {isLive && (
            <Badge variant="outline" className="font-mono">
              {inning === 1 ? 'Inning 1' : 'Inning 2'}
            </Badge>
          )}
        </CardTitle>
        {!isLive && (
          <CardDescription>
            Start the match to enable live scoring
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isLive ? (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full mb-4">
                <TabsTrigger value="scoring">Scoring</TabsTrigger>
                <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
                <TabsTrigger value="commentary">Commentary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scoring">
                <ScorecardHeader />
                
                {showWicketModal && <WicketModal />}
                {showExtrasModal && <ExtrasModal />}
                {showPlayerSelect && <PlayerSelect />}
                
                <CurrentOver />
                
                {isLive && !showPlayerSelect && !showWicketModal && !showExtrasModal && (
                  <>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Runs</h4>
                      <div className="grid grid-cols-7 gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map(r => (
                          <Button 
                            key={r} 
                            onClick={() => handleBall('run', r, 0)} 
                            disabled={!isLive || isLoading}
                            className={
                              r === 4 ? "bg-blue-600 hover:bg-blue-700" :
                              r === 6 ? "bg-green-600 hover:bg-green-700" :
                              undefined
                            }
                          >
                            {r}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Extras & Wicket</h4>
                      <div className="grid grid-cols-5 gap-2">
                        <Button onClick={() => handleBall('wicket')} disabled={!isLive || isLoading} variant="destructive">
                          Wicket
                        </Button>
                        <Button onClick={() => handleBall('wide')} disabled={!isLive || isLoading} variant="outline">
                          Wide
                        </Button>
                        <Button onClick={() => handleBall('no-ball')} disabled={!isLive || isLoading} variant="outline">
                          No Ball
                        </Button>
                        <Button onClick={() => handleBall('bye')} disabled={!isLive || isLoading} variant="outline">
                          Bye
                        </Button>
                        <Button onClick={() => handleBall('leg-bye')} disabled={!isLive || isLoading} variant="outline">
                          Leg Bye
                        </Button>
                      </div>
                    </div>
                    
                    {inning === 1 && (
                      <div className="mt-6">
                        <Alert className="bg-blue-50">
                          <Info className="h-4 w-4" />
                          <AlertTitle>First Innings</AlertTitle>
                          <AlertDescription>
                            When the first innings is complete, end it here to set the target.
                          </AlertDescription>
                        </Alert>
                        <Button 
                          className="mt-4 w-full" 
                          variant="outline" 
                          onClick={handleCompleteInnings}
                          disabled={isLoading || summary.runs === 0}
                        >
                          {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Disc className="mr-2 h-4 w-4" />
                              End First Innings
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="scorecard">
                <ScorecardHeader />
                <BattingCard />
                <BowlingCard />
              </TabsContent>
              
              <TabsContent value="commentary">
                <ScorecardHeader />
                <BallLog />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Match Not Started</h3>
            <p className="text-gray-500 mb-6">Click the "Start Match" button to begin live scoring</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveScoring;
