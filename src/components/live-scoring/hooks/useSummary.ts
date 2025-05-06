
import { useMemo } from 'react';
import { BallEvent } from '@/types';

interface SummaryResult {
  runs: number;
  wickets: number;
  overs: number;
  completeOvers: number;
  ballsInCurrentOver: number;
  extras: number;
  fours: number;
  sixes: number;
  runRate: string;
}

export const useSummary = (events: BallEvent[]): SummaryResult => {
  return useMemo(() => {
    const legalCount = events.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
    const completeOvers = Math.floor(legalCount / 6);
    const ballsInCurrentOver = legalCount % 6;
    const overs = completeOvers + (ballsInCurrentOver / 10);
    
    const runs = events.reduce((acc, e) => acc + e.runs + e.extras, 0);
    const wickets = events.filter(e => e.eventType === 'wicket').length;
    
    const extras = events.reduce((acc, e) => acc + e.extras, 0);
    const fours = events.filter(e => e.runs === 4).length;
    const sixes = events.filter(e => e.runs === 6).length;

    // Calculate run rate
    const runRateValue = completeOvers === 0 && ballsInCurrentOver === 0 
      ? "0.00"
      : (runs / (completeOvers + (ballsInCurrentOver / 6))).toFixed(2);
    
    return { 
      runs, 
      wickets, 
      overs,
      completeOvers,
      ballsInCurrentOver,
      extras,
      fours,
      sixes,
      runRate: runRateValue
    };
  }, [events]);
};
