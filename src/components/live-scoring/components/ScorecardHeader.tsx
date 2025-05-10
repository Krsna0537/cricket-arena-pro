import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { Team } from '@/types';
import { TargetChase } from './TargetChase';

interface ScorecardHeaderProps {
  inning: number;
  team1?: Team;
  team2?: Team;
  summary: {
    runs: number;
    wickets: number;
    overs: number;
    extras?: number;
    fours: number;
    sixes: number;
    completeOvers: number;
    ballsInCurrentOver: number;
  };
  runRate: string;
  isLive: boolean;
  loadingSummary: boolean;
  targetScore: number | null;
  totalOvers: number;
}

export const ScorecardHeader: React.FC<ScorecardHeaderProps> = ({
  inning, 
  team1, 
  team2, 
  summary, 
  runRate, 
  isLive, 
  loadingSummary,
  targetScore,
  totalOvers
}) => {
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
          
          <TargetChase 
            inning={inning} 
            targetScore={targetScore} 
            summary={{
              runs: summary.runs,
              completeOvers: summary.completeOvers,
              ballsInCurrentOver: summary.ballsInCurrentOver
            }} 
            totalOvers={totalOvers}
          />
        </>
      )}
    </div>
  );
};
