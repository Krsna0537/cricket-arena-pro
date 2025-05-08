
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { ScorecardHeader } from './ScorecardHeader';
import { CurrentOver } from './CurrentOver';
import { BattingCard } from './BattingCard';
import { BowlingCard } from './BowlingCard';
import { BallLog } from './BallLog';
import { PlayerSelect } from './PlayerSelect';
import { WicketModal } from './WicketModal';
import { ExtrasModal } from './ExtrasModal';
import { RunsControls } from './RunsControls';
import { InningsCompletionButton } from './InningsCompletionButton';
import { BallEvent, Team, Player } from '@/types';

interface ScoringTabProps {
  inning: number;
  team1?: Team;
  team2?: Team;
  summary: {
    runs: number;
    wickets: number;
    overs: number;
    extras: number;
    completeOvers: number;
    ballsInCurrentOver: number;
    fours: number;
    sixes: number;
  };
  runRate: string;
  isLive: boolean;
  loadingSummary: boolean;
  targetScore: number | null;
  events: BallEvent[];
  showPlayerSelect: boolean;
  showWicketModal: boolean;
  showExtrasModal: boolean;
  extrasType: string;
  extrasRuns: number;
  setExtrasRuns: (runs: number) => void;
  handleExtrasConfirm: () => void;
  setShowExtrasModal: (show: boolean) => void;
  setExtrasType: (type: string) => void;
  wicketType: string;
  setWicketType: (type: any) => void;
  fielder: Player | null;
  setFielder: (player: Player | null) => void;
  striker: Player | null;
  nonStriker: Player | null;
  bowler: Player | null;
  availableBatsmen: Player[];
  availableBowlers: Player[];
  setStriker: (player: Player | null) => void;
  setNonStriker: (player: Player | null) => void;
  setBowler: (player: Player | null) => void;
  setShowPlayerSelect: (show: boolean) => void;
  setShowWicketModal: (show: boolean) => void;
  handleWicketConfirm: () => void;
  isLoading: boolean;
  handleBall: (eventType: any, runs?: number, extras?: number) => void;
  handleCompleteInnings: () => void;
}

export const ScoringTab: React.FC<ScoringTabProps> = ({
  inning,
  team1,
  team2,
  summary,
  runRate,
  isLive,
  loadingSummary,
  targetScore,
  events,
  showPlayerSelect,
  showWicketModal,
  showExtrasModal,
  extrasType,
  extrasRuns,
  setExtrasRuns,
  handleExtrasConfirm,
  setShowExtrasModal,
  setExtrasType,
  wicketType,
  setWicketType,
  fielder,
  setFielder,
  striker,
  nonStriker,
  bowler,
  availableBatsmen,
  availableBowlers,
  setStriker,
  setNonStriker,
  setBowler,
  setShowPlayerSelect,
  setShowWicketModal,
  handleWicketConfirm,
  isLoading,
  handleBall,
  handleCompleteInnings,
}) => {
  return (
    <TabsContent value="scoring">
      <ScorecardHeader 
        inning={inning} 
        team1={team1} 
        team2={team2} 
        summary={{
          ...summary,
          completeOvers: summary.completeOvers,
          ballsInCurrentOver: summary.ballsInCurrentOver
        }} 
        runRate={runRate}
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
  );
};

interface ScorecardTabProps {
  inning: number;
  team1?: Team;
  team2?: Team;
  summary: {
    runs: number;
    wickets: number;
    overs: number;
    completeOvers: number;
    ballsInCurrentOver: number;
    fours: number;
    sixes: number;
  }; 
  runRate: string;
  isLive: boolean;
  loadingSummary: boolean;
  targetScore: number | null;
  events: BallEvent[];
  striker: Player | null;
  nonStriker: Player | null;
  bowler: Player | null;
}

export const ScorecardTab: React.FC<ScorecardTabProps> = ({
  inning,
  team1,
  team2,
  summary,
  runRate,
  isLive,
  loadingSummary,
  targetScore,
  events,
  striker,
  nonStriker,
  bowler
}) => {
  return (
    <TabsContent value="scorecard">
      <ScorecardHeader 
        inning={inning} 
        team1={team1} 
        team2={team2} 
        summary={{
          ...summary,
          completeOvers: summary.completeOvers,
          ballsInCurrentOver: summary.ballsInCurrentOver
        }} 
        runRate={runRate}
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
  );
};

interface CommentaryTabProps {
  inning: number;
  team1?: Team;
  team2?: Team;
  summary: {
    runs: number;
    wickets: number;
    overs: number;
    completeOvers: number;
    ballsInCurrentOver: number;
    fours: number;
    sixes: number;
  };
  runRate: string;
  isLive: boolean;
  loadingSummary: boolean;
  targetScore: number | null;
  events: BallEvent[];
}

export const CommentaryTab: React.FC<CommentaryTabProps> = ({
  inning,
  team1,
  team2,
  summary,
  runRate,
  isLive,
  loadingSummary,
  targetScore,
  events
}) => {
  return (
    <TabsContent value="commentary">
      <ScorecardHeader 
        inning={inning} 
        team1={team1} 
        team2={team2} 
        summary={{
          ...summary,
          completeOvers: summary.completeOvers,
          ballsInCurrentOver: summary.ballsInCurrentOver
        }} 
        runRate={runRate}
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
  );
};
