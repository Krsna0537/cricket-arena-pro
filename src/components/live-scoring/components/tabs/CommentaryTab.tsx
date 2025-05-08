
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { ScorecardHeader } from '../ScorecardHeader';
import { BallLog } from '../BallLog';
import { BallEvent, Team } from '@/types';

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
