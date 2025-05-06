import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Team, Match, BallEventType, Player, WicketType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useApp, useLiveBallEvents } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';

// Imported components
import { ScorecardHeader } from './components/ScorecardHeader';
import { BattingCard } from './components/BattingCard';
import { BowlingCard } from './components/BowlingCard';
import { CurrentOver } from './components/CurrentOver';
import { BallLog } from './components/BallLog';
import { PlayerSelect } from './components/PlayerSelect';
import { WicketModal } from './components/WicketModal';
import { ExtrasModal } from './components/ExtrasModal';
import { RunsControls } from './components/RunsControls';
import { InningsCompletionButton } from './components/InningsCompletionButton';
import MatchNotStartedPlaceholder from './components/MatchNotStartedPlaceholder';
import { useSummary } from './hooks/useSummary';

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
  const summary = useSummary(events);

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
        setIsLoading(false);
        return;
      }
      
      // Handle extras
      if (eventType === 'wide' || eventType === 'no-ball' || eventType === 'bye' || eventType === 'leg-bye') {
        setExtrasType(eventType);
        setShowExtrasModal(true);
        setIsLoading(false);
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
        batsmanId: striker!.id,
        bowlerId: bowler!.id,
        nonStrikerId: nonStriker!.id,
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
        batsmanId: striker!.id,
        bowlerId: bowler!.id,
        nonStrikerId: nonStriker!.id,
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
                <ScorecardHeader 
                  inning={inning} 
                  team1={team1} 
                  team2={team2} 
                  summary={summary} 
                  runRate={summary.runRate}
                  isLive={isLive}
                  loadingSummary={loadingSummary}
                  targetScore={targetScore}
                />
                
                {showWicketModal && (
                  <WicketModal
                    striker={striker}
                    wicketType={wicketType}
                    setWicketType={setWicketType}
                    fielder={fielder}
                    setFielder={setFielder}
                    availableBowlers={availableBowlers}
                    handleWicketConfirm={handleWicketConfirm}
                    setShowWicketModal={setShowWicketModal}
                    isLoading={isLoading}
                  />
                )}
                
                {showExtrasModal && (
                  <ExtrasModal
                    extrasType={extrasType}
                    extrasRuns={extrasRuns}
                    setExtrasRuns={setExtrasRuns}
                    handleExtrasConfirm={handleExtrasConfirm}
                    setShowExtrasModal={setShowExtrasModal}
                    setExtrasType={setExtrasType}
                    isLoading={isLoading}
                  />
                )}
                
                {showPlayerSelect && (
                  <PlayerSelect
                    loadingSummary={loadingSummary}
                    striker={striker}
                    nonStriker={nonStriker}
                    bowler={bowler}
                    availableBatsmen={availableBatsmen}
                    availableBowlers={availableBowlers}
                    setStriker={setStriker}
                    setNonStriker={setNonStriker}
                    setBowler={setBowler}
                    setShowPlayerSelect={setShowPlayerSelect}
                  />
                )}
                
                <CurrentOver events={events} />
                
                {isLive && !showPlayerSelect && !showWicketModal && !showExtrasModal && (
                  <>
                    <RunsControls 
                      isLive={isLive} 
                      isLoading={isLoading} 
                      handleBall={handleBall} 
                    />
                    
                    <InningsCompletionButton
                      inning={inning}
                      isLoading={isLoading}
                      handleCompleteInnings={handleCompleteInnings}
                      summary={summary}
                    />
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="scorecard">
                <ScorecardHeader 
                  inning={inning} 
                  team1={team1} 
                  team2={team2} 
                  summary={summary} 
                  runRate={summary.runRate}
                  isLive={isLive}
                  loadingSummary={loadingSummary}
                  targetScore={targetScore}
                />
                
                <BattingCard 
                  events={events} 
                  inning={inning} 
                  team1={team1} 
                  team2={team2}
                  striker={striker}
                  nonStriker={nonStriker}
                />
                
                <BowlingCard 
                  events={events} 
                  inning={inning} 
                  team1={team1} 
                  team2={team2}
                  bowler={bowler}
                />
              </TabsContent>
              
              <TabsContent value="commentary">
                <ScorecardHeader 
                  inning={inning} 
                  team1={team1} 
                  team2={team2} 
                  summary={summary} 
                  runRate={summary.runRate}
                  isLive={isLive}
                  loadingSummary={loadingSummary}
                  targetScore={targetScore}
                />
                
                <BallLog 
                  events={events} 
                  inning={inning} 
                  team1={team1} 
                  team2={team2} 
                />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <MatchNotStartedPlaceholder />
        )}
      </CardContent>
    </Card>
  );
};

export default LiveScoring;
