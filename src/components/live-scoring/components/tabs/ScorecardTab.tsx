
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { ScorecardHeader } from '../ScorecardHeader';
import { BattingCard } from '../BattingCard';
import { BowlingCard } from '../BowlingCard';
import { BallEvent, Team, Player } from '@/types';

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
