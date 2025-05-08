
import React from 'react';

interface TargetChaseProps {
  inning: number;
  targetScore: number | null;
  summary: {
    runs: number;
    completeOvers: number;
    ballsInCurrentOver: number;
  };
  totalOvers?: number;
}

export const TargetChase: React.FC<TargetChaseProps> = ({ inning, targetScore, summary, totalOvers = 20 }) => {
  if (inning === 2 && targetScore) {
    const runsNeeded = targetScore - summary.runs;
    const maxBalls = totalOvers * 6;
    const ballsRemaining = maxBalls - (summary.completeOvers * 6 + summary.ballsInCurrentOver);
    
    const requiredRunRate = ballsRemaining > 0 ? (runsNeeded / (ballsRemaining / 6)).toFixed(2) : "0.00";
    const currentRunRate = summary.completeOvers > 0 || summary.ballsInCurrentOver > 0 ? 
      (summary.runs / (summary.completeOvers + (summary.ballsInCurrentOver / 6))).toFixed(2) : "0.00";
    
    return (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="font-medium text-blue-700">Target: {targetScore} runs</div>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div>Need: <span className="font-medium">{runsNeeded}</span> runs</div>
          <div>From: <span className="font-medium">{ballsRemaining}</span> balls</div>
          <div>RR: <span className="font-medium">{currentRunRate}</span></div>
          <div>Req. RR: <span className="font-medium">{requiredRunRate}</span></div>
        </div>
      </div>
    );
  }
  return null;
};
