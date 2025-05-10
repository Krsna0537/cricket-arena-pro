import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Match } from '@/types';
import { useLiveBallEvents } from '@/hooks/useLiveBallEvents';
import { Team } from '@/types';

// Imported components
import { ScoringTab, ScorecardTab, CommentaryTab } from './components/TabsContent';
import MatchNotStartedPlaceholder from './components/MatchNotStartedPlaceholder';
import { useSummary } from './hooks/useSummary';
import { usePlayerState } from './hooks/usePlayerState';
import { useBallEventHandlers } from './hooks/ball-events';
import { useInningsManagement } from './hooks/useInningsManagement';

interface LiveScoringProps {
  match: Match;
  team1?: Team;
  team2?: Team;
  onUpdateScore: (match: Match) => void;
}

const LiveScoring: React.FC<LiveScoringProps> = ({ match, team1, team2, onUpdateScore }) => {
  const isLive = match.status === 'live';
  const [activeTab, setActiveTab] = useState<string>("scoring");
  
  // Use our custom hooks to manage complex state
  const { 
    inning, 
    loadingSummary,
    targetScore,
    handleCompleteInnings 
  } = useInningsManagement(match, {
    runs: 0, 
    wickets: 0, 
    overs: 0,
    extras: 0 
  });
  
  // Get real-time ball events
  const events = useLiveBallEvents(match.id, inning);
  
  // Calculate score summary
  const summary = useSummary(events);

  // Player state management
  const playerState = usePlayerState(match, inning, team1, team2, events);
  
  // Ball event handlers
  const eventHandlers = useBallEventHandlers(
    match, 
    inning, 
    team1, 
    team2, 
    events,
    summary,
    onUpdateScore,
    {
      striker: playerState.striker,
      setStriker: playerState.setStriker,
      nonStriker: playerState.nonStriker,
      setNonStriker: playerState.setNonStriker,
      bowler: playerState.bowler,
      setBowler: playerState.setBowler,
      setShowPlayerSelect: playerState.setShowPlayerSelect,
      updateAvailableBatsmenAfterWicket: playerState.updateAvailableBatsmenAfterWicket
    }
  );

  // Debug logging for state
  React.useEffect(() => {
    console.log('[LiveScoring] isLive:', isLive);
    console.log('[LiveScoring] showPlayerSelect:', playerState.showPlayerSelect);
    console.log('[LiveScoring] striker:', playerState.striker);
    console.log('[LiveScoring] nonStriker:', playerState.nonStriker);
    console.log('[LiveScoring] bowler:', playerState.bowler);
  }, [isLive, playerState.showPlayerSelect, playerState.striker, playerState.nonStriker, playerState.bowler]);

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="scoring">Scoring</TabsTrigger>
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
              <TabsTrigger value="commentary">Commentary</TabsTrigger>
            </TabsList>
            
            <ScoringTab
              inning={inning}
              team1={team1}
              team2={team2}
              summary={{
                ...summary,
                completeOvers: summary.completeOvers,
                ballsInCurrentOver: summary.ballsInCurrentOver
              }}
              runRate={summary.runRate}
              isLive={isLive}
              loadingSummary={loadingSummary}
              targetScore={targetScore}
              events={events}
              showPlayerSelect={playerState.showPlayerSelect}
              showWicketModal={eventHandlers.showWicketModal}
              showExtrasModal={eventHandlers.showExtrasModal}
              extrasType={eventHandlers.extrasType}
              extrasRuns={eventHandlers.extrasRuns}
              setExtrasRuns={eventHandlers.setExtrasRuns}
              handleExtrasConfirm={eventHandlers.handleExtrasConfirm}
              setShowExtrasModal={eventHandlers.setShowExtrasModal}
              setExtrasType={eventHandlers.setExtrasType}
              wicketType={eventHandlers.wicketType}
              setWicketType={eventHandlers.setWicketType}
              fielder={eventHandlers.fielder}
              setFielder={eventHandlers.setFielder}
              striker={playerState.striker}
              nonStriker={playerState.nonStriker}
              bowler={playerState.bowler}
              availableBatsmen={playerState.availableBatsmen}
              availableBowlers={playerState.availableBowlers}
              setStriker={playerState.setStriker}
              setNonStriker={playerState.setNonStriker}
              setBowler={playerState.setBowler}
              setShowPlayerSelect={playerState.setShowPlayerSelect}
              setShowWicketModal={eventHandlers.setShowWicketModal}
              handleWicketConfirm={eventHandlers.handleWicketConfirm}
              isLoading={eventHandlers.isLoading}
              handleBall={eventHandlers.handleBall}
              handleCompleteInnings={handleCompleteInnings}
              totalOvers={match.overs}
            />
            
            <ScorecardTab
              inning={inning}
              team1={team1}
              team2={team2}
              summary={{
                ...summary,
                completeOvers: summary.completeOvers,
                ballsInCurrentOver: summary.ballsInCurrentOver
              }}
              runRate={summary.runRate}
              isLive={isLive}
              loadingSummary={loadingSummary}
              targetScore={targetScore}
              events={events}
              striker={playerState.striker}
              nonStriker={playerState.nonStriker}
              bowler={playerState.bowler}
            />
            
            <CommentaryTab
              inning={inning}
              team1={team1}
              team2={team2}
              summary={{
                ...summary,
                completeOvers: summary.completeOvers,
                ballsInCurrentOver: summary.ballsInCurrentOver
              }}
              runRate={summary.runRate}
              isLive={isLive}
              loadingSummary={loadingSummary}
              targetScore={targetScore}
              events={events}
            />
          </Tabs>
        ) : (
          <MatchNotStartedPlaceholder />
        )}
      </CardContent>
    </Card>
  );
};

export default LiveScoring;
